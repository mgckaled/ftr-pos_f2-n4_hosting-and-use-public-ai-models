# Guia: Lint e Format Python - Pylint vs Ruff

## Resumo Executivo

**Recomendação**: Use **Ruff** para lint E formatação (substitui pylint + black + isort).

**Por quê?**

- **10-100x mais rápido** que ferramentas tradicionais
- **Substitui múltiplas ferramentas** em uma só
- **Integração perfeita com UV** (ambos desenvolvidos pela Astral)
- **Mesmo resultado** que ferramentas tradicionais
- **Configuração simples** em `pyproject.toml`

## Comparação: Pylint vs Ruff

### Pylint (Ferramenta Tradicional)

```bash
# Instalação
pip install pylint

# Uso
pylint meu_arquivo.py
pylint src/
```

**Vantagens:**

- Maduro e estável (desde 2003)
- Análise detalhada de código
- Mensagens de erro descritivas
- Integração com IDEs

**Desvantagens:**

- Lento em projetos grandes
- Configuração complexa
- Não formata código (precisa de Black)
- Não organiza imports (precisa de isort)

### Ruff (Ferramenta Moderna)

```bash
# Instalação com UV (recomendado)
uv add --dev ruff

# Ou instalação global
uv tool install ruff@latest

# Uso
ruff check .                    # Lint
ruff check . --fix              # Lint + auto-fix
ruff format .                   # Formatação
ruff check . --fix && ruff format .  # Completo
```

**Vantagens:**

- **Extremamente rápido** (escrito em Rust)
- **All-in-one**: lint + format + import sorting
- Integração nativa com UV
- Compatível com regras de pylint, flake8, isort, black
- Configuração simples
- Auto-fix para maioria dos problemas

**Desvantagens:**

- Relativamente novo (2022)
- Algumas regras pylint avançadas ainda não implementadas

## Performance

### Benchmark Real (CPython codebase)

```text
pylint:  ~60 segundos
ruff:    ~0.6 segundos (100x mais rápido)
```

### Por que Ruff é tão rápido?

1. **Escrito em Rust** (linguagem compilada)
2. **Paralelização nativa**
3. **Análise otimizada de AST**
4. **Cache inteligente**

## Ferramentas que Ruff Substitui

| Ferramenta    | Função                  | Ruff Equivalente    |
|---------------|-------------------------|---------------------|
| pylint        | Linting                 | `ruff check`        |
| flake8        | Linting                 | `ruff check`        |
| black         | Formatação              | `ruff format`       |
| isort         | Ordenação de imports    | `ruff check --select I` |
| pyupgrade     | Modernização de código  | `ruff check --select UP` |
| autoflake     | Remove imports não usados | `ruff check --fix` |

## Configuração Recomendada

### pyproject.toml

```toml
[project]
name = "tts-api"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.0.0",
    "transformers>=4.30.0",
]

[project.optional-dependencies]
dev = [
    "ruff>=0.8.0",
    "pytest>=8.0.0",
    "mypy>=1.8.0",
]

# Configuração do Ruff
[tool.ruff]
# Mesmo line-length que Black (padrão)
line-length = 88
indent-width = 4

# Python 3.11+
target-version = "py311"

# Excluir diretórios
exclude = [
    ".git",
    ".venv",
    "__pycache__",
    "build",
    "dist",
    "*.egg-info",
]

[tool.ruff.lint]
# Regras habilitadas (equivalente a pylint + flake8 + mais)
select = [
    "E",      # pycodestyle errors
    "W",      # pycodestyle warnings
    "F",      # Pyflakes
    "I",      # isort
    "B",      # flake8-bugbear
    "C4",     # flake8-comprehensions
    "UP",     # pyupgrade
    "ARG",    # flake8-unused-arguments
    "SIM",    # flake8-simplify
    "PL",     # Pylint (subset)
]

# Regras ignoradas
ignore = [
    "E501",   # Line too long (deixar Black/Ruff format decidir)
    "B008",   # Function calls in argument defaults (comum em FastAPI/Flask)
    "PLR0913", # Too many arguments (às vezes necessário)
]

# Auto-fix quando possível
fixable = ["ALL"]
unfixable = []

# Regras específicas por arquivo
[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401", "F403"]  # Imports não usados em __init__
"tests/**/*.py" = [
    "S101",   # Use of assert (normal em testes)
    "ARG",    # Unused arguments (fixtures)
    "PLR2004", # Magic values (OK em testes)
]

[tool.ruff.format]
# Estilo de aspas (compatível com Black)
quote-style = "double"

# Indentação com espaços
indent-style = "space"

# Line ending automático
line-ending = "auto"

# Formatar docstrings
docstring-code-format = true

[tool.ruff.lint.isort]
# Importações conhecidas do projeto
known-first-party = ["tts_api"]

# Seções de import
section-order = [
    "future",
    "standard-library",
    "third-party",
    "first-party",
    "local-folder",
]
```

## Workflow Completo com UV + Ruff

### 1. Criar Projeto

```bash
# Criar projeto
uv init tts-api
cd tts-api

# Adicionar Ruff como dependência de dev
uv add --dev ruff
```

### 2. Configurar pyproject.toml

```bash
# Editar pyproject.toml com configuração acima
```

### 3. Comandos Diários

```bash
# Verificar problemas (sem corrigir)
uv run ruff check .

# Verificar + corrigir automaticamente
uv run ruff check . --fix

# Formatar código
uv run ruff format .

# Verificar formatação (CI/CD)
uv run ruff format . --check

# Combo completo (recomendado)
uv run ruff check . --fix && uv run ruff format .
```

### 4. Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.0
    hooks:
      # Linter
      - id: ruff-check
        args: [--fix]

      # Formatter
      - id: ruff-format
```

```bash
# Instalar pre-commit
uv tool install pre-commit
pre-commit install

# Testar
pre-commit run --all-files
```

### 5. CI/CD (GitHub Actions)

```yaml
# .github/workflows/lint.yml
name: Lint

on: [push, pull_request]

jobs:
  ruff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v5

      - name: Set up Python
        run: uv python install 3.11

      - name: Install dependencies
        run: uv sync

      - name: Run Ruff linter
        run: uv run ruff check .

      - name: Run Ruff formatter check
        run: uv run ruff format --check .
```

## Integração com IDEs

### VS Code

```json
// .vscode/settings.json
{
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    }
  },
  "ruff.lint.enable": true,
  "ruff.lint.run": "onSave"
}
```

**Extensão necessária:**

- `charliermarsh.ruff` (Ruff)

### PyCharm / IntelliJ IDEA

1. Instalar plugin "Ruff"
2. Settings → Tools → Ruff
3. Habilitar "Run Ruff on save"
4. Configurar executável: `uv run ruff`

## Migração de Pylint para Ruff

### Passo 1: Mapear Regras

```toml
# Pylint → Ruff equivalente
[tool.ruff.lint]
select = [
    "E",   # pylint: convention/error
    "F",   # pylint: error (undefined names)
    "B",   # pylint: warning (bugbear)
    "PL",  # pylint: regras específicas
]
```

### Passo 2: Configurar Limites

```toml
[tool.ruff.lint.pylint]
max-args = 5              # Máximo de argumentos por função
max-branches = 12         # Máximo de branches (if/else)
max-returns = 6           # Máximo de returns por função
max-statements = 50       # Máximo de statements por função
```

### Passo 3: Testar Gradualmente

```bash
# Ver o que mudaria
uv run ruff check . --diff

# Aplicar mudanças aos poucos
uv run ruff check src/ --fix
uv run ruff check tests/ --fix
```

## Exemplo Completo: Projeto Flask

### Estrutura

```text
tts-api/
├── pyproject.toml        # Configuração UV + Ruff
├── .pre-commit-config.yaml
├── src/
│   └── tts_api/
│       ├── __init__.py
│       ├── app.py
│       └── model.py
└── tests/
    └── test_app.py
```

### pyproject.toml ()

```toml
[project]
name = "tts-api"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.0.0",
    "transformers>=4.30.0",
    "torch>=2.0.0",
]

[project.optional-dependencies]
dev = [
    "ruff>=0.8.0",
    "pytest>=8.0.0",
    "pytest-cov>=4.0.0",
]

[tool.ruff]
line-length = 88
target-version = "py311"
src = ["src"]

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "SIM", "PL"]
ignore = ["E501"]

[tool.ruff.lint.per-file-ignores]
"tests/**/*.py" = ["S101", "ARG"]
```

### Comandos

```bash
# Setup
uv sync
uv add --dev ruff

# Desenvolvimento
uv run ruff check . --fix && uv run ruff format .

# CI
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

## Dicas Avançadas

### 1. Verificar Compatibilidade com Black

```bash
# Ruff format é compatível com Black por padrão
# Se quiser garantir 100% de compatibilidade:
uv run ruff format . --check
```

### 2. Customizar Regras por Diretório

```toml
[tool.ruff.lint.per-file-ignores]
"scripts/**/*.py" = ["T201"]  # Permitir print() em scripts
"notebooks/**/*.py" = ["E402", "F401"]  # Permitir imports no meio
```

### 3. Ver Todas as Regras Disponíveis

```bash
# Listar todas as regras
uv run ruff rule --all

# Ver detalhes de uma regra específica
uv run ruff rule E501
```

### 4. Ignorar Linha Específica

```python
# noqa: E501 - Ignora regra E501 nesta linha
very_long_url = "https://example.com/very/long/url/that/exceeds/line/limit"  # noqa: E501

# noqa - Ignora todas as regras nesta linha
x = dangerous_operation()  # noqa
```

### 5. Configuração Hierárquica (Monorepo)

```toml
# Root pyproject.toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "B"]

# apps/tts-api/pyproject.toml
[tool.ruff]
extend = "../../pyproject.toml"  # Herda configuração root

[tool.ruff.lint]
extend-select = ["I", "UP"]  # Adiciona mais regras
```

## Comparação Final

| Aspecto               | Pylint          | Ruff            |
|-----------------------|-----------------|-----------------|
| **Performance**       | Lento (60s)     | Rápido (0.6s)   |
| **Linguagem**         | Python          | Rust            |
| **Instalação**        | pip             | UV (nativo)     |
| **Formatação**        | ❌ (precisa Black) | ✅ `ruff format` |
| **Import sorting**    | ❌ (precisa isort) | ✅ built-in     |
| **Auto-fix**          | Limitado        | Extensivo       |
| **Configuração**      | Complexa        | Simples         |
| **Integração UV**     | Externa         | Nativa          |
| **Cache**             | Básico          | Avançado        |
| **Monorepo support**  | Limitado        | Excelente       |

## Recomendação Final

### Para Projetos Novos

```bash
# Use Ruff desde o início
uv init meu-projeto
cd meu-projeto
uv add --dev ruff
# Configurar pyproject.toml (ver seção acima)
```

### Para Projetos Existentes com Pylint

**Opção 1: Migração gradual**:

```bash
# Manter pylint e adicionar Ruff
uv add --dev ruff

# Testar em paralelo
uv run pylint src/
uv run ruff check src/

# Quando confortável, remover pylint
uv remove pylint
```

**Opção 2: Migração completa**:

```bash
# Remover ferramentas antigas
uv remove pylint black isort flake8

# Adicionar Ruff
uv add --dev ruff

# Configurar pyproject.toml
# Rodar e corrigir
uv run ruff check . --fix
uv run ruff format .
```

## Recursos Adicionais

- **Ruff Docs**: <https://docs.astral.sh/ruff/>
- **Ruff Rules**: <https://docs.astral.sh/ruff/rules/>
- **UV Docs**: <https://docs.astral.sh/uv/>
- **Ruff GitHub**: <https://github.com/astral-sh/ruff>

## Conclusão

Para o projeto **Hospedagem e uso de modelos públicos de IA**:

✅ **Use Ruff** para lint e formatação
✅ **Integração perfeita com UV**
✅ **Performance 100x melhor**
✅ **Configuração simples**
✅ **Substitui múltiplas ferramentas**

**Comando único para qualidade de código:**

```bash
uv run ruff check . --fix && uv run ruff format .
```
