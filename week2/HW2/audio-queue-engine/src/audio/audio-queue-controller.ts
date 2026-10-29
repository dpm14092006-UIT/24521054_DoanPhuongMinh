interface AudioTask {
  trackUrl: string;
  controller: AbortController;
  resolve: (buffer: AudioBuffer) => void;
  reject: (reason: unknown) => void;
}

function createAbortError(): DOMException {
  return new DOMException(
    "Audio task was cancelled",
    "AbortError"
  );
}

export class AudioTaskQueue {
  private queue: AudioTask[] = [];
  private isProcessing = false;
  private activeController: AbortController | null = null;
  private disposed = false;

  private readonly audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;}

  async enqueue(trackUrl: string): Promise<AudioBuffer> {
    if (this.disposed) {
      throw new Error("AudioTaskQueue has been disposed");
    }

    const controller = new AbortController();

    return new Promise<AudioBuffer>((resolve, reject) => {
      this.queue.push({
        trackUrl,
        controller,
        resolve,
        reject,
      });

      void this.processNext();
    });
  }

  private async processNext(): Promise<void> {
    // Only one worker can process the queue.
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      while (this.queue.length > 0) {
        const task = this.queue.shift()!;

        if (task.controller.signal.aborted) {
          task.reject(createAbortError());
          continue;
        }

        this.activeController = task.controller;

        try {
          // 1. Download
          const response = await fetch(task.trackUrl, {
            signal: task.controller.signal,
          });

          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}: ${task.trackUrl}`
            );
          }

          // 2. Read complete audio file
          const arrayBuffer = await response.arrayBuffer();

          if (task.controller.signal.aborted) {
            throw createAbortError();
          }

          // 3. Decode to AudioBuffer
          const audioBuffer =
            await this.audioContext.decodeAudioData(
              arrayBuffer
            );

          // decodeAudioData does not accept AbortSignal.
          // Discard its result when cancellation occurred.
          if (task.controller.signal.aborted) {
            throw createAbortError();
          }

          // 4. Return the decoded buffer
          task.resolve(audioBuffer);
        } catch (error) {
          task.reject(error);
        } finally {
          this.activeController = null;
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  cancelAll(): void {
    // Abort the active download, if any.
    this.activeController?.abort();

    // Reject tasks that have not started yet.
    const pendingTasks = this.queue.splice(0);

    for (const task of pendingTasks) {
      task.controller.abort();
      task.reject(createAbortError());
    }
  }

  dispose(): void {
    if (this.disposed) return;

    this.disposed = true;
    this.cancelAll();
  }
}
