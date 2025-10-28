# Plano de Implementação: Pipeline Completo de Multimodalidade

**Data**: 2025-10-28
**Versão**: 1.0
**Complexidade**: ⭐⭐☆☆☆ (Baixa-Média)

## 📋 Visão Geral

Implementar pipeline completo de IA multimodal que processa:

**Imagem → Legenda → Tradução → Áudio (TTS)**

### Objetivo

Adicionar funcionalidade de Text-to-Speech (TTS) ao projeto existente, permitindo que
usuários ouçam as traduções geradas em português com voz sintetizada por IA.

### Benefícios

- ✅ Demonstra pipeline completo de IA multimodal
- ✅ Melhora acessibilidade (usuários com deficiência visual)
- ✅ Educacional (múltiplos modelos de IA integrados)
- ✅ Reutiliza infraestrutura existente
- ✅ Simples de implementar e manter

## 🏗️ Arquitetura do Sistema

### Diagrama de Fluxo

```text
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Imagem] → [ImageCaptioner] → [Legenda EN] → [API Translate]  │
│                                        ↓                         │
│                                  [Tradução PT]                   │
│                                        ↓                         │
│                         [Botão: 🔊 Ouvir Tradução]              │
│                                        ↓                         │
│                                  [API TTS] ←─────┐              │
│                                        ↓          │              │
│                              [Áudio Base64]       │              │
│                                        ↓          │              │
│                            [Audio Player HTML5]   │              │
│                                                   │              │
└───────────────────────────────────────────────────┼──────────────┘
                                                    │
                    ┌───────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────────┐
│                      BACKEND (Fastify + Node.js)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /translate              POST /text-to-speech              │
│  ┌──────────────┐             ┌───────────────────┐            │
│  │ NLLB-200     │             │ SpeechT5 TTS      │            │
│  │ Translation  │             │ Model (Portuguese)│            │
│  └──────────────┘             └───────────────────┘            │
│                                                                  │
│  Singleton Pattern            Singleton Pattern                 │
│  Preload on startup           Preload on startup                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Usuário carrega imagem** → Frontend
2. **Legenda gerada** → Transformers.js (client-side)
3. **Tradução solicitada** → API Backend (`POST /translate`)
4. **Tradução retornada** → Frontend exibe texto PT
5. **Usuário clica "Ouvir"** → Frontend envia texto PT para API
6. **TTS gerado** → API Backend (`POST /text-to-speech`)
7. **Áudio retornado** → Base64 WAV
8. **Áudio reproduzido** → HTML5 Audio Player

## 🛠️ Tecnologias e Modelos

### Frontend

| Tecnologia           | Versão  | Uso                         |
| -------------------- | ------- | --------------------------- |
| React                | 19.1.1  | Framework UI                |
| Transformers.js      | 3.7.6   | Image captioning (client)   |
| Lucide React         | Latest  | Ícones (Volume2, Loader2)   |
| Zod                  | 4.1.12  | Validação                   |
| HTML5 Audio API      | Nativa  | Reprodução de áudio         |

### Backend

| Tecnologia           | Versão  | Uso                         |
| -------------------- | ------- | --------------------------- |
| Fastify              | 5.2.3   | Framework HTTP              |
| Transformers.js      | 3.7.6   | Translation + TTS (server)  |
| Zod                  | 4.1.12  | Validação schemas           |
| wavefile             | 11.0.0  | Conversão áudio para WAV    |

### Modelos de IA

| Modelo                           | Tarefa          | Localização | Tamanho   |
| -------------------------------- | --------------- | ----------- | --------- |
| `Xenova/vit-gpt2-image-captioning` | Image-to-text   | Frontend    | ~150MB    |
| `Xenova/nllb-200-distilled-600M`  | Translation     | Backend     | ~600MB    |
| `Xenova/speecht5_tts`            | Text-to-speech  | Backend     | ~180MB    |

**Total novo (TTS)**: ~180MB adicional

## 📁 Estrutura de Arquivos

### Novos Arquivos Backend

```text
apps/translation-api/
├── src/
│   ├── models/
│   │   ├── Translator.ts         # Existente (singleton translation)
│   │   └── TextToSpeech.ts       # NOVO (singleton TTS)
│   ├── routes/
│   │   ├── translate.routes.ts   # Existente
│   │   └── tts.routes.ts         # NOVO (rotas TTS)
│   ├── schemas/
│   │   ├── translate.schema.ts   # Existente
│   │   └── tts.schema.ts         # NOVO (validação TTS)
│   ├── app.ts                    # Atualizar (registrar rota TTS)
│   └── server.ts                 # Atualizar (preload TTS model)
├── package.json                  # Atualizar (adicionar wavefile)
└── .env                          # Sem alterações
```

### Novos Arquivos Frontend

```text
apps/frontend/
├── src/
│   ├── services/
│   │   ├── translation.ts        # Existente
│   │   └── tts.ts                # NOVO (chamadas API TTS)
│   ├── hooks/
│   │   ├── useTranslation.ts     # Existente
│   │   └── useTextToSpeech.ts    # NOVO (lógica TTS)
│   ├── features/image-caption/
│   │   ├── components/
│   │   │   ├── CaptionResult.tsx # Atualizar (botão ouvir)
│   │   │   └── AudioPlayer.tsx   # NOVO (player de áudio)
│   └── types/
│       └── tts.ts                # NOVO (tipos TTS)
└── .env                          # Sem alterações
```

## 🔧 Backend: API Text-to-Speech

### 1. Schema de Validação (`tts.schema.ts`)

```typescript
import { z } from 'zod'

export const textToSpeechRequestSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text too long (max 500 characters)'),
  language: z
    .enum(['pt', 'en', 'es', 'fr'])
    .default('pt')
    .describe('Target language for TTS')
})

export const textToSpeechResponseSchema = z.object({
  audio: z.string().describe('Base64-encoded WAV audio'),
  format: z.literal('wav').describe('Audio format'),
  sampling_rate: z.number().describe('Audio sampling rate (Hz)'),
  duration: z.number().describe('Audio duration in seconds')
})

export type TextToSpeechRequest = z.infer<typeof textToSpeechRequestSchema>
export type TextToSpeechResponse = z.infer<typeof textToSpeechResponseSchema>
```

### 2. Modelo TTS Singleton (`TextToSpeech.ts`)

```typescript
import { pipeline, TextToSpeechPipeline } from '@huggingface/transformers'
import wavefile from 'wavefile'

/**
 * Singleton class for Text-to-Speech model
 * Loads model once and reuses for all requests
 */
export class TextToSpeech {
  private static instance: TextToSpeech | null = null
  private model: TextToSpeechPipeline | null = null
  private isLoading = false

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TextToSpeech {
    if (!TextToSpeech.instance) {
      TextToSpeech.instance = new TextToSpeech()
    }
    return TextToSpeech.instance
  }

  /**
   * Initialize TTS model (singleton pattern)
   */
  public async initialize(): Promise<void> {
    if (this.model) {
      return // Already initialized
    }

    if (this.isLoading) {
      // Wait for loading to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return
    }

    try {
      this.isLoading = true
      console.log('Loading Text-to-Speech model...')

      this.model = await pipeline(
        'text-to-speech',
        'Xenova/speecht5_tts',
        { quantized: true } // Use quantized model for faster inference on CPU
      )

      console.log('Text-to-Speech model loaded successfully')
    } catch (error) {
      console.error('Failed to load TTS model:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Generate speech from text
   * @param text - Text to synthesize
   * @returns Base64-encoded WAV audio
   */
  public async synthesize(text: string): Promise<{
    audioBase64: string
    samplingRate: number
    duration: number
  }> {
    if (!this.model) {
      throw new Error('TTS model not initialized. Call initialize() first.')
    }

    try {
      // Generate speech with speaker embeddings
      const result = await this.model(text, {
        speaker_embeddings:
          'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin'
      })

      // Convert to WAV format
      const wav = new wavefile.WaveFile()
      wav.fromScratch(
        1, // mono channel
        result.sampling_rate,
        '32f', // 32-bit float
        result.audio
      )

      // Convert WAV to Base64
      const wavBuffer = wav.toBuffer()
      const audioBase64 = wavBuffer.toString('base64')

      // Calculate duration
      const duration = result.audio.length / result.sampling_rate

      return {
        audioBase64,
        samplingRate: result.sampling_rate,
        duration
      }
    } catch (error) {
      console.error('TTS synthesis failed:', error)
      throw new Error('Failed to synthesize speech')
    }
  }
}
```

### 3. Rotas TTS (`tts.routes.ts`)

```typescript
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  textToSpeechRequestSchema,
  textToSpeechResponseSchema
} from '../schemas/tts.schema'
import { TextToSpeech } from '../models/TextToSpeech'

export async function ttsRoutes(app: FastifyInstance) {
  const ttsService = TextToSpeech.getInstance()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/text-to-speech',
    {
      schema: {
        summary: 'Convert text to speech',
        description: 'Generate speech audio from text using AI TTS model',
        tags: ['TTS'],
        body: textToSpeechRequestSchema,
        response: {
          200: textToSpeechResponseSchema
        }
      }
    },
    async (request, reply) => {
      const { text, language } = request.body

      request.log.info(
        { textLength: text.length, language },
        'Processing TTS request'
      )

      try {
        const result = await ttsService.synthesize(text)

        return reply.code(200).send({
          audio: result.audioBase64,
          format: 'wav' as const,
          sampling_rate: result.samplingRate,
          duration: result.duration
        })
      } catch (error) {
        request.log.error({ error }, 'TTS synthesis failed')
        return reply.code(500).send({
          error: 'TTS synthesis failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  )
}
```

### 4. Atualizar `app.ts`

```typescript
// ... imports existentes ...
import { ttsRoutes } from './routes/tts.routes'

export async function buildApp(opts: FastifyServerOptions = {}) {
  const app = fastify(opts)

  // ... configurações existentes ...

  // Register routes
  await app.register(translateRoutes)
  await app.register(ttsRoutes) // NOVO

  return app
}
```

### 5. Atualizar `server.ts`

```typescript
// ... imports existentes ...
import { TextToSpeech } from './models/TextToSpeech'

async function start() {
  try {
    // Preload models
    console.log('Preloading AI models...')
    const translator = Translator.getInstance()
    const ttsService = TextToSpeech.getInstance() // NOVO

    await Promise.all([
      translator.initialize(),
      ttsService.initialize() // NOVO
    ])

    // ... resto do código existente ...
  } catch (error) {
    // ... tratamento de erro existente ...
  }
}
```

### 6. Atualizar `package.json`

```json
{
  "dependencies": {
    "@huggingface/transformers": "3.7.6",
    "fastify": "5.2.3",
    "wavefile": "11.0.0"
  }
}
```

## 🎨 Frontend: Interface Text-to-Speech

### 1. Tipos (`tts.ts`)

```typescript
export interface TextToSpeechRequest {
  text: string
  language?: 'pt' | 'en' | 'es' | 'fr'
}

export interface TextToSpeechResponse {
  audio: string // Base64-encoded WAV
  format: 'wav'
  sampling_rate: number
  duration: number
}

export interface AudioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  duration: number | null
}
```

### 2. Service TTS (`tts.ts`)

```typescript
import { TextToSpeechRequest, TextToSpeechResponse } from '@/types/tts'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export class TextToSpeechError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'TextToSpeechError'
  }
}

/**
 * Convert text to speech using API
 */
export async function textToSpeech(
  request: TextToSpeechRequest
): Promise<TextToSpeechResponse> {
  try {
    const response = await fetch(`${API_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new TextToSpeechError(
        error.message || 'Failed to generate speech',
        response.status
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof TextToSpeechError) {
      throw error
    }

    throw new TextToSpeechError(
      'Network error: Could not connect to TTS service'
    )
  }
}
```

### 3. Hook useTextToSpeech (`useTextToSpeech.ts`)

```typescript
import { useState, useCallback, useRef } from 'react'
import { textToSpeech } from '@/services/tts'
import { AudioPlayerState } from '@/types/tts'

export function useTextToSpeech() {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    duration: null
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  /**
   * Generate and play speech
   */
  const speak = useCallback(
    async (text: string, language: 'pt' | 'en' = 'pt') => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        // Generate speech
        const response = await textToSpeech({ text, language })

        // Create audio from base64
        const audioBlob = base64ToBlob(response.audio, 'audio/wav')
        const audioUrl = URL.createObjectURL(audioBlob)

        // Create audio element
        if (audioRef.current) {
          audioRef.current.pause()
          URL.revokeObjectURL(audioRef.current.src)
        }

        const audio = new Audio(audioUrl)
        audioRef.current = audio

        // Setup event listeners
        audio.addEventListener('play', () => {
          setState((prev) => ({
            ...prev,
            isPlaying: true,
            isLoading: false,
            duration: response.duration
          }))
        })

        audio.addEventListener('pause', () => {
          setState((prev) => ({ ...prev, isPlaying: false }))
        })

        audio.addEventListener('ended', () => {
          setState((prev) => ({ ...prev, isPlaying: false }))
          URL.revokeObjectURL(audioUrl)
        })

        audio.addEventListener('error', () => {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isLoading: false,
            error: 'Failed to play audio'
          }))
        })

        // Play audio
        await audio.play()
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Failed to generate speech'
        }))
      }
    },
    []
  )

  /**
   * Stop current playback
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return {
    ...state,
    speak,
    stop
  }
}

/**
 * Convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}
```

### 4. Atualizar `CaptionResult.tsx`

```typescript
import { Volume2, Loader2, Copy, Languages } from 'lucide-react'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

interface CaptionResultProps {
  caption: string
  translation?: string
  // ... outras props existentes ...
}

export function CaptionResult({
  caption,
  translation
  // ... outras props ...
}: CaptionResultProps) {
  const { isPlaying, isLoading, error, speak, stop } = useTextToSpeech()

  const handleSpeak = () => {
    if (!translation) return

    if (isPlaying) {
      stop()
    } else {
      speak(translation, 'pt')
    }
  }

  return (
    <div className="space-y-4">
      {/* Existing caption display */}
      <div>
        <h3>Caption (English)</h3>
        <p>{caption}</p>
        {/* ... existing copy button ... */}
      </div>

      {/* Translation display */}
      {translation && (
        <div>
          <h3>Translation (Portuguese)</h3>
          <p>{translation}</p>

          <div className="flex gap-2">
            {/* Existing copy button */}

            {/* NOVO: TTS Button */}
            <button
              onClick={handleSpeak}
              disabled={isLoading}
              className="btn-secondary"
              aria-label={isPlaying ? 'Stop audio' : 'Listen to translation'}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Loading...
                </>
              ) : isPlaying ? (
                <>
                  <Volume2 className="text-primary" />
                  Playing...
                </>
              ) : (
                <>
                  <Volume2 />
                  Listen
                </>
              )}
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## 🔄 Fluxo de Dados Completo

### 1. Usuário Carrega Imagem

```typescript
// ImageCaptionForm.tsx
const handleSubmit = async (imageUrl: string) => {
  const caption = await captioner.generate(imageUrl)
  setCaption(caption)
}
```

### 2. Tradução Solicitada

```typescript
// useTranslation.ts
const { translation } = useTranslation(caption)
```

### 3. TTS Solicitado

```typescript
// useTextToSpeech.ts
const { speak } = useTextToSpeech()
speak(translation, 'pt')
```

### 4. Backend Processa TTS

```typescript
// Backend: tts.routes.ts
POST /text-to-speech
{
  "text": "uma praia de areia com um oceano azul e palmeiras",
  "language": "pt"
}

// Response
{
  "audio": "UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
  "format": "wav",
  "sampling_rate": 16000,
  "duration": 3.2
}
```

### 5. Frontend Reproduz Áudio

```typescript
// useTextToSpeech.ts
const audioBlob = base64ToBlob(response.audio, 'audio/wav')
const audioUrl = URL.createObjectURL(audioBlob)
const audio = new Audio(audioUrl)
await audio.play()
```

## 🔒 Considerações de Segurança

### Backend

1. **Validação de Input**

   - Limitar tamanho do texto (max 500 caracteres)
   - Validar idioma (enum de opções permitidas)
   - Sanitizar texto (remover caracteres especiais perigosos)

2. **Rate Limiting**

   ```typescript
   import rateLimit from '@fastify/rate-limit'

   app.register(rateLimit, {
     max: 10, // 10 requests
     timeWindow: '1 minute',
     cache: 10000
   })
   ```

3. **Timeout**

   ```typescript
   app.post('/text-to-speech', {
     schema: { /* ... */ },
     config: {
       timeout: 30000 // 30 seconds max
     }
   })
   ```

4. **Error Handling**

   - Não expor detalhes internos do modelo
   - Retornar mensagens genéricas
   - Logar erros com contexto

### Frontend

1. **Validação Client-Side**

   - Validar texto antes de enviar
   - Mostrar feedback claro ao usuário
   - Limitar frequência de cliques

2. **Cleanup de Recursos**

   ```typescript
   useEffect(() => {
     return () => {
       if (audioRef.current) {
         audioRef.current.pause()
         URL.revokeObjectURL(audioRef.current.src)
       }
     }
   }, [])
   ```

3. **Error Boundaries**
   - Envolver componente em ErrorBoundary
   - Fallback UI para erros

## 📝 Passos de Implementação

### Fase 1: Backend (Estimativa: 2-3 horas)

1. **Instalar dependências**

   ```bash
   cd apps/translation-api
   pnpm add wavefile
   ```

2. **Criar schema TTS** (`src/schemas/tts.schema.ts`)

   - Definir tipos de request/response
   - Validações Zod

3. **Criar modelo TTS** (`src/models/TextToSpeech.ts`)

   - Implementar singleton
   - Método `initialize()`
   - Método `synthesize()`

4. **Criar rotas TTS** (`src/routes/tts.routes.ts`)

   - Endpoint `POST /text-to-speech`
   - Validação + chamada ao modelo
   - Error handling

5. **Atualizar app.ts e server.ts**

   - Registrar rotas TTS
   - Preload do modelo TTS

6. **Testar backend**
   ```bash
   pnpm dev
   # Testar com curl/Postman
   curl -X POST http://localhost:3000/text-to-speech \
     -H "Content-Type: application/json" \
     -d '{"text": "Olá, mundo!", "language": "pt"}'
   ```

### Fase 2: Frontend (Estimativa: 2-3 horas)

1. **Criar tipos TTS** (`src/types/tts.ts`)

   - Interfaces de request/response
   - State do audio player

2. **Criar service TTS** (`src/services/tts.ts`)

   - Função `textToSpeech()`
   - Error handling

3. **Criar hook useTextToSpeech** (`src/hooks/useTextToSpeech.ts`)

   - Lógica de geração + reprodução
   - Gerenciamento de estado
   - Cleanup

4. **Atualizar CaptionResult** (`src/features/image-caption/components/CaptionResult.tsx`)

   - Adicionar botão "Ouvir"
   - Integrar hook
   - Loading/error states

5. **Testar frontend**
   - Upload de imagem
   - Gerar legenda
   - Traduzir
   - Clicar em "Ouvir"
   - Verificar reprodução de áudio

### Fase 3: Polimento (Estimativa: 1 hora)

1. **Melhorar UI/UX**

   - Animações de loading
   - Feedback visual durante reprodução
   - Ícones e cores

2. **Adicionar rate limiting** (backend)

3. **Documentação**
   - Atualizar OpenAPI/Scalar
   - Comentários no código
   - README (se necessário)

## ✅ Testes e Validação

### Testes Backend

```bash
# Testar endpoint TTS
curl -X POST http://localhost:3000/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "Esta é uma frase de teste em português.", "language": "pt"}'

# Verificar resposta:
# - audio: string base64
# - format: "wav"
# - sampling_rate: number
# - duration: number

# Testar validação
curl -X POST http://localhost:3000/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'  # Deve retornar erro 400

# Testar texto longo
curl -X POST http://localhost:3000/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{"text": "'$(python3 -c 'print("a" * 501)')'"}'  # Deve retornar erro 400
```

### Testes Frontend

**Casos de teste:**

1. ✅ Botão "Ouvir" aparece apenas quando há tradução
2. ✅ Loading state durante geração de áudio
3. ✅ Áudio é reproduzido corretamente
4. ✅ Botão muda para "Playing..." durante reprodução
5. ✅ Clicar novamente para o áudio
6. ✅ Error message aparece em caso de falha
7. ✅ Cleanup de recursos ao desmontar componente
8. ✅ Funciona em diferentes navegadores (Chrome, Firefox, Safari)

### Testes de Integração

1. **Pipeline completo**

   - Upload de imagem
   - Gerar legenda
   - Traduzir legenda
   - Ouvir tradução
   - Verificar que áudio corresponde ao texto

2. **Múltiplas requisições**

   - Testar várias traduções seguidas
   - Verificar que não há vazamento de memória
   - Confirmar que modelo é reutilizado (singleton)

3. **Casos de erro**
   - API offline
   - Texto inválido
   - Timeout
   - Verificar mensagens de erro claras

## 🚀 Melhorias Futuras (Opcional)

### Curto Prazo

1. **Múltiplas vozes**

   - Permitir escolha de speaker embeddings
   - Personalização de voz (masculino/feminino)

2. **Download de áudio**

   - Botão para baixar WAV
   - Formato alternativo (MP3)

3. **Velocidade de reprodução**

   - Controle de velocidade (0.5x, 1x, 1.5x, 2x)
   - Audio rate control

4. **Idiomas adicionais**
   - Suporte a mais idiomas (espanhol, francês)
   - Detecção automática de idioma

### Médio Prazo

1. **Cache de áudio**

   - Armazenar áudios gerados
   - Evitar regeneração do mesmo texto
   - Implementar LRU cache

2. **Streaming de áudio**

   - Enviar chunks em tempo real
   - Reduzir latência percebida

3. **Batch processing**
   - Gerar múltiplos áudios de uma vez
   - Fila de processamento

### Longo Prazo

1. **Modelos multilíngues**

   - Suporte a mais de 20 idiomas
   - Modelo MMS-TTS da Meta

2. **Fine-tuning**

   - Personalizar voz com exemplos do usuário
   - Voice cloning

3. **Real-time streaming**
   - TTS em tempo real com WebSockets
   - Latência sub-segundo

## 📊 Métricas de Sucesso

- ✅ Endpoint `/text-to-speech` retorna áudio válido
- ✅ Latência < 5 segundos para textos curtos (<100 chars)
- ✅ Taxa de erro < 1%
- ✅ Áudio é compreensível e natural
- ✅ Interface responsiva e intuitiva
- ✅ Sem vazamento de memória após 100 requisições
- ✅ Suporte a navegadores modernos (Chrome, Firefox, Safari)

## 📚 Referências

- [Transformers.js - Text-to-Speech](https://huggingface.co/docs/transformers.js)
- [SpeechT5 TTS Model](https://huggingface.co/Xenova/speecht5_tts)
- [Fastify Documentation](https://fastify.dev/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WAV File Format](https://docs.fileformat.com/audio/wav/)

## 📄 Notas Finais

Este plano fornece uma base sólida e simples para implementar TTS no projeto.
A arquitetura proposta:

- ✅ Reutiliza infraestrutura existente
- ✅ Mantém padrões de código consistentes
- ✅ É escalável e manutenível
- ✅ Segue boas práticas de segurança
- ✅ É educacional e demonstra conceitos de IA multimodal

**Próximos passos**: Implementar Fase 1 (Backend) → Testar → Implementar Fase 2
(Frontend) → Testar → Polir

---

**Autor**: Claude Code
**Versão**: 1.0
**Data**: 2025-10-28
