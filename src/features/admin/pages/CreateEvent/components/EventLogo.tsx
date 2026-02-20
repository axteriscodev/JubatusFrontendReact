import Logo from '@common/components/Logo';
import { FormLabel } from '@common/components/ui/Form';
import type { EventFormData } from '../utils/eventFormHelpers';
import type { Competition } from '@/types/competition';

export interface EventLogoProps {
  formData: EventFormData;
  receivedComp: Competition | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EventLogo({ formData, receivedComp, onFileChange }: EventLogoProps) {
  const getLogoSrc = (): string => {
    if (formData.logo && formData.logo instanceof File) {
      return URL.createObjectURL(formData.logo);
    }
    if (receivedComp?.logo) {
      return `${import.meta.env.VITE_API_URL}/${receivedComp.logo}`;
    }
    return '/public/images/noimage.jpg';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="my-4">
        <Logo src={getLogoSrc()} css="mb-10" />
      </div>

      <div>
        <div className="mb-4">
          <FormLabel htmlFor="formFile">Logo</FormLabel>
          <input
            id="formFile"
            onChange={onFileChange}
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );
}
