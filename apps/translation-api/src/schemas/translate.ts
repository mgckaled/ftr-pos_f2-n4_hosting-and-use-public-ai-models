import { z } from 'zod';

/**
 * Translation request schema
 * Validates incoming translation requests
 */
export const TranslationRequestSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(5000, 'Text is too long (max 5000 characters)'),
  source_lang: z.string().length(8).default('eng_Latn'),
  target_lang: z.string().length(8).default('por_Latn'),
});

/**
 * Translation response schema
 * Defines the structure of successful translation responses
 */
export const TranslationResponseSchema = z.object({
  original: z.string(),
  translation: z.string(),
  source_lang: z.string(),
  target_lang: z.string(),
});

/**
 * Error response schema
 * Defines the structure of error responses
 */
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

// Type inference from schemas
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;
export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
