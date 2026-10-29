import { useEffect, useRef } from "react";

import type { FrequencyBins } from "../audio/audio-player";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  bins: FrequencyBins;
}

export function AudioVisualizer({
  analyser,
  isPlaying,
  bins,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationId: number | null = null;
    let lastFrameTime = 0;

    const height = 220;

    // Allocate the typed array once per effect.
    const frequencyData = analyser
      ? new Uint8Array(analyser.frequencyBinCount)
      : null;

    function resize() {
      if (!canvas || !context) return;

      const width = canvas.clientWidth || 640;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(timestamp: number) {
      if (
        !canvas ||
        !context ||
        !analyser ||
        !frequencyData
      ) {
        return;
      }

      animationId = requestAnimationFrame(draw);

      // Cap drawing to approximately 60 fps.
      if (timestamp - lastFrameTime < 1000 / 60) {
        return;
      }

      lastFrameTime = timestamp;

      analyser.getByteFrequencyData(frequencyData);

      const width = canvas.clientWidth;

      context.clearRect(0, 0, width, height);

      context.fillStyle = "#0f172a";
      context.fillRect(0, 0, width, height);

      const barCount = 64;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        const start = Math.floor(
          (i * frequencyData.length) / barCount
        );

        const end = Math.floor(
          ((i + 1) * frequencyData.length) / barCount
        );

        let sum = 0;

        for (let j = start; j < end; j++) {
          sum += frequencyData[j];
        }

        const average = sum / Math.max(1, end - start);

        const barHeight =
          (average / 255) * (height - 18);

        const x = i * barWidth;
        const y = height - barHeight;

        context.fillStyle = "#38bdf8";

        context.fillRect(
          x,
          y,
          Math.max(1, barWidth - 3),
          barHeight
        );
      }
    }

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);
    resize();

    if (analyser && isPlaying) {
      animationId = requestAnimationFrame(draw);
    } else {
      context.fillStyle = "#0f172a";
      context.fillRect(
        0,
        0,
        canvas.clientWidth,
        height
      );
    }

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      resizeObserver.disconnect();
    };
  }, [analyser, isPlaying, bins]);

  return (
    <canvas
      ref={canvasRef}
      className="audio-canvas"
      role="img"
      aria-label={
        isPlaying
          ? "Biểu đồ tần số âm thanh đang phát"
          : "Biểu đồ tần số âm thanh chưa phát"
      }
    />
  );
}
