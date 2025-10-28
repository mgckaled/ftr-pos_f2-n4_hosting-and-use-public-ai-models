import { z } from 'zod';

/**
 * Translation request schema
 * Validates incoming translation requests
 */
export const TranslationRequestSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text is too long (max 5000 characters)')
    .describe('Text to be translated'),
  source_lang: z
    .string()
    .length(8)
    .default('eng_Latn')
    .describe('Source language code in NLLB format (e.g., eng_Latn for English)'),
  target_lang: z
    .string()
    .length(8)
    .default('por_Latn')
    .describe('Target language code in NLLB format (e.g., por_Latn for Portuguese)'),
});

/**
 * Translation response schema
 * Defines the structure of successful translation responses
 */
export const TranslationResponseSchema = z.object({
  original: z.string().describe('Original input text'),
  translation: z.string().describe('Translated text'),
  source_lang: z.string().describe('Source language code used'),
  target_lang: z.string().describe('Target language code used'),
});

/**
 * Error response schema
 * Defines the structure of error responses
 */
export const ErrorResponseSchema = z.object({
  error: z.string().describe('Error type'),
  message: z.string().describe('Detailed error message'),
  statusCode: z.number().describe('HTTP status code'),
});

// Type inference from schemas
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;
export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
