import { z } from 'zod';
import type { ProgressCallback as TransformersProgressCallback } from '@huggingface/transformers';

export const ImageCaptionRequestSchema = z.object({
  imageUrl: z.string().url('URL da imagem inválida'),
});

export const ImageCaptionResponseSchema = z.object({
  generated_text: z.string(),
  confidence: z.number().optional(),
});

export type ImageCaptionRequest = z.infer<typeof ImageCaptionRequestSchema>;
export type ImageCaptionResponse = z.infer<typeof ImageCaptionResponseSchema>;

// Re-export the correct type from Transformers.js
export type ProgressCallback = TransformersProgressCallback;
