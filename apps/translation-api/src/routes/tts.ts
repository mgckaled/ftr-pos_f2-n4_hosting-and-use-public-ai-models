import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  textToSpeechRequestSchema,
  textToSpeechResponseSchema
} from '../schemas/tts.js'
import { TextToSpeech } from '../models/TextToSpeech.js'

export async function ttsRoutes(app: FastifyInstance) {
  const ttsService = TextToSpeech.getInstance()

  app.withTypeProvider<ZodTypeProvider>().post(
    '/text-to-speech',
    {
      schema: {
        summary: 'Convert text to speech',
        description: 'Generate speech audio from text using AI TTS model',
        tags: ['TTS'],
        body: textToSpeechRequestSchema,
        response: {
          200: textToSpeechResponseSchema,
          500: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => {
      const { text, language } = request.body

      request.log.info(
        { textLength: text.length, language },
        'Processing TTS request'
      )

      try {
        const result = await ttsService.synthesize(text)

        return reply.code(200).send({
          audio: result.audioBase64,
          format: 'wav' as const,
          sampling_rate: result.samplingRate,
          duration: result.duration
        })
      } catch (error) {
        request.log.error({ error }, 'TTS synthesis failed')
        return reply.code(500).send({
          error: 'TTS synthesis failed',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  )
}
