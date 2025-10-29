export type TextToSpeechRequest = {
  text: string;
  language?: 'pt' | 'en' | 'es' | 'fr';
};

export type TextToSpeechResponse = {
  audio: string | number[];
  format: 'wav';
  sampling_rate: number;
  duration: number;
};

export type AudioPlayerState = {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number | null;
};
