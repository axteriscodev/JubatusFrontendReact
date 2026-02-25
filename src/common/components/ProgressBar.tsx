import { useEffect, useState } from "react";

export default function ProgressBar() {
  // Stato per il progresso della barra (da 0 a 100)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Funzione che incrementa il progresso
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 99) {
          clearInterval(interval);
          return 99;
        }
        const newValue = prevProgress + 100 / 6;

        return newValue < 99 ? newValue : 99;
      });
    }, 1000);

    // cleanup function
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className="progress mt-20"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
    </>
  );
}
