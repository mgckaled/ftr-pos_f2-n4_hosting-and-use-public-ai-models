import { TextToSpeechRequest, TextToSpeechResponse } from '@/types/tts'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export class TextToSpeechError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'TextToSpeechError'
  }
}

export async function textToSpeech(
  request: TextToSpeechRequest
): Promise<TextToSpeechResponse> {
  try {
    const response = await fetch(`${API_URL}/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new TextToSpeechError(
        error.message || 'Failed to generate speech',
        response.status
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof TextToSpeechError) {
      throw error
    }

    throw new TextToSpeechError(
      'Network error: Could not connect to TTS service'
    )
  }
}
