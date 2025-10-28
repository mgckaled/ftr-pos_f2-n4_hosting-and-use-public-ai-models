import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  TranslationRequestSchema,
  TranslationResponseSchema,
  ErrorResponseSchema,
} from '../schemas/translate.js';
import Translator from '../models/translator.js';

/**
 * Translation routes plugin
 * Registers POST /translate endpoint with Zod validation
 */
const translateRoutes: FastifyPluginAsyncZod = async (fastify) => {
  /**
   * POST /translate
   * Translates text from source language to target language
   */
  fastify.route({
    method: 'POST',
    url: '/translate',
    schema: {
      description: 'Translate text from one language to another',
      tags: ['translation'],
      body: TranslationRequestSchema,
      response: {
        200: TranslationResponseSchema,
        400: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const { text, source_lang, target_lang } = request.body;

      try {
        console.log(`[POST /translate] Request received`);
        console.log(`  - Source: ${source_lang}`);
        console.log(`  - Target: ${target_lang}`);
        console.log(`  - Text length: ${text.length} chars`);

        // Perform translation
        const translation = await Translator.translate(
          text,
          source_lang,
          target_lang
        );

        const response = {
          original: text,
          translation,
          source_lang,
          target_lang,
        };

        console.log(`[POST /translate] Translation successful`);
        return reply.code(200).send(response);
      } catch (error) {
        console.error('[POST /translate] Translation error:', error);

        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';

        return reply.code(500).send({
          error: 'Translation failed',
          message: errorMessage,
          statusCode: 500,
        });
      }
    },
  });

  /**
   * GET /health
   * Health check endpoint to verify the API is running
   */
  fastify.get('/health', async (request, reply) => {
    return reply.code(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'translation-api',
    });
  });
};

export default translateRoutes;
