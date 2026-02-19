import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid'

const WorkInProgress = () => {
  return (
    <div className='text-center mt-10 items-center flex flex-col gap-4'>
      <WrenchScrewdriverIcon aria-hidden="true" className="size-20 text-gray-500" />
      <h1>Work in Progress</h1>
      <p>We’re making a few improvements. We’ll be back soon!</p>
    </div>
  );
};

export default WorkInProgress;
