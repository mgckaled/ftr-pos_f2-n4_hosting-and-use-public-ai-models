export interface TextToSpeechRequest {
  text: string
  language?: 'pt' | 'en' | 'es' | 'fr'
}

export interface TextToSpeechResponse {
  audio: string
  format: 'wav'
  sampling_rate: number
  duration: number
}

export interface AudioPlayerState {
  isPlaying: boolean
  isLoading: boolean
  error: string | null
  duration: number | null
}
