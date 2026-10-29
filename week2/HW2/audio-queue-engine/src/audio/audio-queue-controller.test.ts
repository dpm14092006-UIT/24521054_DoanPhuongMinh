import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { AudioTaskQueue } from "./audio-queue-controller";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AudioTaskQueue", () => {
  it("processes tasks in strict FIFO order", async () => {
    const events: string[] = [];

    const mockFetch = vi.fn(async (url: string) => {
      events.push(`fetch:${url}`);

      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => {
          events.push(`body:${url}`);

          return new Uint8Array([
            url.charCodeAt(0),
          ]).buffer;
        },
      } as Response;
    });

    vi.stubGlobal("fetch", mockFetch);

    const mockContext = {
      decodeAudioData: async (bytes: ArrayBuffer) => {
        const label = String.fromCharCode(
          new Uint8Array(bytes)[0]
        );

        events.push(`decode:${label}`);

        return { duration: 1 } as AudioBuffer;
      },
    } as unknown as AudioContext;

    const queue = new AudioTaskQueue(mockContext);

    const results = await Promise.all([
      queue.enqueue("A"),
      queue.enqueue("B"),
      queue.enqueue("C"),
    ]);

    expect(results).toHaveLength(3);

    expect(events).toEqual([
      "fetch:A",
      "body:A",
      "decode:A",

      "fetch:B",
      "body:B",
      "decode:B",

      "fetch:C",
      "body:C",
      "decode:C",
    ]);

    queue.dispose();
  });

  it("cancels active and pending tasks", async () => {
    const mockFetch = vi.fn(
      (_url: string, options: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options.signal?.addEventListener(
            "abort",
            () => {
              reject(
                new DOMException(
                  "Cancelled",
                  "AbortError"
                )
              );
            },
            { once: true }
          );
        })
    );

    vi.stubGlobal("fetch", mockFetch);

    const mockContext = {
      decodeAudioData: vi.fn(),
    } as unknown as AudioContext;

    const queue = new AudioTaskQueue(mockContext);

    const first = queue.enqueue("A");
    const second = queue.enqueue("B");

    const settledPromise = Promise.allSettled([
      first,
      second,
    ]);

    queue.cancelAll();

    const results = await settledPromise;

    expect(results.map((result) => result.status))
      .toEqual(["rejected", "rejected"]);

    // B never started because A was still active.
    expect(mockFetch).toHaveBeenCalledTimes(1);

    queue.dispose();
  });
});
