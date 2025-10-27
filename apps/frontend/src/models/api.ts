import ImageCaptioner from './ImageCaptioner';
import { ImageCaptionRequestSchema, type ImageCaptionResponse } from './types';
import type { ProgressCallback } from './types';

export async function generateCaption(
  imageUrl: string,
  progressCallback?: ProgressCallback
): Promise<string> {
  const validated = ImageCaptionRequestSchema.parse({ imageUrl });

  const captioner = await ImageCaptioner.getInstance(progressCallback);

  const result = (await captioner(validated.imageUrl)) as ImageCaptionResponse[];

  if (!result || result.length === 0) {
    throw new Error('Failed to generate caption');
  }

  return result[0].generated_text;
}

export { ImageCaptioner };
