export interface ParamsVoiceElevenLabsV1 {
  text: string,
  model_id: "eleven_multilingual_v1",
  voice_settings: {
    stability: number,
    similarity_boost: number
  }
}

export interface ParamsVoiceElevenLabsV2 {
  text: string,
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: number,
    similarity_boost: number,
    style: number,
    use_speaker_boost: boolean
  }
}
