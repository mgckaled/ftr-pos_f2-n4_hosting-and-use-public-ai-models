import { useImageCaption } from './hooks/useImageCaption';
import { ImageCaptionForm } from './features/image-caption/ImageCaptionForm';
import { ProgressIndicator } from './features/image-caption/ProgressIndicator';
import { CaptionResult } from './features/image-caption/CaptionResult';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

function App() {
  const { caption, isLoading, error, progress, generate, reset } = useImageCaption();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ModeToggle />
        </div>

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
