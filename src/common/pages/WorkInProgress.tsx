import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const WorkInProgress = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-linear-to-br from-slate-50 via-gray-200 to-stone-200">
      <div
        className="relative overflow-hidden flex flex-col items-center px-6 py-10 md:px-20 md:py-24 max-w-2xl w-full rounded-[20px] bg-white/15 backdrop-blur-[20px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_20px_10px_rgba(255,255,255,1)]
        before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-white/80 before:to-transparent
        after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-linear-to-b after:from-white/80 after:via-transparent after:to-white/30"
      >
        <WrenchScrewdriverIcon
          aria-hidden="true"
          className="size-12 md:size-24 text-slate-900 mb-4 md:mb-6"
        />
        <span className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 text-center text-slate-900">
          Work in Progress
        </span>
        <p className="text-sm md:text-xl text-center text-slate-800">
          We're making a few improvements. We'll be back soon!
        </p>
      </div>
    </div>
  );
};

export default WorkInProgress;
