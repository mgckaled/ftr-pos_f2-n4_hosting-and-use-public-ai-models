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

  // Run inference with enhanced generation parameters for more detailed captions
  const result = (await captioner(validated.imageUrl, {
    max_new_tokens: 40,      // Generate longer descriptions (default: ~20)
    num_beams: 5,            // Use beam search for better quality
    temperature: 0.9,        // Control randomness (lower = more focused)
    repetition_penalty: 1.2, // Reduce repetitive words (1.0 = no penalty)
  })) as ImageCaptionResponse[];
  console.log('[API] Inference complete, result:', result);

  if (!result || result.length === 0) {
    throw new Error('Model returned empty result');
  }

  const caption = result[0].generated_text;
  console.log('[API] Generated caption:', caption);

  return caption;
}

export { ImageCaptioner };
