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
    <div className="mt-20 px-4">
      {/* Contenitore: Tailwind dà l'altezza (h-4) e lo sfondo grigio.
          Senza h-4 o bg-gray-200, il contenitore è invisibile.
      */}
      <div
        className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Barra: Manteniamo 'progress-bar' per il tuo colore CSS.
            Aggiungiamo 'h-full' per riempire l'altezza del genitore.
        */}
        <div
          className="progress-bar h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
