# Plano: Documentação API com Scalar (Design Moderno)

## Visão Geral

Integrar **Scalar API Reference** ao backend de tradução para gerar documentação interativa e moderna automaticamente a partir dos schemas Zod.

---

## Stack de Documentação

### Pacotes Necessários

1. **@fastify/swagger** (v9.3.0+)
   - Gera especificação OpenAPI 3.1 a partir dos schemas
   - Core para toda a documentação

2. **@scalar/fastify-api-reference** (v1.35.6+)
   - UI moderna e interativa
   - Design superior ao Swagger UI tradicional
   - Auto-detecta spec do @fastify/swagger

3. **fastify-type-provider-zod** (já instalado)
   - Fornece `jsonSchemaTransform` para converter Zod → OpenAPI
   - Garante type-safety end-to-end

---

## Fluxo de Funcionamento

```text
Schemas Zod (translate.ts)
    ↓
fastify-type-provider-zod (jsonSchemaTransform)
    ↓
@fastify/swagger (gera OpenAPI 3.1 spec)
    ↓
@scalar/fastify-api-reference (renderiza UI)
    ↓
Documentação acessível em /reference
```

---

## Implementação

### 1. Adicionar Dependências

```json
{
  "dependencies": {
    "@fastify/swagger": "^9.3.0",
    "@scalar/fastify-api-reference": "^1.35.6"
  }
}
```

### 2. Atualizar `app.ts`

#### Configurar @fastify/swagger com OpenAPI 3.1

```typescript
import fastifySwagger from '@fastify/swagger';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

export async function buildApp() {
  const app = Fastify({ logger: { /* ... */ } });

  // Set validators FIRST
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Register Swagger (generates OpenAPI spec)
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Translation API',
        description: 'AI-powered translation API using Transformers.js',
        version: '0.1.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'translation',
          description: 'Translation endpoints',
        },
        {
          name: 'health',
          description: 'Health check endpoints',
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  // Register Scalar API Reference (UI)
  await app.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/reference',
    configuration: {
      theme: 'purple',  // Options: 'purple', 'default', 'moon', 'solarized'
      layout: 'modern',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
    },
  });

  // Register CORS
  await app.register(cors, { /* ... */ });

  // Register routes
  await app.withTypeProvider<ZodTypeProvider>().register(translateRoutes);

  // Error handler...
}
```

### 3. Atualizar Schemas para Incluir Descrições OpenAPI

**`src/schemas/translate.ts`**

```typescript
import { z } from 'zod';

export const TranslationRequestSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text is too long')
    .describe('Text to be translated'),
  source_lang: z
    .string()
    .length(8)
    .default('eng_Latn')
    .describe('Source language code (NLLB format, e.g., eng_Latn)'),
  target_lang: z
    .string()
    .length(8)
    .default('por_Latn')
    .describe('Target language code (NLLB format, e.g., por_Latn)'),
});

export const TranslationResponseSchema = z.object({
  original: z.string().describe('Original input text'),
  translation: z.string().describe('Translated text'),
  source_lang: z.string().describe('Source language used'),
  target_lang: z.string().describe('Target language used'),
});

export const ErrorResponseSchema = z.object({
  error: z.string().describe('Error type'),
  message: z.string().describe('Detailed error message'),
  statusCode: z.number().describe('HTTP status code'),
});

// Types...
```

### 4. Atualizar Rotas com Tags e Descrições

**`src/routes/translate.ts`**

```typescript
fastify.route({
  method: 'POST',
  url: '/translate',
  schema: {
    description: 'Translate text from one language to another using AI',
    summary: 'Translate text',
    tags: ['translation'],
    body: TranslationRequestSchema,
    response: {
      200: TranslationResponseSchema,
      400: ErrorResponseSchema,
      500: ErrorResponseSchema,
    },
  },
  handler: async (request, reply) => { /* ... */ },
});

fastify.get('/health', {
  schema: {
    description: 'Check if the API is running',
    summary: 'Health check',
    tags: ['health'],
    response: {
      200: z.object({
        status: z.string(),
        timestamp: z.string(),
        service: z.string(),
      }),
    },
  },
  handler: async (request, reply) => { /* ... */ },
});
```

---

## Endpoints de Documentação

Após implementação, os seguintes endpoints estarão disponíveis:

| Endpoint | Descrição |
|----------|-----------|
| `GET /reference` | Scalar API Reference (UI moderna) |
| `GET /documentation/json` | OpenAPI spec em JSON |
| `GET /documentation/yaml` | OpenAPI spec em YAML |

---

## Recursos do Scalar

### Design Moderno

- ✅ Interface limpa e intuitiva
- ✅ Dark mode nativo
- ✅ Sintaxe highlight para exemplos
- ✅ Try-it-out interativo

### Features Avançadas

- ✅ Múltiplos clientes HTTP (fetch, axios, curl)
- ✅ Geração automática de exemplos
- ✅ Busca global na documentação
- ✅ Suporte a OAuth/API Keys
- ✅ Exportar como Postman/Insomnia

### Temas Disponíveis

- `purple` (padrão, recomendado)
- `default` (azul clássico)
- `moon` (dark elegante)
- `solarized` (inspirado no tema Solarized)

---

## Observações Importantes

### Issue Conhecido: Bundling para Produção

**Problema:** Scalar funciona perfeitamente em desenvolvimento, mas pode falhar ao bundlar para Docker/produção.

**Workaround (se necessário):**

```typescript
// Servir arquivos estáticos do Scalar manualmente
await app.register(fastifyStatic, {
  root: path.join(__dirname, '../node_modules/@scalar/fastify-api-reference/dist'),
  prefix: '/scalar-assets/',
});
```

**Status:** Issue reportado em outubro/2024, pode estar resolvido na versão atual (1.35.6).

### Linguagens Suportadas (NLLB-200)

Para documentação completa, adicionar lista de códigos de idioma suportados:

- `eng_Latn` - Inglês
- `por_Latn` - Português
- `spa_Latn` - Espanhol
- `fra_Latn` - Francês
- Etc. (200+ idiomas)

---

## Próximos Passos

1. ✅ **Instalar dependências**
   - `pnpm add @fastify/swagger @scalar/fastify-api-reference`

2. ✅ **Atualizar `app.ts`**
   - Registrar @fastify/swagger com OpenAPI config
   - Registrar Scalar API Reference

3. ✅ **Enriquecer schemas com `.describe()`**
   - Adicionar descrições em todos os campos Zod

4. ✅ **Atualizar rotas**
   - Adicionar `tags`, `summary`, `description`
   - Incluir todos os response codes

5. ✅ **Testar documentação**
   - Iniciar servidor
   - Acessar `http://localhost:3000/reference`
   - Testar "Try it out"

6. ✅ **Validar em produção (Docker)**
   - Verificar se Scalar renderiza corretamente
   - Aplicar workaround se necessário

---

## Exemplo de Documentação Gerada

### POST /translate

**Descrição:** Traduz texto de um idioma para outro usando modelo NLLB-200.

**Request Body:**

```json
{
  "text": "Hello, how are you?",
  "source_lang": "eng_Latn",
  "target_lang": "por_Latn"
}
```

**Response 200:**

```json
{
  "original": "Hello, how are you?",
  "translation": "Olá, como você está?",
  "source_lang": "eng_Latn",
  "target_lang": "por_Latn"
}
```

**Try it out:** Botão interativo para testar diretamente na UI.

---

## Comparação: Scalar vs Swagger UI

| Feature | Scalar | Swagger UI |
|---------|--------|------------|
| Design moderno | ✅ | ❌ |
| Dark mode | ✅ Nativo | ⚠️ Parcial |
| Performance | ✅ Rápido | ⚠️ Médio |
| Busca global | ✅ | ❌ |
| Múltiplos clientes | ✅ | ❌ (só curl) |
| Exportar specs | ✅ | ⚠️ Limitado |
| Mobile-friendly | ✅ | ❌ |

---

## Decisão Técnica

✅ **Por que Scalar?**

1. **Design superior:** Interface moderna e profissional
2. **Experiência do desenvolvedor:** Busca, navegação intuitiva
3. **Manutenção zero:** Auto-gera a partir dos schemas Zod
4. **Type-safety:** Garante docs sempre sincronizadas com código
5. **Interatividade:** Try-it-out com múltiplos clientes HTTP

✅ **Integração com Zod:**

- Schemas Zod são a fonte única de verdade
- Validação runtime + docs + types TypeScript
- DRY (Don't Repeat Yourself)

---

## Status: Pronto para Implementação

Confirme para proceder com a integração do Scalar API Reference.
