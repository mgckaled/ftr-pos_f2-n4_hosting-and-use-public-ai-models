import { ModeToggle } from '@/components/mode-toggle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { CaptionResult } from './features/image-caption/CaptionResult';
import { ImageCaptionForm } from './features/image-caption/ImageCaptionForm';
import { ProgressIndicator } from './features/image-caption/ProgressIndicator';
import { useImageCaption } from './hooks/useImageCaption';

function App() {
  const { caption, isLoading, error, progress, stage, generate, reset } = useImageCaption();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-end mb-6">
          <ModeToggle />
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
            AI Image Captioning
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Generate captions for images using AI (runs in your browser)
          </p>
        </header>

        <main className="flex flex-col items-center gap-6">
          <ImageCaptionForm onSubmit={generate} isLoading={isLoading} />

          {isLoading && <ProgressIndicator progress={progress} stage={stage} />}

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
