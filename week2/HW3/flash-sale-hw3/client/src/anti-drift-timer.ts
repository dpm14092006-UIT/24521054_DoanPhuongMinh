export function createAntiDriftTimer(
  durationMs: number,
  onTick: (remaining: number) => void
): () => void {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    throw new RangeError("Invalid durationMs");
  }

  const targetTime = Date.now() + durationMs;

  let rafId: number | null = null;
  let stopped = false;

  function tick() {
    if (stopped) return;

    // Calculate from the real target timestamp.
    const remaining = Math.max(
      0,
      targetTime - Date.now()
    );

    onTick(remaining);

    if (remaining > 0) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      tick();
    }
  }

  // Show the first value immediately.
  tick();

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  // Cleanup function.
  return () => {
    stopped = true;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
}
