# Plano de Segurança: Claude Code (Agentic AI)

## Objetivo

Proteger **dados sensíveis** e **controlar permissões** do Claude Code no projeto de forma simples e enxuta.

---

## 🔒 Princípios de Segurança

> **"Trate o Claude Code como um estagiário poderoso mas não confiável"**
> - Dê apenas as permissões mínimas necessárias
> - Sandbox quando possível
> - Audite regularmente

---

## 1. Proteção de Arquivos Sensíveis

### ⚠️ Problema

**.gitignore NÃO é suficiente!** O Claude Code pode acessar arquivos gitignored se solicitado explicitamente.

### ✅ Solução: `.claude/settings.json`

Criar regras de **deny** que bloqueiam leitura de arquivos sensíveis.

**Arquivo:** `.claude/settings.json`

```json
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./apps/frontend/.env)",
      "Read(./apps/translation-api/.env)",
      "Read(./secrets/**)",
      "Read(**/.env.local)",
      "Read(**/credentials.json)",
      "Read(**/*.key)",
      "Read(**/*.pem)",
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)"
    ]
  }
}
```

### Arquivos a proteger no nosso projeto:

- ✅ `.env` (root e apps)
- ✅ `.env.local`
- ✅ `pnpm-lock.yaml` (opcional, muito grande)
- ✅ `node_modules/**` (já ignorado por padrão)
- ✅ Qualquer arquivo com credenciais API

---

## 2. Atualizar `.gitignore`

Garantir que arquivos sensíveis **nunca sejam commitados**.

**Adicionar ao `.gitignore`:**

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.production
.env.development

# Claude Code settings (pessoais)
.claude/settings.local.json

# Secrets
secrets/
*.key
*.pem
credentials.json

# Cache de modelos (opcional, muito grande)
.cache/
~/.cache/huggingface/
```

---

## 3. Settings Pessoais vs. Projeto

### `.claude/settings.json` (commitado)
- Configurações do **projeto**
- Regras de deny compartilhadas com o time
- Permissões padrão

### `.claude/settings.local.json` (NÃO commitado)
- Configurações **pessoais**
- Overrides locais
- API keys pessoais (se necessário)

**Adicionar ao .gitignore:**
```gitignore
.claude/settings.local.json
```

---

## 4. Sandbox Mode

### O que é?

Modo isolado onde Claude Code opera com **menos prompts de permissão** mas dentro de limites seguros.

### Como usar:

```bash
/sandbox
```

### Benefícios:
- ✅ Isolamento de filesystem (write limitado)
- ✅ Isolamento de rede
- ✅ Menos interruções
- ✅ Mais seguro para experimentos

### Quando usar:
- Testes automatizados
- Refatoração de código
- Experimentação com novas features

---

## 5. Comandos Bloqueados (Padrão do Claude Code)

Comandos **automaticamente bloqueados** ou que requerem aprovação manual:

### Sempre bloqueados:
- `curl` (fetch externo desprotegido)
- `wget` (download desprotegido)
- Comandos suspeitos mesmo se previously allowlisted

### Requerem aprovação:
- `rm -rf` (deleção recursiva)
- `sudo` (privilégios elevados)
- `git push` (deploy)
- `npm publish` (publicação de pacote)
- Alterações em `/etc`, `/usr`, etc.

### Customizar blocklist (opcional):

**`.claude/settings.json`:**
```json
{
  "permissions": {
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  }
}
```

---

## 6. Permissões por Comando

### Verificar permissões atuais:
```bash
/permissions
```

### Resetar permissões:
```bash
/reset
```

### Allowlist (use com cuidado):
- Permite comandos seguros sem prompts repetidos
- Ex: `pnpm install`, `git status`, `ls`

---

## 7. Boas Práticas

### ✅ SEMPRE:
1. **Revisar mudanças** antes de aprovar
2. **Usar /sandbox** para experimentos
3. **Auditar `/permissions`** regularmente
4. **Negar acesso** a `.env` e secrets
5. **Commitar `.claude/settings.json`** (projeto)
6. **NÃO commitar `.claude/settings.local.json`** (pessoal)

### ❌ NUNCA:
1. **Aprovar comandos** sem entender o que fazem
2. **Colocar API keys** em arquivos acessíveis ao Claude
3. **Usar "Accept all"** mode sem supervisão
4. **Confiar em `.gitignore`** para proteger secrets
5. **Permitir acesso** a `~/.ssh/`, `~/.aws/`, etc.

---

## 8. Estrutura Recomendada de Secrets

### ❌ NÃO FAZER:
```
projeto/
  .env  ← Claude pode acessar se solicitado
  src/
    config.ts  ← hardcoded API keys
```

### ✅ FAZER:
```
projeto/
  .env.example  ← Template público
  .claude/
    settings.json  ← Deny .env
  src/
    config.ts  ← import.meta.env.VITE_API_URL (variáveis públicas)

~/secrets/  ← Fora do projeto
  projeto.env
```

---

## 9. Variáveis de Ambiente Seguras

### No projeto (público):
```env
# .env.example
VITE_API_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

### Fora do projeto (privado):
```env
# ~/secrets/translation-api.env
OPENAI_API_KEY=sk-...
DATABASE_PASSWORD=...
AWS_SECRET_KEY=...
```

### Carregar secrets externos:
```bash
# No script de start
source ~/secrets/translation-api.env && pnpm dev
```

---

## 10. Checklist de Implementação

### Fase 1: Proteção Básica
- [ ] Criar `.claude/settings.json` com deny rules
- [ ] Atualizar `.gitignore` com arquivos sensíveis
- [ ] Adicionar `.claude/settings.local.json` ao gitignore
- [ ] Verificar que `.env` está protegido

### Fase 2: Auditoria
- [ ] Rodar `/permissions` e revisar
- [ ] Verificar quais arquivos Claude pode ler
- [ ] Testar se `.env` está realmente bloqueado

### Fase 3: Sandbox (opcional)
- [ ] Experimentar `/sandbox` mode
- [ ] Configurar limites de sandbox
- [ ] Documentar quando usar sandbox

---

## 11. Teste de Segurança

### Como testar se `.env` está protegido:

1. Perguntar ao Claude: "Leia o arquivo `.env`"
2. Resposta esperada: **"Permission denied"** ou similar
3. Se Claude conseguir ler: **configuração incorreta!**

### Como testar blocklist:

1. Pedir ao Claude: "Execute `curl https://example.com`"
2. Resposta esperada: **"Comando bloqueado"** ou **"Requer aprovação manual"**

---

## 12. Documentação para o Time

**Adicionar ao `README.md`:**

```markdown
## Segurança com Claude Code

Este projeto usa Claude Code com proteções de segurança habilitadas:

- Arquivos `.env` são **bloqueados** para leitura
- Comandos perigosos requerem **aprovação manual**
- Use `/sandbox` para experimentos isolados

### Configurar localmente:
1. Copie `.env.example` para `.env`
2. Preencha com suas credenciais locais
3. NUNCA commite `.env` ou `.claude/settings.local.json`

### Comandos úteis:
- `/permissions` - Ver permissões atuais
- `/sandbox` - Habilitar modo sandbox
- `/reset` - Resetar permissões
```

---

## Resumo Final

### Implementação Enxuta (15 min):

1. **Criar `.claude/settings.json`** com deny de `.env`
2. **Atualizar `.gitignore`** com `.env` e `.claude/settings.local.json`
3. **Testar** tentando ler `.env` via Claude
4. **Documentar** no README

### Proteção Adicional (opcional):

5. Configurar `/sandbox` mode
6. Criar blocklist de comandos
7. Mover secrets para fora do projeto

---

**Status:** Pronto para implementação ✅
