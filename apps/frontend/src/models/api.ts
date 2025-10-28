import ImageCaptioner from './ImageCaptioner';
import { ImageCaptionRequestSchema, type ImageCaptionResponse } from './types';
import type { ProgressCallback } from './types';

export async function generateCaption(
  imageUrl: string,
  progressCallback?: ProgressCallback
): Promise<string> {
  console.log('[API] Starting caption generation for:', imageUrl);

  // Validate input
  const validated = ImageCaptionRequestSchema.parse({ imageUrl });
  console.log('[API] Input validated');

  // Get model instance
  const captioner = await ImageCaptioner.getInstance(progressCallback);
  console.log('[API] Model instance obtained, running inference...');

  // Run inference
  const result = (await captioner(validated.imageUrl)) as ImageCaptionResponse[];
  console.log('[API] Inference complete, result:', result);

  if (!result || result.length === 0) {
    throw new Error('Model returned empty result');
  }

  const caption = result[0].generated_text;
  console.log('[API] Generated caption:', caption);

  return caption;
}

export { ImageCaptioner };
