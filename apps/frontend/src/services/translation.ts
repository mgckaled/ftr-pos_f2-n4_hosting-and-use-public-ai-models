import { z } from 'zod';

/**
 * Translation API schemas
 */
const TranslationRequestSchema = z.object({
  text: z.string(),
  source_lang: z.string().default('eng_Latn'),
  target_lang: z.string().default('por_Latn'),
});

const TranslationResponseSchema = z.object({
  original: z.string(),
  translation: z.string(),
  source_lang: z.string(),
  target_lang: z.string(),
});

type TranslationRequest = z.infer<typeof TranslationRequestSchema>;
type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

/**
 * Get API URL from environment variables
 */
const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return apiUrl;
};

/**
 * Translate text from English to Portuguese
 *
 * @param text - Text to translate (English)
 * @returns Translated text (Portuguese)
 */
export async function translateText(text: string): Promise<string> {
  const apiUrl = getApiUrl();
  const endpoint = `${apiUrl}/translate`;

  console.log('[Translation] Translating text:', text.substring(0, 50) + '...');

  try {
    const requestBody: TranslationRequest = {
      text,
      source_lang: 'eng_Latn',
      target_lang: 'por_Latn',
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Translation failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const validated = TranslationResponseSchema.parse(data);

    console.log('[Translation] Translation successful:', validated.translation);

    return validated.translation;
  } catch (error) {
    console.error('[Translation] Error:', error);

    if (error instanceof Error) {
      throw new Error(`Translation failed: ${error.message}`);
    }

    throw new Error('Translation failed: Unknown error');
  }
}
