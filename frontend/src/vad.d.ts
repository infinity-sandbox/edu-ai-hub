declare module 'vad' {
  enum Mode {
    NORMAL,
    AGGRESSIVE,
    VERY_AGGRESSIVE,
  }

  enum Event {
    VOICE,
    SILENCE,
  }

  class VAD {
    constructor(mode: Mode);
    process(audioData: Float32Array): Event;
  }

  export { Mode, Event };
  export default VAD;
}
