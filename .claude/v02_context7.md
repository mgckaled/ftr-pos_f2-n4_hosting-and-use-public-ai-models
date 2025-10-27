# Plano Profissional Detalhado: Projeto AI Stack TypeScript

## Visão Geral

Projeto **full-stack TypeScript** com 3 aplicações independentes e containerizadas:

1. **Frontend React + TypeScript** → Geração de legendas (client-side).
2. **Backend Node.js + Express + TypeScript** → API de tradução (server-side).
3. **Backend Python + Flask** → API de síntese de fala (server-side).

**Arquitetura**: Monorepo gerenciado com `pnpm workspaces` + Clean Architecture + Type-safety
em todas as camadas.

---

## Estrutura de Diretórios Profissional (Monorepo)

```text
f2_n4_hosting-and-use-public-ai-models/
├── .github/
│   └── workflows/
│       ├── ci-frontend.yml         # CI para frontend
│       ├── ci-translation-api.yml  # CI para backend Node
│       └── ci-tts-api.yml          # CI para backend Python
│
├── .claude/                        # Documentação pessoal
│   ├── resumo_projeto.md
│   ├── v01_context7.md
│   └── troubleshooting.md
│
├── apps/
│   ├── frontend/                   # React + Vite + TypeScript
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/         # Componentes React
│   │   │   │   ├── ui/            # Componentes genéricos
│   │   │   │   └── features/      # Componentes específicos
│   │   │   ├── models/            # Lógica de IA isolada
│   │   │   │   ├── api.ts         # Interface pública
│   │   │   │   ├── ImageCaptioner.ts
│   │   │   │   └── types.ts       # Types do modelo
│   │   │   ├── services/          # Serviços (HTTP, etc)
│   │   │   ├── hooks/             # Custom hooks
│   │   │   ├── utils/             # Utilitários
│   │   │   ├── types/             # TypeScript types globais
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── tests/
│   │   │   ├── unit/              # Testes unitários
│   │   │   ├── integration/       # Testes de integração
│   │   │   └── setup.ts           # Setup do Vitest
│   │   ├── .env.example
│   │   ├── .env.development
│   │   ├── .env.production
│   │   ├── .eslintrc.cjs
│   │   ├── .prettierrc
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── translation-api/            # Node + Express + TypeScript
│   │   ├── src/
│   │   │   ├── config/            # Configurações
│   │   │   │   ├── env.ts         # Validação de env vars (Zod)
│   │   │   │   └── logger.ts      # Logger estruturado
│   │   │   ├── models/            # Lógica de IA
│   │   │   │   ├── TranslationPipeline.ts
│   │   │   │   └── types.ts
│   │   │   ├── routes/            # Rotas da API
│   │   │   │   ├── translation.routes.ts
│   │   │   │   └── health.routes.ts
│   │   │   ├── middlewares/       # Middlewares
│   │   │   │   ├── errorHandler.ts
│   │   │   │   ├── validate.ts     # Validação Zod
│   │   │   │   └── cors.ts
│   │   │   ├── schemas/           # Schemas Zod
│   │   │   │   └── translation.schema.ts
│   │   │   ├── types/             # Types globais
│   │   │   ├── utils/             # Utilitários
│   │   │   ├── app.ts             # App Express
│   │   │   └── server.ts          # Entry point
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── setup.ts
│   │   ├── .env.example
│   │   ├── .eslintrc.cjs
│   │   ├── .prettierrc
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── Dockerfile
│   │   ├── .dockerignore
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── tts-api/                    # Python + Flask
│       ├── src/
│       │   ├── config/            # Configurações
│       │   │   ├── __init__.py
│       │   │   ├── env.py         # Validação env vars (pydantic)
│       │   │   └── logger.py      # Logger estruturado
│       │   ├── models/            # Lógica de IA
│       │   │   ├── __init__.py
│       │   │   ├── tts_pipeline.py
│       │   │   └── types.py       # TypedDict
│       │   ├── routes/            # Rotas da API
│       │   │   ├── __init__.py
│       │   │   ├── tts.py
│       │   │   └── health.py
│       │   ├── middlewares/       # Middlewares
│       │   │   ├── __init__.py
│       │   │   └── error_handler.py
│       │   ├── schemas/           # Validação (pydantic)
│       │   │   ├── __init__.py
│       │   │   └── tts_schema.py
│       │   ├── utils/             # Utilitários
│       │   │   └── __init__.py
│       │   └── app.py             # App Flask
│       ├── tests/
│       │   ├── unit/
│       │   ├── integration/
│       │   └── conftest.py        # Setup pytest
│       ├── output/                # Áudios gerados
│       ├── .env.example
│       ├── .flake8               # Linter Python
│       ├── .isort.cfg            # Import sorting
│       ├── pyproject.toml        # UV config + mypy
│       ├── Dockerfile
│       ├── .dockerignore
│       └── README.md
│
├── docker/
│   ├── docker-compose.yml        # Orquestração completa
│   └── docker-compose.dev.yml    # Ambiente de desenvolvimento
│
├── docs/                         # Documentação técnica
│   ├── api-reference.md
│   ├── deployment.md
│   └── architecture.md
│
├── .gitignore
├── .prettierrc                   # Config global Prettier
├── .editorconfig                # Config do editor
├── CLAUDE.md                     # Instruções Claude Code
├── README.md                     # Documentação pública
├── pnpm-workspace.yaml          # Config monorepo
├── package.json                  # Root package.json
└── tsconfig.base.json           # TSConfig base compartilhado
```

---

## Pacotes e Dependências Detalhadas

### 1. Frontend (React + Vite + TypeScript)

#### package.json

```json
{
  "name": "@ai-stack/frontend",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@huggingface/transformers": "^3.2.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0",
    "typescript": "^5.6.2",

    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",

    "vitest": "^2.1.0",
    "@vitest/ui": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.2",

    "eslint": "^9.13.0",
    "typescript-eslint": "^8.10.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.12",

    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.8"
  }
}
```

**Modelos**: `Xenova/vit-gpt2-image-captioning` (~300MB, quantizado para browser).

---

### 2. Backend Node.js (Translation API)

#### package.json ()

```json
{
  "name": "@ai-stack/translation-api",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "dependencies": {
    "express": "^4.21.1",
    "@huggingface/transformers": "^3.2.0",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "zod": "^3.24.1",
    "dotenv": "^16.4.5",
    "pino": "^9.5.0",
    "pino-pretty": "^11.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.8.0",
    "@types/express": "^5.0.0",
    "@types/cors": "^2.8.17",

    "typescript": "^5.6.2",
    "tsx": "^4.19.1",

    "vitest": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0",
    "supertest": "^7.0.0",
    "@types/supertest": "^6.0.2",

    "eslint": "^9.13.0",
    "typescript-eslint": "^8.10.0",

    "prettier": "^3.3.3"
  }
}
```

**Modelos**: `Xenova/nllb-200-distilled-600M` (~600MB).

---

### 3. Backend Python (TTS API)

#### pyproject.toml

```toml
[project]
name = "tts-api"
version = "0.1.0"
description = "Text-to-Speech API usando Flask e Transformers"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.1.0",
    "flask-cors>=5.0.0",
    "transformers>=4.46.0",
    "torch>=2.5.0",
    "scipy>=1.14.1",
    "accelerate>=1.2.0",
    "pydantic>=2.10.0",
    "pydantic-settings>=2.6.0",
    "python-dotenv>=1.0.1"
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-cov>=6.0.0",
    "pytest-flask>=1.3.0",
    "black>=24.10.0",
    "isort>=5.13.2",
    "flake8>=7.1.1",
    "mypy>=1.13.0",
    "types-flask>=1.1.6",
    "types-flask-cors>=5.0.0"
]

[tool.black]
line-length = 100
target-version = ["py311"]

[tool.isort]
profile = "black"
line_length = 100

[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
```

**Modelos**: `suno/bark` (~1GB) ou `Xenova/speecht5_tts` (~200MB).

---

## Melhores Práticas Profissionais

### 1. Type-Safety com Zod (Validação Runtime + Types)

#### Frontend: src/models/types.ts

```typescript
import { z } from 'zod';

export const ImageCaptionResponseSchema = z.object({
  generated_text: z.string(),
  confidence: z.number().optional(),
});

export type ImageCaptionResponse = z.infer<typeof ImageCaptionResponseSchema>;
```

#### Backend Node: src/schemas/translation.schema.ts

```typescript
import { z } from 'zod';

export const TranslationRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  source_lang: z.string().length(8).default('eng_Latn'),
  target_lang: z.string().length(8).default('por_Latn'),
});

export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;
```

#### Backend Python: src/schemas/tts_schema.py

```python
from pydantic import BaseModel, Field

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    speaker_id: str | None = Field(default=None)

class TTSResponse(BaseModel):
    audio_url: str
    duration_ms: float
```

---

### 2. Singleton Pattern + Preload (Performance)

#### Frontend: src/models/ImageCaptioner.ts

```typescript
import { pipeline, Pipeline } from '@huggingface/transformers';

class ImageCaptioner {
  private static instance: Pipeline | null = null;
  private static readonly MODEL = 'Xenova/vit-gpt2-image-captioning';

  static async getInstance(progressCallback?: (progress: any) => void): Promise<Pipeline> {
    if (!this.instance) {
      console.log('[ImageCaptioner] Loading model...');
      this.instance = await pipeline('image-to-text', this.MODEL, {
        dtype: 'q8', // Quantização para browser
        progress_callback: progressCallback,
      });
      console.log('[ImageCaptioner] Model loaded!');
    }
    return this.instance;
  }
}

export default ImageCaptioner;
```

#### Backend Node: src/models/TranslationPipeline.ts

```typescript
import { pipeline, Pipeline } from '@huggingface/transformers';
import { logger } from '../config/logger.js';

class TranslationPipeline {
  private static instance: Pipeline | null = null;
  private static readonly MODEL = 'Xenova/nllb-200-distilled-600M';

  static async getInstance(): Promise<Pipeline> {
    if (!this.instance) {
      logger.info('[TranslationPipeline] Loading model...');
      this.instance = await pipeline('translation', this.MODEL);
      logger.info('[TranslationPipeline] Model loaded!');
    }
    return this.instance;
  }

  // Preload no startup do servidor
  static preload(): void {
    this.getInstance().catch((err) => {
      logger.error('[TranslationPipeline] Preload failed:', err);
    });
  }
}

export default TranslationPipeline;
```

---

### 3. Environment Variables Type-Safe

#### Backend Node: src/config/env.ts

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

---

### 4. Error Handling Middleware (Express)

#### src/middlewares/errorHandler.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    logger.warn('Validation error:', err.errors);
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    logger.error(`App error: ${err.message}`, { statusCode: err.statusCode });
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  logger.fatal('Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
```

---

### 5. Structured Logging (Pino)

#### src/config/logger.ts

```typescript
import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
});
```

---

### 6. Testing (Vitest + React Testing Library)

#### Frontend: tests/unit/ImageCaptioner.test.ts

```typescript
import { describe, it, expect, vi } from 'vitest';
import ImageCaptioner from '../../src/models/ImageCaptioner';

describe('ImageCaptioner', () => {
  it('should be a singleton', async () => {
    const instance1 = await ImageCaptioner.getInstance();
    const instance2 = await ImageCaptioner.getInstance();
    expect(instance1).toBe(instance2);
  });
});
```

#### Backend Node: tests/integration/translation.test.ts

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

describe('POST /api/translate', () => {
  it('should translate text', async () => {
    const response = await request(app)
      .post('/api/translate')
      .send({
        text: 'Hello world',
        source_lang: 'eng_Latn',
        target_lang: 'por_Latn',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('translation');
  });
});
```

---

### 7. Docker Multi-Stage Build

#### Frontend: Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Node: Dockerfile

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## Setup e Comandos

### 1. Setup Inicial (Root)

```bash
# Instalar pnpm
npm install -g pnpm

# Inicializar workspace
pnpm init
```

### 2. Frontend

```bash
cd apps/
pnpm create vite@latest frontend -- --template react-ts
cd frontend
pnpm install
pnpm add @huggingface/transformers zod
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 @testing-library/react
pnpm add -D eslint typescript-eslint prettier
```

### 3. Backend Node

```bash
cd apps/translation-api
pnpm init
pnpm add express @huggingface/transformers cors helmet zod dotenv pino pino-pretty
pnpm add -D typescript tsx @types/node @types/express @types/cors
pnpm add -D vitest supertest @types/supertest eslint typescript-eslint prettier
```

### 4. Backend Python

```bash
cd apps/tts-api
uv init
uv add flask flask-cors transformers torch scipy accelerate pydantic pydantic-settings
uv add --dev pytest pytest-cov pytest-flask black isort flake8 mypy
```

---

## Próximos Passos Detalhados

1. Criar estrutura de diretórios.
2. Configurar monorepo (pnpm workspaces).
3. Inicializar apps com TypeScript.
4. Configurar ESLint + Prettier + Vitest.
5. Implementar validação com Zod.
6. Implementar Bloco B (Frontend + Image Captioning).
7. Implementar Bloco C (Translation API + Node).
8. Implementar Bloco D (TTS API + Python).
9. Criar Dockerfiles multi-stage.
10. Configurar docker-compose.
11. Escrever testes (unit + integration).
12. Setup CI/CD (GitHub Actions).
13. Documentação completa.

---

## Observações Profissionais

- **Type-safety end-to-end**: Zod para validação runtime + inferência de types.
- **Logs estruturados**: Pino (Node) e structlog (Python).
- **Testing**: Vitest (mais rápido que Jest), cobertura mínima de 80%.
- **Linting**: TypeScript ESLint strict mode.
- **Formatting**: Prettier com config compartilhada.
- **Git hooks**: Husky + lint-staged (opcional).
- **Commits**: Conventional Commits.
- **Versioning**: Semantic Versioning.
- **Monorepo**: pnpm workspaces (mais rápido que npm/yarn).
- **Cache de modelos**: `~/.cache/huggingface/` (padrão).
- **Docker**: Multi-stage builds para otimização de imagem.
- **Compartilhamento de types**: Importar diretamente entre workspaces, sem necessidade de pacote
  separado (ex: `import { Schema } from '@ai-stack/translation-api/schemas'`).
