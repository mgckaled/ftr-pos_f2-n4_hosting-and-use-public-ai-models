import { pipeline } from '@huggingface/transformers';
import type { ProgressCallback } from './types';

// Type-safe pipeline interface
type ImageToTextPipeline = (
  imageUrl: string,
  options?: {
    max_new_tokens?: number;
    num_beams?: number;
    temperature?: number;
    repetition_penalty?: number;
  }
) => Promise<Array<{ generated_text: string }>>;

class ImageCaptioner {
  private static instance: ImageToTextPipeline | null = null;
  private static readonly MODEL = 'Xenova/vit-gpt2-image-captioning';
  private static isLoading = false;

  static async getInstance(
    progressCallback?: ProgressCallback
  ): Promise<ImageToTextPipeline> {
    if (this.instance) {
      console.log('[ImageCaptioner] Using cached model instance');
      return this.instance;
    }

    if (this.isLoading) {
      throw new Error('Model is already loading');
    }

    try {
      this.isLoading = true;
      console.log('[ImageCaptioner] Loading model...');

      // Try WebGPU first, fallback to WASM automatically
      const pipelineInstance = await pipeline('image-to-text', this.MODEL, {
        dtype: 'q8',
        progress_callback: progressCallback,
      });

      // Type assertion to our interface (runtime behavior is correct)
      this.instance = pipelineInstance as unknown as ImageToTextPipeline;

      console.log('[ImageCaptioner] Model loaded successfully!');
      return this.instance;
    } catch (error) {
      console.error('[ImageCaptioner] Failed to load model:', error);
      this.instance = null;
      throw new Error(
        `Failed to load AI model: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      this.isLoading = false;
    }
  }

  static isModelLoaded(): boolean {
    return this.instance !== null;
  }

  static clearInstance(): void {
    this.instance = null;
  }
}

export default ImageCaptioner;
