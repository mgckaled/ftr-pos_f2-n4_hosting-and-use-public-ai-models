import { buildApp } from './app.js';
import Translator from './models/translator.js';
import { TextToSpeech } from './models/TextToSpeech.js';

/**
 * Server entry point
 * Initializes Fastify app and starts the server
 */
async function start() {
  try {
    // Build Fastify app
    const app = await buildApp();

    // Get configuration from environment
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    // Preload AI models before accepting requests
    // This avoids cold start delays on first request
    app.log.info('[Server] Preloading AI models...');
    const translator = Translator.getInstance();
    const ttsService = TextToSpeech.getInstance();

    await Promise.all([
      translator,
      ttsService.initialize()
    ]);

    app.log.info('[Server] AI models preloaded successfully');

    // Start server
    await app.listen({ port, host });

    app.log.info(`[Server] Translation API running on http://${host}:${port}`);
    app.log.info(`[Server] Health check: http://${host}:${port}/health`);
    app.log.info(`[Server] Translation endpoint: http://${host}:${port}/translate`);
    app.log.info(`[Server] Text-to-Speech endpoint: http://${host}:${port}/text-to-speech`);
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
start();
