import { useEffect, useRef, useState } from "react";

import { AudioTaskQueue } from "./audio/audio-queue-controller";
import {
  AudioPlayer,
  type FrequencyBins,
} from "./audio/audio-player";
import { AudioVisualizer } from "./components/AudioVisualizer";

type Track = {
  id: string;
  title: string;
  url: string;
};

type LoadStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

const TRACKS: Track[] = [
  {
    id: "a",
    title: "Track A",
    url: "/audio/track-a.mp3",
  },
  {
    id: "b",
    title: "Track B",
    url: "/audio/track-b.mp3",
  },
  {
    id: "c",
    title: "Track C",
    url: "/audio/track-c.mp3",
  },
];

export default function App() {
  const contextRef = useRef<AudioContext | null>(null);
  const queueRef = useRef<AudioTaskQueue | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  const buffersRef = useRef<Map<string, AudioBuffer>>(
    new Map()
  );

  const inFlightRef = useRef<Map<string, number>>(
    new Map()
  );

  const generationRef = useRef(0);
  const playbackTokenRef = useRef(0);
  const mountedRef = useRef(false);

  const [analyser, setAnalyser] =
    useState<AnalyserNode | null>(null);

  const [bins, setBins] = useState<FrequencyBins>(256);

  const [statuses, setStatuses] =
    useState<Record<string, LoadStatus>>({});

  const [playingId, setPlayingId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  // Create the audio engine only when the user
  // starts interacting with the application.
  function ensureEngine() {
    if (!contextRef.current) {
      const audioContext = new AudioContext();

      const queue = new AudioTaskQueue(audioContext);
      const player = new AudioPlayer(audioContext);

      player.setBins(bins);

      contextRef.current = audioContext;
      queueRef.current = queue;
      playerRef.current = player;

      setAnalyser(player.analyser);
    }

    return {
      context: contextRef.current!,
      queue: queueRef.current!,
      player: playerRef.current!,
    };
  }

  function updateStatus(id: string, status: LoadStatus) {
    setStatuses((previous) => ({
      ...previous,
      [id]: status,
    }));
  }

  async function loadTrack(track: Track) {
    const generation = generationRef.current;

    // Prevent duplicate tasks for the same track
    // within the current generation.
    if (
      inFlightRef.current.get(track.id) === generation ||
      buffersRef.current.has(track.id)
    ) {
      return;
    }

    inFlightRef.current.set(track.id, generation);
    updateStatus(track.id, "loading");
    setErrorMessage("");

    try {
      const { context, queue } = ensureEngine();

      // Request context activation within user action.
      void context.resume().catch((error) => {
        console.warn("AudioContext resume:", error);
      });

      const buffer = await queue.enqueue(track.url);

      // Ignore results from cancelled generations
      // or an unmounted component.
      if (
        !mountedRef.current ||
        generation !== generationRef.current
      ) {
        return;
      }

      buffersRef.current.set(track.id, buffer);
      updateStatus(track.id, "ready");
    } catch (error) {
      if (
        !mountedRef.current ||
        generation !== generationRef.current
      ) {
        return;
      }

      updateStatus(track.id, "error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unknown audio loading error"
      );
    } finally {
      if (
        inFlightRef.current.get(track.id) === generation
      ) {
        inFlightRef.current.delete(track.id);
      }
    }
  }

  async function playTrack(id: string) {
    const buffer = buffersRef.current.get(id);

    const context = contextRef.current;
    const player = playerRef.current;

    if (!buffer || !context || !player) return;

    const playbackToken = ++playbackTokenRef.current;

    try {
      // Called from the Play button interaction.
      await context.resume();

      if (
        !mountedRef.current ||
        playbackToken !== playbackTokenRef.current
      ) {
        return;
      }

      player.play(buffer, () => {
        if (
          mountedRef.current &&
          playbackToken === playbackTokenRef.current
        ) {
          setPlayingId(null);
        }
      });

      setPlayingId(id);
      setErrorMessage("");
    } catch (error) {
      if (!mountedRef.current) return;

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to play audio"
      );
    }
  }

  function stopPlayback() {
    playbackTokenRef.current++;
    playerRef.current?.stop();
    setPlayingId(null);
  }

  function cancelAll() {
    // Invalidate all older asynchronous results.
    generationRef.current++;

    queueRef.current?.cancelAll();
    stopPlayback();

    // Explicitly release decoded buffer references.
    buffersRef.current.clear();
    inFlightRef.current.clear();

    setStatuses({});
    setErrorMessage("");
  }

  function changeBins(nextBins: FrequencyBins) {
    playerRef.current?.setBins(nextBins);
    setBins(nextBins);
  }

  // Cleanup on unmount.
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      generationRef.current++;
      playbackTokenRef.current++;

      queueRef.current?.dispose();
      playerRef.current?.dispose();

      buffersRef.current.clear();
      inFlightRef.current.clear();

      const context = contextRef.current;

      if (context && context.state !== "closed") {
        void context.close().catch(console.error);
      }

      queueRef.current = null;
      playerRef.current = null;
      contextRef.current = null;
    };
  }, []);

  return (
    <main className="app">
      <h1>Concurrent FIFO Audio Visualizer</h1>

      <p>
        Web Audio API, FIFO task queue,
        cancellation and 60fps canvas visualizer.
      </p>

      <section aria-labelledby="queue-title">
        <h2 id="queue-title">Audio Task Queue</h2>

        <div className="actions">
          <button
            type="button"
            onClick={() => {
              TRACKS.forEach((track) => {
                void loadTrack(track);
              });
            }}
          >
            Load All (FIFO)
          </button>

          <button
            type="button"
            onClick={cancelAll}
            className="danger"
          >
            Cancel All
          </button>
        </div>

        <ul className="track-list">
          {TRACKS.map((track) => {
            const status =
              statuses[track.id] ?? "idle";

            return (
              <li key={track.id} className="track">
                <div>
                  <strong>{track.title}</strong>
                  <p>Status: {status}</p>
                </div>

                <div className="actions">
                  <button
                    type="button"
                    disabled={
                      status === "loading" ||
                      status === "ready"
                    }
                    onClick={() => {
                      void loadTrack(track);
                    }}
                  >
                    Load
                  </button>

                  <button
                    type="button"
                    disabled={status !== "ready"}
                    onClick={() => {
                      void playTrack(track.id);
                    }}
                  >
                    Play
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="visualizer-title">
        <h2 id="visualizer-title">
          Audio Frequency Visualizer
        </h2>

        <div className="actions">
          <label htmlFor="fft-bins">
            Frequency bins:
          </label>

          <select
            id="fft-bins"
            value={bins}
            onChange={(event) => {
              changeBins(
                Number(event.target.value) as FrequencyBins
              );
            }}
          >
            <option value={256}>256 bins</option>
            <option value={512}>512 bins</option>
          </select>

          <button
            type="button"
            disabled={playingId === null}
            onClick={stopPlayback}
          >
            Stop
          </button>
        </div>

        <AudioVisualizer
          analyser={analyser}
          isPlaying={playingId !== null}
          bins={bins}
        />

        <p aria-live="polite">
          {playingId
            ? `Playing Track ${playingId.toUpperCase()}`
            : "Audio stopped"}
        </p>
      </section>

      {errorMessage && (
        <p role="alert" className="error">
          Error: {errorMessage}
        </p>
      )}
    </main>
  );
}
