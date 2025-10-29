import { z } from 'zod'

export const textToSpeechRequestSchema = z.object({
  text: z
    .string()
    .min(1, 'Text cannot be empty')
    .max(500, 'Text too long (max 500 characters)'),
  language: z
    .enum(['pt', 'en', 'es', 'fr'])
    .default('pt')
    .describe('Target language for TTS')
})

export const textToSpeechResponseSchema = z.object({
  audio: z.string().describe('Base64-encoded WAV audio'),
  format: z.literal('wav').describe('Audio format'),
  sampling_rate: z.number().describe('Audio sampling rate (Hz)'),
  duration: z.number().describe('Audio duration in seconds')
})

export const textToSpeechErrorSchema = z.object({
  error: z.string(),
  message: z.string()
})

export type TextToSpeechRequest = z.infer<typeof textToSpeechRequestSchema>
export type TextToSpeechResponse = z.infer<typeof textToSpeechResponseSchema>
