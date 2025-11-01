# Hospedagem e Uso de Modelos Públicos de IA

Repositório do projeto da disciplina **Hospedagem e uso de modelos públicos de IA (Nível 4)** do curso de Pós-Graduação Tech Developer 360, desenvolvido pela Faculdade de Tecnologia Rocketseat (FTR).

> [!NOTE]
>
> [Questionário Avaliativo](./.github/docs/content/assessments/q.md)

## Objetivo

Demonstrar o uso prático de modelos públicos de IA rodando em **CPU** (sem necessidade de GPU), implementando uma aplicação completa que combina três tarefas de IA:

1. **Geração de legendas** para imagens.
2. **Tradução** de texto entre idiomas.
3. **Síntese de fala** (Text-to-Speech).

## Arquitetura

Monorepo com duas aplicações integradas:

```text
apps/
├── frontend/          # React + Vite + TypeScript
│                      # Image Captioning (browser-side)
│                      # Modelo: Xenova/vit-gpt2-image-captioning
│
└── translation-api/   # Node.js + Fastify + TypeScript
                       # Translation + TTS APIs (server-side)
                       # Modelos: Xenova/nllb-200-distilled-600M
                       #          Xenova/speecht5_tts
```

## Stack Tecnológica

### Frontend

- React 18 com TypeScript
- Vite (build tool)
- Transformers.js (execução de modelos de IA no navegador)
- shadcn/ui (componentes)

### Backend

- Node.js 20+ com TypeScript
- Fastify (framework web)
- Transformers.js (execução de modelos de IA no servidor)
- Zod (validação de schemas)

### DevOps

- pnpm (gerenciamento de monorepo)
- Docker + Docker Compose (containerização)
- Multi-stage builds (otimização de imagens)

## Modelos de IA Utilizados

| Tarefa            | Modelo                                | Tamanho | Execução |
|-------------------|---------------------------------------|---------|----------|
| Image Captioning  | `Xenova/vit-gpt2-image-captioning`    | ~300MB  | Browser  |
| Translation       | `Xenova/nllb-200-distilled-600M`      | ~600MB  | Server   |
| Text-to-Speech    | `Xenova/speecht5_tts`                 | ~200MB  | Server   |

Todos os modelos são open source e executam em CPU comum, sem necessidade de GPU.

## Requisitos

### Desenvolvimento Local

- Node.js >= 20
- pnpm >= 10

### Produção (Docker)

- Docker Desktop com mínimo 6GB RAM
- Docker Compose

## Início Rápido

### Opção 1: Desenvolvimento Local

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar API (Terminal 1)
cd apps/translation-api
pnpm dev

# 3. Iniciar Frontend (Terminal 2)
cd apps/frontend
pnpm dev
```

Acesse: `http://localhost:5173`

### Opção 2: Docker (Produção)

```bash
# 1. Configurar memória do Docker Desktop
# Settings → Resources → Memory: mínimo 6GB

# 2. Construir e iniciar containers
docker compose up -d

# 3. Aguardar carregamento dos modelos (2-3 minutos)
docker compose logs -f translation-api
```

Acesse: `http://localhost`

**Nota:** O carregamento inicial dos modelos de IA pode demorar alguns minutos.

## Funcionalidades

### 1. Geração de Legendas

- Upload de imagem via URL
- Geração automática de legenda em inglês
- Processamento no navegador (offline após download do modelo)
- Interface com indicador de progresso por etapas

### 2. Tradução de Texto

- Tradução de legendas do inglês para português
- Suporte a 200 idiomas (modelo NLLB-200)
- API REST com validação de schemas (Zod)

### 3. Síntese de Fala

- Conversão de texto traduzido em áudio
- Geração de arquivo WAV
- Download direto do áudio gerado

## Estrutura do Projeto

```text
.
├── apps/
│   ├── frontend/              # Aplicação React
│   │   ├── src/
│   │   │   ├── features/     # Funcionalidades (image-caption, translation, tts)
│   │   │   ├── hooks/        # Custom hooks
│   │   │   ├── models/       # Wrappers de modelos de IA
│   │   │   └── components/   # Componentes UI
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   │
│   └── translation-api/       # API Node.js
│       ├── src/
│       │   ├── routes/       # Endpoints (translate, tts)
│       │   ├── models/       # Wrappers de modelos de IA
│       │   ├── schemas/      # Validação Zod
│       │   └── app.ts
│       └── Dockerfile
│
├── .claude/                   # Documentação de desenvolvimento
├── docker-compose.yml
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Conceitos Aplicados

- Modelos públicos de IA executando em CPU
- Browser vs Server (trade-offs de execução)
- Singleton Pattern (otimização de carregamento de modelos)
- Type Safety (TypeScript + Zod)
- Monorepo com pnpm workspaces
- Containerização com Docker multi-stage builds

## Licença

MIT.

## Autor

Projeto desenvolvido como parte do curso Tech Developer 360 - Rocketseat FTR.
