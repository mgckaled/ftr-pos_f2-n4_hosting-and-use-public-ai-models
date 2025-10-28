# Guia Completo: UV - Python Package Manager

## O que é UV?

**UV** é um gerenciador de pacotes e projetos Python **extremamente rápido**, escrito em Rust pela
[Astral](https://astral.sh/) (mesmos criadores do Ruff). É uma ferramenta moderna que substitui
múltiplas ferramentas tradicionais em uma única solução.

### UV substitui

- **pyenv** → Gerenciamento de versões Python.
- **pip** → Instalação de pacotes.
- **pip-tools** → Compilação de requirements.
- **venv** → Criação de ambientes virtuais.
- **pipenv** → Gerenciamento de dependências (Pipfile).
- **poetry** → Gerenciamento completo de projetos.
- **pipx** → Instalação de ferramentas globais.

---

## Por que usar UV?

### 1. Performance Absurda

```bash
# Benchmark real (Context7)
UV:      1-2 segundos para instalar 100 pacotes
Poetry:  30-60 segundos
Pipenv:  60-120 segundos
Pip:     ~45 segundos

# Velocidade: 10-100x mais rápido que pip/poetry
```

### 2. Tudo-em-um

```bash
# Uma ferramenta para tudo
uv python install 3.11    # Instala Python
uv venv                   # Cria venv
uv add flask              # Adiciona pacote
uv sync                   # Sincroniza deps
uv run python app.py      # Executa código
uv lock                   # Gera lockfile
```

### 3. pyproject.toml Nativo (PEP 621)

```toml
[project]
name = "meu-projeto"
version = "0.1.0"
dependencies = [
    "flask>=3.1.0",
    "pydantic>=2.10.0"
]

[dependency-groups]
dev = ["pytest>=8.3.0", "black>=24.10.0"]
```

### 4. Cache Inteligente

- Downloads são cacheados automaticamente.
- Reutilização entre projetos.
- Builds incrementais.

---

## Instalação

### Windows (PowerShell)

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Linux / macOS

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Verificar Instalação

```bash
uv --version
# Output: uv 0.5.x (ou superior)
```

---

## Comandos Essenciais

### 1. Gerenciamento de Versões Python

```bash
# Instalar Python
uv python install 3.11
uv python install 3.10 3.11 3.12    # Múltiplas versões

# Instalar implementações alternativas
uv python install pypy@3.9

# Listar versões instaladas
uv python list
uv python list --only-installed

# Fixar versão no projeto
uv python pin 3.11                  # Cria .python-version
uv python pin 3.11.5                # Versão específica

# Encontrar interpretador
uv python find
uv python find 3.11
```

### 2. Criar Ambientes Virtuais

```bash
# Criar venv padrão (.venv)
uv venv

# Criar com nome customizado
uv venv my-env

# Criar com versão específica
uv venv --python 3.11
uv venv --python /usr/bin/python3.10

# Criar com acesso a pacotes do sistema
uv venv --system-site-packages

# Ativar ambiente (após criar)
# Linux/macOS:
source .venv/bin/activate

# Windows PowerShell:
.venv\Scripts\activate

# Windows CMD:
.venv\Scripts\activate.bat

# Desativar
deactivate
```

### 3. Gerenciamento de Projetos

```bash
# Inicializar novo projeto
uv init meu-projeto
cd meu-projeto

# Inicializar em diretório existente
uv init

# Inicializar com Python específico
uv init --python 3.11 meu-app

# Tipos de projeto
uv init --lib meu-pacote        # Biblioteca (publicável)
uv init --app minha-app         # Aplicação
uv init --bare projeto-minimo   # Mínimo (sem descrição/readme)
```

### 4. Adicionar e Remover Dependências

```bash
# Adicionar pacote
uv add flask
uv add "requests>=2.28.0"
uv add "django<5.0"

# Adicionar múltiplos pacotes
uv add flask pydantic sqlalchemy

# Adicionar em grupo específico (dev, test, docs)
uv add pytest --group dev
uv add black ruff mypy --group dev
uv add sphinx --group docs

# Adicionar com extras
uv add "fastapi[standard]"

# Remover pacote
uv remove flask
uv remove pytest --group dev
```

### 5. Instalar Dependências

```bash
# Instalar todas as dependências do projeto
uv sync

# Instalar apenas dependências principais (sem dev)
uv sync --no-dev

# Instalar com grupo específico
uv sync --group dev
uv sync --group test --group docs

# Instalar sem instalar o projeto em si
uv sync --no-install-project

# Forçar reinstalação
uv sync --reinstall
```

### 6. Executar Código

```bash
# Executar comando no ambiente do projeto
uv run python app.py
uv run python -c "import flask; print(flask.__version__)"

# Executar script
uv run pytest
uv run black .
uv run mypy src/

# Executar com Python específico
uv run --python 3.11 script.py
uv run --python pypy@3.8 -- python app.py
```

### 7. Lockfile

```bash
# Gerar/atualizar lockfile (uv.lock)
uv lock

# Lock sem atualizar versões
uv lock --frozen

# Ver diferenças
uv lock --dry-run
```

### 8. Interface pip-like

```bash
# Instalar pacote (sem adicionar ao pyproject.toml)
uv pip install requests

# Instalar de requirements.txt
uv pip install -r requirements.txt

# Instalar de pyproject.toml
uv pip install -r pyproject.toml

# Compilar requirements
uv pip compile pyproject.toml -o requirements.txt
uv pip compile requirements.in -o requirements.txt

# Sincronizar ambiente com requirements
uv pip sync requirements.txt

# Desinstalar pacote
uv pip uninstall requests

# Listar pacotes instalados
uv pip list
uv pip freeze
```

### 9. Ferramentas Globais (pipx-like)

```bash
# Instalar ferramenta global
uv tool install ruff
uv tool install black
uv tool install ipython

# Instalar versão específica
uv tool install ruff@0.1.0

# Instalar com Python específico
uv tool install --python 3.10 ruff

# Executar ferramenta temporária (sem instalar)
uvx pycowsay "Hello UV!"
uvx ruff check .

# Listar ferramentas instaladas
uv tool list

# Atualizar ferramenta
uv tool upgrade ruff
uv tool upgrade --all

# Desinstalar ferramenta
uv tool uninstall ruff
```

---

## Workflow Completo: Do Zero ao Deploy

### 1. Criar Novo Projeto

```bash
# Criar projeto
uv init meu-projeto
cd meu-projeto

# Estrutura criada:
# meu-projeto/
# ├── .python-version    # Versão Python fixada
# ├── pyproject.toml     # Configuração do projeto
# ├── README.md
# └── hello.py           # Exemplo inicial
```

### 2. Configurar Python

```bash
# Instalar Python específico (se necessário)
uv python install 3.11

# Fixar versão
uv python pin 3.11
```

### 3. Adicionar Dependências

```bash
# Dependências principais
uv add flask pydantic sqlalchemy

# Dependências de desenvolvimento
uv add pytest black ruff mypy --group dev

# pyproject.toml atualizado automaticamente:
# [project]
# dependencies = ["flask", "pydantic", "sqlalchemy"]
#
# [dependency-groups]
# dev = ["pytest", "black", "ruff", "mypy"]
```

### 4. Desenvolver

```bash
# Executar aplicação
uv run python app.py

# Executar testes
uv run pytest

# Executar linter
uv run ruff check .

# Executar formatador
uv run black .

# Executar type checker
uv run mypy src/
```

### 5. Lock e Sync

```bash
# Gerar lockfile (uv.lock)
uv lock

# Sincronizar ambiente
uv sync

# Em outro ambiente (CI, produção)
uv sync --frozen    # Usa uv.lock sem atualizar
```

### 6. Build (se for pacote)

```bash
# Construir distribuição
uv build

# Output:
# dist/
# ├── meu_projeto-0.1.0-py3-none-any.whl
# └── meu_projeto-0.1.0.tar.gz
```

---

## Estrutura de Arquivos

### Projeto Típico com UV

```text
meu-projeto/
├── .python-version           # Versão Python fixada (3.11)
├── pyproject.toml            # Configuração do projeto
├── uv.lock                   # Lockfile (versionado no git)
├── .venv/                    # Ambiente virtual (não versionar)
├── src/
│   └── meu_projeto/
│       ├── __init__.py
│       └── main.py
├── tests/
│   └── test_main.py
└── README.md
```

### pyproject.toml Completo

```toml
[project]
name = "meu-projeto"
version = "0.1.0"
description = "Descrição do projeto"
readme = "README.md"
requires-python = ">=3.11"
authors = [
    { name = "Seu Nome", email = "seu@email.com" }
]
dependencies = [
    "flask>=3.1.0",
    "pydantic>=2.10.0",
    "sqlalchemy>=2.0.0"
]

[dependency-groups]
dev = [
    "pytest>=8.3.0",
    "black>=24.10.0",
    "ruff>=0.7.0",
    "mypy>=1.13.0"
]
test = [
    "pytest-cov>=6.0.0",
    "pytest-mock>=3.14.0"
]
docs = [
    "mkdocs>=1.6.0",
    "mkdocs-material>=9.5.0"
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.uv]
dev-dependencies = []

[tool.ruff]
line-length = 100

[tool.black]
line-length = 100

[tool.mypy]
python_version = "3.11"
strict = true
```

---

## Integrações

### Docker

```dockerfile
FROM python:3.11-slim

# Instalar uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copiar arquivos de configuração
COPY pyproject.toml uv.lock ./

# Instalar dependências
RUN uv sync --frozen --no-dev --no-install-project

# Copiar código
COPY . .

# Executar aplicação
CMD ["uv", "run", "python", "app.py"]
```

### GitHub Actions

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up uv
        uses: astral-sh/setup-uv@v6

      - name: Set up Python
        run: uv python install

      - name: Install dependencies
        run: uv sync --frozen

      - name: Run tests
        run: uv run pytest

      - name: Run linter
        run: uv run ruff check .

      # Cache para CI mais rápido
      - uses: actions/cache@v4
        with:
          path: ~/.cache/uv
          key: uv-${{ runner.os }}-${{ hashFiles('uv.lock') }}
```

### VS Code (settings.json)

```json
{
  "python.defaultInterpreterPath": ".venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "python.analysis.extraPaths": ["src"],
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  }
}
```

---

## Migração de Outras Ferramentas

### De pip + requirements.txt

```bash
# Criar pyproject.toml baseado em requirements.txt
uv init

# Adicionar dependências
uv add $(cat requirements.txt | grep -v "^#" | tr '\n' ' ')

# Ou importar diretamente
uv pip install -r requirements.txt
uv pip freeze > uv-requirements.txt
```

### De pipenv (Pipfile)

```bash
# Converter Pipfile para pyproject.toml manualmente
# Depois:
uv sync
```

### De poetry

```bash
# pyproject.toml do Poetry é compatível!
# Apenas ajustar seção [tool.poetry] para [project]

# Antes (Poetry):
# [tool.poetry.dependencies]
# flask = "^3.1.0"

# Depois (UV):
# [project]
# dependencies = ["flask>=3.1.0,<4.0.0"]

# Depois da conversão:
uv sync
```

---

## Boas Práticas

### 1. Versionamento no Git

```gitignore
# .gitignore
__pycache__/
*.py[cod]
*$py.class
.venv/                    # Nunca versionar venv
.pytest_cache/
.mypy_cache/
.ruff_cache/
dist/
build/
*.egg-info/
.env                      # Segredos

# Versionar estes:
# .python-version
# pyproject.toml
# uv.lock
```

### 2. Lockfile

```bash
# SEMPRE versionar uv.lock no git
git add uv.lock

# Em produção, usar --frozen
uv sync --frozen    # Não atualiza lock, apenas instala
```

### 3. Grupos de Dependências

```toml
[dependency-groups]
dev = ["pytest", "black", "ruff"]           # Desenvolvimento local
test = ["pytest-cov", "pytest-mock"]        # CI
docs = ["mkdocs", "mkdocs-material"]        # Documentação
prod = []                                   # Produção (opcional)
```

```bash
# Instalar apenas o necessário
uv sync --no-dev                    # Produção
uv sync --group dev --group test    # CI
uv sync --group docs                # Build docs
```

### 4. .python-version

```bash
# Criar automaticamente com pin
uv python pin 3.11

# Conteúdo de .python-version:
# 3.11

# UV e outras ferramentas respeitam este arquivo
```

### 5. Scripts no pyproject.toml

```toml
[project.scripts]
meu-cli = "meu_projeto.cli:main"

# Depois de instalar, executar:
# meu-cli --help
```

---

## Troubleshooting

### 1. "command not found: uv"

```bash
# Adicionar ao PATH (Linux/macOS)
export PATH="$HOME/.local/bin:$PATH"

# Windows: Reiniciar terminal após instalação
```

### 2. UV não encontra Python

```bash
# Instalar Python via UV
uv python install 3.11

# Ou apontar para Python existente
uv venv --python /usr/bin/python3.11
```

### 3. Conflito de dependências

```bash
# Ver resolução detalhada
uv lock --verbose

# Forçar atualização
uv lock --upgrade-package requests
```

### 4. Cache corrompido

```bash
# Limpar cache
uv cache clean

# Ver uso do cache
uv cache dir
uv cache size
```

### 5. Ambiente dessincronizado

```bash
# Reinstalar tudo do zero
rm -rf .venv uv.lock
uv venv
uv sync
```

---

## Comandos Avançados

### 1. Dependências de URLs

```toml
[project]
dependencies = [
    "my-package @ https://github.com/user/repo/archive/main.zip"
]
```

### 2. Dependências locais

```toml
[project]
dependencies = [
    "my-lib @ file:///path/to/my-lib"
]
```

### 3. Extras opcionais

```toml
[project.optional-dependencies]
postgres = ["psycopg2>=2.9.0"]
mysql = ["mysqlclient>=2.2.0"]
```

```bash
uv sync --extra postgres
uv sync --extra mysql
uv sync --all-extras
```

### 4. Configurações UV

```toml
[tool.uv]
# Resolver para plataformas específicas
environments = ["sys_platform == 'darwin'"]

# Desabilitar build isolation
no-build-isolation-package = ["numpy"]

# Projeto não é pacote (apenas deps)
package = false

# Cache keys customizado
cache-keys = [
    { file = "pyproject.toml" },
    { git = { commit = true } }
]
```

---

## Variáveis de Ambiente

```bash
# Python específico
export UV_PYTHON=3.11

# Usar Python do sistema
export UV_SYSTEM_PYTHON=1

# Diretório de cache customizado
export UV_CACHE_DIR=/custom/cache

# Diretório de instalação Python
export UV_PYTHON_INSTALL_DIR=/custom/python

# Modo verbose
export UV_VERBOSE=1

# Index alternativo (não PyPI)
export UV_INDEX_URL=https://meu-pypi.com/simple
```

---

## Comparação Rápida

| Tarefa | pip + venv | pipenv | poetry | UV |
|--------|------------|--------|--------|-----|
| Criar projeto | Manual | `pipenv --python 3.11` | `poetry new` | `uv init` |
| Adicionar pacote | `pip install` + editar | `pipenv install` | `poetry add` | `uv add` |
| Remover pacote | `pip uninstall` + editar | `pipenv uninstall` | `poetry remove` | `uv remove` |
| Lockfile | Manual | `Pipfile.lock` | `poetry.lock` | `uv.lock` |
| Instalar deps | `pip install -r` | `pipenv install` | `poetry install` | `uv sync` |
| Executar código | `python` | `pipenv run` | `poetry run` | `uv run` |
| Performance | Lento | Muito lento | Lento | **10-100x mais rápido** |
| Padrão | requirements.txt | Pipfile | pyproject.toml | pyproject.toml |

---

## Recursos Adicionais

### Documentação Oficial

- **Site oficial**: <https://docs.astral.sh/uv/>
- **GitHub**: <https://github.com/astral-sh/uv>
- **Discord**: [Astral Discord](https://discord.gg/astral-sh)

### Comandos de Ajuda

```bash
uv --help
uv python --help
uv add --help
uv sync --help
```

### Atualizações

```bash
# Atualizar UV (Linux/macOS)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Atualizar UV (Windows)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Ver versão
uv version
```

---

## Conclusão

**UV é a ferramenta moderna e definitiva para gerenciamento Python**. Substitui todo o ecossistema
tradicional (pyenv, pip, pipenv, poetry) com:

- ✅ **Performance excepcional** (10-100x mais rápido).
- ✅ **Simplicidade** (uma ferramenta, múltiplas funções).
- ✅ **Padrão moderno** (pyproject.toml PEP 621).
- ✅ **Cache inteligente** (reutilização entre projetos).
- ✅ **Lockfile confiável** (reprodutibilidade garantida).

**Recomendação**: Use UV para todos os projetos Python novos em 2025+.
