import { useEffect, useState } from "react";

interface ProgressBarProps {
  duration?: number; // total duration in ms
}

export default function ProgressBar({ duration = 10000 }: ProgressBarProps) {
  // Stato per il progresso della barra (da 0 a 100)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Funzione che incrementa il progresso
    const interval = setInterval(
      () => {
        setProgress((prevProgress) => {
          const newValue = prevProgress + 100 / 6;
          if (newValue >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newValue;
        });
      },
      Math.floor(duration / 6),
    );

    // cleanup function
    return () => clearInterval(interval);
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
          className="progress-bar h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
