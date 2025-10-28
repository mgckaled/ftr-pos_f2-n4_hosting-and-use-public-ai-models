import { useState, useCallback } from 'react';
import { translateText } from '../services/translation';

interface UseTranslationReturn {
  translation: string;
  isTranslating: boolean;
  error: string | null;
  translate: (text: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing translation state
 */
export function useTranslation(): UseTranslationReturn {
  const [translation, setTranslation] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string) => {
    try {
      setIsTranslating(true);
      setError(null);

      const result = await translateText(text);
      setTranslation(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      console.error('[useTranslation] Error:', err);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTranslation('');
    setError(null);
  }, []);

  return {
    translation,
    isTranslating,
    error,
    translate,
    reset,
  };
}
