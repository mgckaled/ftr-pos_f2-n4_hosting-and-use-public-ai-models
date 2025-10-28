import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Copy, Languages, Loader2, AlertCircle, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface CaptionResultProps {
  caption: string;
  onReset: () => void;
}

export function CaptionResult({ caption, onReset }: CaptionResultProps) {
  const [copied, setCopied] = useState(false);
  const [copiedTranslation, setCopiedTranslation] = useState(false);
  const { translation, isTranslating, error, translate, reset: resetTranslation } = useTranslation();
  const { isPlaying, isLoading: isTTSLoading, error: ttsError, speak, stop } = useTextToSpeech();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCopyTranslation = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setCopiedTranslation(true);
      setTimeout(() => setCopiedTranslation(false), 2000);
    } catch (err) {
      console.error('Failed to copy translation:', err);
    }
  };

  const handleTranslate = async () => {
    await translate(caption);
  };

  const handleReset = () => {
    resetTranslation();
    stop();
    onReset();
  };

  const handleSpeak = () => {
    if (!translation) return;
    if (isPlaying) {
      stop();
    } else {
      speak(translation, 'pt');
    }
  };

  return (
    <Card className="w-full max-w-2xl hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle>Generated Caption</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Original Caption (English) */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">English</p>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-lg">{caption}</p>
          </div>
        </div>

        {/* Translation (Portuguese) */}
        {translation && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm font-medium text-muted-foreground mb-2">Português</p>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-lg">{translation}</p>
            </div>
          </div>
        )}

        {/* Translation Error */}
        {error && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* TTS Error */}
        {ttsError && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{ttsError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {/* Translation Button Row */}
        {!translation && (
          <Button
            onClick={handleTranslate}
            disabled={isTranslating}
            size="lg"
            className="w-full rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Translate to Portuguese
              </>
            )}
          </Button>
        )}

        {/* Action Buttons Row */}
        <div className="flex gap-2 w-full">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="lg"
            className="flex-1 rounded-xl font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Caption
              </>
            )}
          </Button>

          {translation && (
            <>
              <Button
                onClick={handleCopyTranslation}
                variant="secondary"
                size="lg"
                className="flex-1 rounded-xl font-medium cursor-pointer"
              >
                {copiedTranslation ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Translation
                  </>
                )}
              </Button>

              <Button
                onClick={handleSpeak}
                disabled={isTTSLoading}
                variant="secondary"
                size="lg"
                className="flex-1 rounded-xl font-medium cursor-pointer"
              >
                {isTTSLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : isPlaying ? (
                  <>
                    <Volume2 className="mr-2 h-4 w-4 text-primary" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-4 w-4" />
                    Listen
                  </>
                )}
              </Button>
            </>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl font-medium cursor-pointer"
          >
            Generate Another
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
