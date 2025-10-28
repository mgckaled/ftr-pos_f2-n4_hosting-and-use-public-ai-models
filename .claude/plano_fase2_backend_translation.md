# Plano Fase 2: Backend de Tradução + Integração Frontend

## Visão Geral

Criar uma **API simples de tradução** (inglês → português) usando **Fastify + Zod** e integrar com o frontend existente.

---

## 1. Backend: Translation API (Fastify + TypeScript)

### Estrutura Enxuta

```text
apps/translation-api/
├── src/
│   ├── server.ts           # Entry point (inicia servidor)
│   ├── app.ts              # Configuração Fastify + plugins
│   ├── routes/
│   │   └── translate.ts    # POST /translate
│   ├── models/
│   │   └── translator.ts   # Singleton modelo nllb-200
│   └── schemas/
│       └── translate.ts    # Schemas Zod (request/response)
├── Dockerfile              # Container simples
├── .dockerignore
├── .env.example            # PORT, CORS_ORIGIN
├── package.json
└── tsconfig.json
```

### Stack

- **Fastify** (framework rápido e type-safe)
- **@fastify/cors** (CORS para comunicação com frontend)
- **fastify-type-provider-zod** (validação integrada com Zod)
- **@huggingface/transformers** (modelo de tradução)
- **zod** (validação de schemas)
- **tsx** (rodar TypeScript em dev)

### API Contract

**Endpoint:** `POST /translate`

**Request:**

```json
{
  "text": "a beach with white sand and blue sea",
  "source_lang": "eng_Latn",
  "target_lang": "por_Latn"
}
```

**Response:**

```json
{
  "original": "a beach with white sand and blue sea",
  "translation": "uma praia com areia branca e mar azul",
  "source_lang": "eng_Latn",
  "target_lang": "por_Latn"
}
```

**Modelo:** `Xenova/nllb-200-distilled-600M` (~600MB)

---

## 2. Integração Frontend

### Modificações Mínimas

1. **Criar serviço de tradução** (`src/services/translation.ts`)
   - Função `translateText(text: string)` → chamada POST /translate

2. **Atualizar `CaptionResult.tsx`**
   - Adicionar botão "Traduzir para Português"
   - Exibir tradução abaixo da legenda original
   - Estados: `translating` (loading), `translation` (texto traduzido)

3. **Configurar variável de ambiente** (`.env`)
   - `VITE_API_URL=http://localhost:3000` (URL do backend)

### Fluxo Final

```text
1. Usuário faz upload de imagem
2. Frontend gera legenda (inglês) via Transformers.js
3. Usuário clica "Traduzir para Português"
4. Frontend envia legenda para backend (POST /translate)
5. Backend traduz e retorna
6. Frontend exibe tradução
```

---

## 3. Containerização Simples

### Backend: Dockerfile Multi-stage

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Docker Compose (opcional, para testar localmente)

```yaml
version: '3.8'
services:
  translation-api:
    build: ./apps/translation-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGIN=http://localhost:5173
```

---

## 4. Próximos Passos (ordem de execução)

1. **Criar estrutura do backend**
   - `apps/translation-api/` com arquivos mínimos

2. **Implementar schemas Zod**
   - `TranslationRequestSchema`, `TranslationResponseSchema`

3. **Implementar modelo translator**
   - Singleton pattern para carregar nllb-200 uma vez
   - Preload no startup

4. **Implementar rota /translate**
   - Validação automática via Zod
   - Chamar translator.translate()

5. **Configurar Fastify app**
   - CORS, error handling, type provider

6. **Testar backend** (Postman/curl)

7. **Integrar frontend**
   - Serviço de tradução
   - Botão + UI no CaptionResult

8. **Criar Dockerfile**

9. **Documentar**

---

## 5. Decisões Técnicas

✅ **Por que Fastify?**

- Melhor integração com Zod via `fastify-type-provider-zod`
- Type-safety automática em rotas
- Performance superior ao Express

✅ **Por que apenas 1 rota?**

- Projeto enxuto, foco didático
- `/translate` é o mínimo viável

✅ **Por que modelo no backend?**

- nllb-200 (~600MB) é pesado para browser
- Backend controla recursos melhor
- Frontend já roda image-caption

✅ **Container simples?**

- Multi-stage build (otimizado)
- Apenas Node.js Alpine (leve)
- Sem necessidade de GPU

---

## Status: Em Implementação

Começando pela criação da estrutura do backend e instalação de dependências.
