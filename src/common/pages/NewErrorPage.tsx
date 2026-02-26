export default function NewErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-linear-to-br from-slate-50 via-gray-100 to-stone-200">
      <div
        role="alert"
        aria-labelledby="error-title"
        aria-describedby="error-desc"
        className="bg-white/5 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2.6px] border border-white/30 flex flex-col lg:flex-row items-center gap-4 py-6 px-6 max-w-6xl w-full"
      >
        {/* Immagine */}
        <div className="w-1/2 mx-auto rounded-lg overflow-hidden" aria-hidden="true">
          <img
            src="/nuvoletta_trasparente.png"
            alt=""
            className="w-full h-auto"
          />
        </div>

        {/* Testo */}
        <div className="w-full lg:w-auto flex flex-col gap-2 items-center lg:items-start text-center lg:text-left">
          <h1 id="error-title" className="text-xl md:text-2xl font-bold text-slate-900! whitespace-nowrap">
            OPS qualcosa è andato storto!
          </h1>
          <p id="error-desc" className="md:text-lg text-slate-700!">
            Ma sei nel posto giusto per ripartire:
          </p>
          <p className="md:text-lg text-slate-700!">
            contattaci al{" "}
            <a
              href="mailto:info@jubatus.it"
              aria-label="Invia una email a info@jubatus.it"
              className="relative font-bold text-orange-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-800 after:transition-all after:duration-300 hover:after:w-full"
            >
              info@jubatus.it
            </a>{" "}
            oppure torna alla{" "}
            <a
              href="/mymemories.it"
              aria-label="Torna alla homepage"
              className="relative font-bold text-orange-800 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-800 after:transition-all after:duration-300 hover:after:w-full"
            >
              homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
