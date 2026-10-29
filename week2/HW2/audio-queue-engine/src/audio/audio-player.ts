export type FrequencyBins = 256 | 512;

export class AudioPlayer {
  readonly analyser: AnalyserNode;

  private source: AudioBufferSourceNode | null = null;

  private readonly audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.analyser = audioContext.createAnalyser();

    // 512 FFT samples = 256 frequency bins
    this.analyser.fftSize = 512;

    this.analyser.smoothingTimeConstant = 0.8;

    this.analyser.connect(audioContext.destination);
  }

  setBins(bins: FrequencyBins): void {
    this.analyser.fftSize = bins * 2;
  }

  play(
    buffer: AudioBuffer,
    onEnded?: () => void
  ): void {
    // Stop and detach any previous source.
    this.stop();

    // Source nodes can only be started once.
    const source =
      this.audioContext.createBufferSource();

    source.buffer = buffer;

    // Audio graph:
    // source -> analyser -> speakers
    source.connect(this.analyser);

    this.source = source;

    source.onended = () => {
      source.disconnect();

      if (this.source === source) {
        this.source = null;
        onEnded?.();
      }
    };

    try {
      source.start();
    } catch (error) {
      source.onended = null;
      source.disconnect();
      this.source = null;
      throw error;
    }
  }

  stop(): void {
    const source = this.source;

    if (!source) return;

    this.source = null;
    source.onended = null;

    try {
      source.stop();
    } catch (error) {
      // A source that was never started cannot
      // be stopped with the Web Audio API.
      if (
        !(
          error instanceof DOMException &&
          error.name === "InvalidStateError"
        )
      ) {
        throw error;
      }
    } finally {
      source.disconnect();
    }
  }

  dispose(): void {
    this.stop();
    this.analyser.disconnect();
  }
}
