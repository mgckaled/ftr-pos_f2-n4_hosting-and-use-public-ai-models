import { useState, useCallback } from 'react';
import { generateCaption } from '../models/api';

interface UseImageCaptionReturn {
  caption: string;
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
  progress: number;
  generate: (imageUrl: string) => Promise<void>;
  reset: () => void;
}

export function useImageCaption(): UseImageCaptionReturn {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generate = useCallback(async (imageUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      setImageUrl(imageUrl);

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
    setImageUrl('');
    setError(null);
    setProgress(0);
  }, []);

  return {
    caption,
    imageUrl,
    isLoading,
    error,
    progress,
    generate,
    reset,
  };
}
