import { useState, useCallback, useRef } from 'react'
import { textToSpeech } from '@/services/tts'
import { AudioPlayerState } from '@/types/tts'

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

export function useTextToSpeech() {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    error: null,
    duration: null
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(
    async (text: string, language: 'pt' | 'en' = 'pt') => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await textToSpeech({ text, language })

        const audioBlob = base64ToBlob(response.audio, 'audio/wav')
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.pause()
          URL.revokeObjectURL(audioRef.current.src)
        }

        const audio = new Audio(audioUrl)
        audioRef.current = audio

        audio.addEventListener('play', () => {
          setState((prev) => ({
            ...prev,
            isPlaying: true,
            isLoading: false,
            duration: response.duration
          }))
        })

        audio.addEventListener('pause', () => {
          setState((prev) => ({ ...prev, isPlaying: false }))
        })

        audio.addEventListener('ended', () => {
          setState((prev) => ({ ...prev, isPlaying: false }))
          URL.revokeObjectURL(audioUrl)
        })

        audio.addEventListener('error', () => {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isLoading: false,
            error: 'Failed to play audio'
          }))
        })

        await audio.play()
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Failed to generate speech'
        }))
      }
    },
    []
  )

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return {
    ...state,
    speak,
    stop
  }
}
