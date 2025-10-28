# Plano Detalhado: Frontend React + Vite + TypeScript + shadcn/ui

## Visão Geral

Aplicação React que gera legendas para imagens usando IA rodando no navegador
(client-side).

**Tecnologias principais:**

- React 18.3+
- Vite 5.4+
- TypeScript 5.9+
- Tailwind CSS v4 (com `@tailwindcss/vite`)
- shadcn/ui (componentes)
- Transformers.js (Hugging Face)
- Zod (validação runtime)
- Vitest (testes)

**Modelo de IA:**

- Nome: `Xenova/vit-gpt2-image-captioning`
- Tamanho: ~300MB
- Quantização: q8 (otimizado para browser)
- Execução: 100% no navegador (offline após download)

## Estrutura de Diretórios

```text
apps/frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── ui/                        # Componentes shadcn/ui (gerados via CLI)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── progress.tsx
│   │       └── alert.tsx
│   ├── features/                      # Features da aplicação
│   │   └── image-caption/
│   │       ├── ImageCaptionForm.tsx
│   │       ├── ImagePreview.tsx
│   │       ├── CaptionResult.tsx
│   │       └── ProgressIndicator.tsx
│   ├── models/                        # Lógica de IA isolada (Singleton)
│   │   ├── ImageCaptioner.ts
│   │   ├── api.ts
│   │   └── types.ts
│   ├── hooks/                         # Custom React Hooks
│   │   ├── useImageCaption.ts
│   │   └── useModelLoader.ts
│   ├── lib/                           # Utilitários
│   │   └── utils.ts                   # cn() helper do shadcn
│   ├── types/                         # TypeScript types globais
│   │   └── global.d.ts
│   ├── App.tsx                        # Componente raiz
│   ├── main.tsx                       # Entry point
│   ├── index.css                      # Estilos globais + Tailwind
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   │   ├── ImageCaptioner.test.ts
│   │   └── useImageCaption.test.ts
│   ├── integration/
│   │   └── ImageCaptionFlow.test.tsx
│   └── setup.ts
├── .env.example
├── .eslintrc.cjs
├── components.json                    # Config shadcn/ui
├── index.html
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── package.json
└── README.md
```

## Dependências

### package.json

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
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@huggingface/transformers": "^3.2.0",
    "zod": "^3.24.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.7.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0",
    "typescript": "^5.9.3",
    "@types/node": "^22.8.0",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^4.1.10",
    "@tailwindcss/vite": "^4.1.10",
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
    "prettier": "^3.6.2"
  }
}
```

## Configurações

### tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### tsconfig.app.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### vite.config.ts

```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          transformers: ['@huggingface/transformers'],
        },
      },
    },
  },
});
```

### src/index.css

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### components.json (shadcn/ui)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

## Implementação Detalhada

### 1. Model Layer (src/models/)

#### types.ts

```typescript
import { z } from 'zod';

export const ImageCaptionRequestSchema = z.object({
  imageUrl: z.string().url('URL da imagem inválida'),
});

export const ImageCaptionResponseSchema = z.object({
  generated_text: z.string(),
  confidence: z.number().optional(),
});

export type ImageCaptionRequest = z.infer<typeof ImageCaptionRequestSchema>;
export type ImageCaptionResponse = z.infer<typeof ImageCaptionResponseSchema>;

export interface ProgressCallback {
  (progress: {
    status: 'progress' | 'done' | 'error';
    file?: string;
    progress?: number;
    loaded?: number;
    total?: number;
  }): void;
}
```

#### ImageCaptioner.ts (Singleton Pattern)

```typescript
import { pipeline, Pipeline } from '@huggingface/transformers';
import type { ProgressCallback } from './types';

class ImageCaptioner {
  private static instance: Pipeline | null = null;
  private static readonly MODEL = 'Xenova/vit-gpt2-image-captioning';
  private static isLoading = false;

  static async getInstance(progressCallback?: ProgressCallback): Promise<Pipeline> {
    if (this.instance) {
      return this.instance;
    }

    if (this.isLoading) {
      throw new Error('Model is already loading');
    }

    try {
      this.isLoading = true;
      console.log('[ImageCaptioner] Loading model...');

      this.instance = await pipeline('image-to-text', this.MODEL, {
        dtype: 'q8',
        device: 'webgpu',
        progress_callback: progressCallback,
      });

      console.log('[ImageCaptioner] Model loaded!');
      return this.instance;
    } catch (error) {
      console.error('[ImageCaptioner] Failed to load model:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  static isModelLoaded(): boolean {
    return this.instance !== null;
  }

  static clearInstance(): void {
    this.instance = null;
  }
}

export default ImageCaptioner;
```

#### api.ts

```typescript
import ImageCaptioner from './ImageCaptioner';
import { ImageCaptionRequestSchema, type ImageCaptionResponse } from './types';
import type { ProgressCallback } from './types';

export async function generateCaption(
  imageUrl: string,
  progressCallback?: ProgressCallback
): Promise<string> {
  const validated = ImageCaptionRequestSchema.parse({ imageUrl });

  const captioner = await ImageCaptioner.getInstance(progressCallback);

  const result = (await captioner(validated.imageUrl)) as ImageCaptionResponse[];

  if (!result || result.length === 0) {
    throw new Error('Failed to generate caption');
  }

  return result[0].generated_text;
}

export { ImageCaptioner };
```

### 2. Custom Hooks (src/hooks/)

#### useImageCaption.ts

```typescript
import { useState, useCallback } from 'react';
import { generateCaption } from '../models/api';

interface UseImageCaptionReturn {
  caption: string;
  isLoading: boolean;
  error: string | null;
  progress: number;
  generate: (imageUrl: string) => Promise<void>;
  reset: () => void;
}

export function useImageCaption(): UseImageCaptionReturn {
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generate = useCallback(async (imageUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      const result = await generateCaption(imageUrl, (progressData) => {
        if (progressData.status === 'progress' && progressData.progress) {
          setProgress(Math.round(progressData.progress));
        }
      });

      setCaption(result);
      setProgress(100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCaption('');
    setError(null);
    setProgress(0);
  }, []);

  return {
    caption,
    isLoading,
    error,
    progress,
    generate,
    reset,
  };
}
```

### 3. Features (src/features/image-caption/)

#### ImageCaptionForm.tsx

```typescript
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageCaptionFormProps {
  onSubmit: (imageUrl: string) => void;
  isLoading: boolean;
}

export function ImageCaptionForm({ onSubmit, isLoading }: ImageCaptionFormProps) {
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onSubmit(imageUrl.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generate Image Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !imageUrl.trim()} className="w-full">
            {isLoading ? 'Generating...' : 'Generate Caption'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

#### ProgressIndicator.tsx

```typescript
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  progress: number;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground text-center">{progress}%</p>
    </div>
  );
}
```

#### CaptionResult.tsx

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CaptionResultProps {
  caption: string;
  onReset: () => void;
}

export function CaptionResult({ caption, onReset }: CaptionResultProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Generated Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{caption}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} variant="outline" className="w-full">
          Generate Another
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### 4. App.tsx (Componente Principal)

```typescript
import { useImageCaption } from './hooks/useImageCaption';
import { ImageCaptionForm } from './features/image-caption/ImageCaptionForm';
import { ProgressIndicator } from './features/image-caption/ProgressIndicator';
import { CaptionResult } from './features/image-caption/CaptionResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function App() {
  const { caption, isLoading, error, progress, generate, reset } = useImageCaption();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">AI Image Captioning</h1>
          <p className="text-muted-foreground">
            Generate captions for images using AI (runs in your browser)
          </p>
        </header>

        <main className="flex flex-col items-center gap-6">
          <ImageCaptionForm onSubmit={generate} isLoading={isLoading} />

          {isLoading && <ProgressIndicator progress={progress} />}

          {error && (
            <Alert variant="destructive" className="w-full max-w-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {caption && !isLoading && <CaptionResult caption={caption} onReset={reset} />}
        </main>
      </div>
    </div>
  );
}

export default App;
```

## Passo a Passo de Criação

### Fase 1: Inicialização

```bash
cd apps/
pnpm create vite@latest frontend --template react-ts
cd frontend
pnpm install
```

### Fase 2: Adicionar Tailwind CSS v4

```bash
pnpm add tailwindcss @tailwindcss/vite
```

Substituir `src/index.css`:

```css
@import "tailwindcss";
```

### Fase 3: Configurar TypeScript

Atualizar `tsconfig.json`, `tsconfig.app.json` e `vite.config.ts` conforme seções acima.

Instalar `@types/node`:

```bash
pnpm add -D @types/node
```

### Fase 4: Inicializar shadcn/ui

```bash
pnpm dlx shadcn@latest init
```

Selecionar:

- Style: Default
- Base color: Neutral
- CSS variables: Yes

### Fase 5: Adicionar Componentes shadcn/ui

```bash
pnpm dlx shadcn@latest add button card input label progress alert
```

### Fase 6: Adicionar Dependências do Projeto

```bash
pnpm add @huggingface/transformers zod lucide-react
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D eslint typescript-eslint
pnpm add -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Fase 7: Criar Estrutura de Diretórios

```bash
mkdir -p src/{models,hooks,features/image-caption,lib,types}
mkdir -p tests/{unit,integration}
```

### Fase 8: Implementar

**Ordem:**

1. Model Layer (`src/models/`).
2. Custom Hooks (`src/hooks/`).
3. Features (`src/features/image-caption/`).
4. App.tsx.

### Fase 9: Configurar Testes

Criar `vitest.config.ts` e `tests/setup.ts`.

### Fase 10: Build e Deploy

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm build
pnpm preview
```

## Componentes shadcn/ui Utilizados

- **Button**: Botão de submit do formulário.
- **Card**: Container dos componentes (form, result).
- **Input**: Campo de entrada de URL.
- **Label**: Label do input.
- **Progress**: Barra de progresso de download do modelo.
- **Alert**: Exibição de erros.

## Próximas Melhorias

1. Adicionar suporte para upload de imagens locais.
2. Integração com API de tradução (Backend Node.js).
3. Integração com API TTS (Backend Python).
4. Adicionar dark mode toggle.
5. Adicionar histórico de legendas.
6. PWA (Progressive Web App).

## Observações Técnicas

### Tailwind CSS v4

- Usa o plugin `@tailwindcss/vite` ao invés de PostCSS.
- Importa direto no CSS: `@import "tailwindcss"`.
- Mais rápido e simples que v3.

### shadcn/ui

- Componentes **copiados** para o projeto (não npm package).
- Totalmente customizáveis.
- Usa Radix UI internamente (acessibilidade).
- Integração perfeita com Tailwind CSS.

### Singleton Pattern

Modelo carregado **uma única vez**, reutilizado para todas as requisições.

### Quantização (q8)

Modelo usa quantização de 8 bits para reduzir tamanho e melhorar performance
no navegador.

### WebGPU

Se disponível, Transformers.js usa WebGPU para acelerar inferência.

## Checklist de Implementação

- [ ] Criar projeto Vite.
- [ ] Instalar Tailwind CSS v4.
- [ ] Configurar TypeScript paths.
- [ ] Inicializar shadcn/ui.
- [ ] Adicionar componentes shadcn/ui.
- [ ] Instalar dependências do projeto.
- [ ] Criar estrutura de diretórios.
- [ ] Implementar Model Layer.
- [ ] Implementar Custom Hooks.
- [ ] Implementar Features.
- [ ] Implementar App.tsx.
- [ ] Configurar Vitest.
- [ ] Escrever testes.
- [ ] Build e testar.
- [ ] Documentar no README.md.
- [ ] Commit.

## Referências

- shadcn/ui: <https://ui.shadcn.com/>
- Tailwind CSS v4: <https://tailwindcss.com/>
- Transformers.js: <https://huggingface.co/docs/transformers.js>
- Vite: <https://vitejs.dev/>
- Vitest: <https://vitest.dev/>
- Zod: <https://zod.dev/>
