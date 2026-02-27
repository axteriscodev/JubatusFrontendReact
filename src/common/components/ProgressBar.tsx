import { useEffect, useState } from "react";

interface ProgressBarProps {
  duration?: number; // total duration in ms
}

export default function ProgressBar({ duration = 10000 }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [duration]);

  return (
    <div className="mt-20 px-4">
      <div
        className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-bar h-full transition-none"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
