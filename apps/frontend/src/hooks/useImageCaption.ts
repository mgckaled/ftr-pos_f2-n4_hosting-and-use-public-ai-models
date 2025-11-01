import { useState, useCallback } from 'react';
import { generateCaption } from '../models/api';

interface UseImageCaptionReturn {
  caption: string;
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
  progress: number;
  stage: string;
  generate: (imageUrl: string) => Promise<void>;
  reset: () => void;
}

export function useImageCaption(): UseImageCaptionReturn {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');

  const generate = useCallback(async (imageUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);
      setStage('Loading AI model...');
      setImageUrl(imageUrl);

      const result = await generateCaption(imageUrl, (progressData) => {
        if (progressData.status === 'progress' && progressData.progress) {
          const progressValue = Math.round(progressData.progress);
          setProgress(progressValue);

          // Update stage based on progress
          if (progressValue < 100) {
            setStage('Downloading model...');
          }
        } else if (progressData.status === 'done') {
          setStage('Processing image...');
        }
      });

      setStage('Generating caption...');
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
    setStage('');
  }, []);

  return {
    caption,
    imageUrl,
    isLoading,
    error,
    progress,
    stage,
    generate,
    reset,
  };
}
