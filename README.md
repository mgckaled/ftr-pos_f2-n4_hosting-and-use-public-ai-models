# Hospedagem e Uso de Modelos Públicos de IA

Repositório do projeto da disciplina **Hospedagem e uso de modelos públicos de IA
(Nível 4)** do curso de Pós-Graduação Tech Developer 360, desenvolvido pela
Faculdade de Tecnologia Rocketseat (FTR).

## Objetivo

Demonstrar o uso prático de modelos públicos de IA rodando em **CPU** (sem
necessidade de GPU), implementando uma aplicação completa que combina três
tarefas de IA:

1. **Geração de legendas** para imagens.
2. **Tradução** de texto entre idiomas.
3. **Síntese de fala** (Text-to-Speech).

## Arquitetura

Monorepo com três aplicações independentes:

```text
apps/
├── frontend/          # React + Vite + TypeScript
│                      # Image Captioning (browser-side)
│                      # Modelo: Xenova/vit-gpt2-image-captioning
│
├── translation-api/   # Node.js + Express + TypeScript
│                      # Translation API (server-side)
│                      # Modelo: Xenova/nllb-200-distilled-600M
│
└── tts-api/          # Python + Flask
                      # Text-to-Speech API (server-side)
                      # Modelo: suno/bark
```

## Stack Tecnológica

### Frontend

- React 18.
- Vite.
- TypeScript.
- Transformers.js (browser-side AI).

### Backend Node.js

- Express.
- TypeScript.
- Transformers.js (server-side AI).

### Backend Python

- Flask.
- UV (package manager).
- Transformers + PyTorch.
- Ruff (linting/formatting).

### DevOps

- pnpm (monorepo management).
- Docker (containerização).
- GitHub Actions (CI/CD).

## Modelos de IA Utilizados

| Tarefa            | Modelo                                | Tamanho | Execução |
|-------------------|---------------------------------------|---------|----------|
| Image Captioning  | `Xenova/vit-gpt2-image-captioning`    | ~300MB  | Browser  |
| Translation       | `Xenova/nllb-200-distilled-600M`      | ~600MB  | Server   |
| Text-to-Speech    | `suno/bark`                           | ~1GB    | Server   |

Todos os modelos são **open source** e rodam em **CPU comum**, sem necessidade
de GPU.

## Requisitos

- Node.js >= 20.
- pnpm >= 10.
- Python >= 3.11.
- UV (Python package manager).
- Docker (opcional).

## Estrutura do Projeto

```text
.
├── apps/                    # Aplicações do monorepo
│   ├── frontend/           # App React
│   ├── translation-api/    # API Node.js
│   └── tts-api/           # API Python
├── docker/                 # Configurações Docker
├── docs/                   # Documentação técnica
├── .claude/               # Guias de desenvolvimento
├── package.json           # Dependências root
├── pnpm-workspace.yaml    # Configuração monorepo
└── tsconfig.base.json     # TypeScript config base
```

## Instalação

```bash
# Instalar dependências Node.js
pnpm install

# Instalar dependências Python (app tts-api)
cd apps/tts-api
uv sync
```

## Desenvolvimento

```bash
# Frontend
pnpm dev:frontend

# Translation API
pnpm dev:translation

# TTS API (Python)
cd apps/tts-api
uv run python src/app.py
```

## Build

```bash
# Build all apps
pnpm build:frontend
pnpm build:translation

# Python não precisa de build
```

## Docker

```bash
# Subir todos os serviços
pnpm docker:up

# Parar todos os serviços
pnpm docker:down
```

## Funcionalidades

### 1. Geração de Legendas (Frontend)

- Upload de imagem via URL.
- Geração automática de legenda em inglês.
- Processamento no navegador (offline após download do modelo).

### 2. Tradução (API Node.js)

- Tradução de legendas do inglês para português.
- Suporte a múltiplos idiomas (NLLB-200).
- API REST simples.

### 3. Síntese de Fala (API Python)

- Conversão de texto traduzido em áudio.
- Voz em português brasileiro.
- Download do arquivo de áudio gerado.

## Conceitos Aplicados

- **Modelos Públicos de IA**: Como escolher, baixar e usar.
- **Browser vs Server**: Trade-offs de execução.
- **Singleton Pattern**: Otimização de carregamento de modelos.
- **Type-Safety**: Validação com Zod (TypeScript) e Pydantic (Python).
- **Clean Architecture**: Separação de concerns.
- **Monorepo**: Gerenciamento de múltiplos projetos.
- **Containerização**: Deploy com Docker.

## Segurança com Claude Code

Este projeto usa Claude Code (agentic AI) com proteções de segurança
habilitadas:

- Arquivos `.env` são **bloqueados** para leitura pelo Claude Code
- Comandos perigosos requerem **aprovação manual**
- Use `/sandbox` para experimentos isolados

### Configurar localmente

1. Copie `.env.example` para `.env` em cada app:

   ```bash
   cp apps/frontend/.env.example apps/frontend/.env
   cp apps/translation-api/.env.example apps/translation-api/.env
   ```

2. Preencha com suas configurações locais.
3. **NUNCA** commite arquivos `.env` ou `.claude/settings.local.json`.

### Comandos úteis do Claude Code

- `/permissions` - Ver permissões atuais
- `/sandbox` - Habilitar modo sandbox
- `/reset` - Resetar permissões

Para mais detalhes, veja `.claude/plano_seguranca_claude_code.md`.

## Licença

MIT.

## Autor

Projeto desenvolvido como parte do curso Tech Developer 360 - Rocketseat FTR.
