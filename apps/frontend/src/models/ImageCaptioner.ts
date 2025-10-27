import { pipeline, Pipeline } from '@huggingface/transformers';
import type { ProgressCallback } from './types';

class ImageCaptioner {
  private static instance: Pipeline | null = null;
  private static readonly MODEL = 'Xenova/vit-gpt2-image-captioning';
  private static isLoading = false;

  static async getInstance(progressCallback?: ProgressCallback): Promise<Pipeline> {
    if (this.instance) {
      return this.instance;
    }

    if (this.isLoading) {
      throw new Error('Model is already loading');
    }

    try {
      this.isLoading = true;
      console.log('[ImageCaptioner] Loading model...');

      this.instance = await pipeline('image-to-text', this.MODEL, {
        dtype: 'q8',
        device: 'webgpu',
        progress_callback: progressCallback,
      });

      console.log('[ImageCaptioner] Model loaded!');
      return this.instance;
    } catch (error) {
      console.error('[ImageCaptioner] Failed to load model:', error);
      throw error;
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
