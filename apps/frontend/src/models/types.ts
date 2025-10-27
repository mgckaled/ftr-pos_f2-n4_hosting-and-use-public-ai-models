import { z } from 'zod';

export const ImageCaptionRequestSchema = z.object({
  imageUrl: z.string().url('URL da imagem inválida'),
});

export const ImageCaptionResponseSchema = z.object({
  generated_text: z.string(),
  confidence: z.number().optional(),
});

export type ImageCaptionRequest = z.infer<typeof ImageCaptionRequestSchema>;
export type ImageCaptionResponse = z.infer<typeof ImageCaptionResponseSchema>;

export interface ProgressCallback {
  (progress: {
    status: 'progress' | 'done' | 'error';
    file?: string;
    progress?: number;
    loaded?: number;
    total?: number;
  }): void;
}
