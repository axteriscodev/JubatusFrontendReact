import { Palette, PaintBucket, Star, Droplet, Eye } from 'lucide-react';
import type { EventFormData } from '../utils/eventFormHelpers';

export interface EventColorsProps {
  formData: EventFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EventColors({ formData, onInputChange }: EventColorsProps) {
  return (
    <div className="shadow-sm rounded-lg bg-white mb-4">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="bg-red-500/10 rounded-xl p-3 mr-3">
            <Palette size={24} className="text-red-500" />
          </div>
          <div>
            <h5 className="mb-1 font-bold text-lg">Colori & Branding</h5>
            <p className="text-gray-500 mb-0 text-sm">Personalizza la palette cromatica dell'evento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="border-2 rounded-lg h-full transition-all duration-300"
            style={{ borderColor: formData.backgroundColor }}
          >
            <div className="text-center p-4">
              <div
                className="rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: formData.backgroundColor,
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <PaintBucket size={30} className="text-white" />
              </div>
              <label htmlFor="backgroundColor" className="font-bold text-gray-600 mb-2 block">
                Colore Background
              </label>
              <input
                type="color"
                id="backgroundColor"
                title="Scegli il colore di sfondo"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={onInputChange}
                className="w-full h-12 mx-auto shadow-sm cursor-pointer rounded-md"
                style={{ border: '3px solid #e5e7eb' }}
              />
              <small className="text-gray-500 mt-2 block font-mono">{formData.backgroundColor}</small>
            </div>
          </div>

          <div
            className="border-2 rounded-lg h-full transition-all duration-300"
            style={{ borderColor: formData.primaryColor }}
          >
            <div className="text-center p-4">
              <div
                className="rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: formData.primaryColor,
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <Star size={30} className="text-white" />
              </div>
              <label htmlFor="primaryColor" className="font-bold text-gray-600 mb-2 block">
                Colore Primario
              </label>
              <input
                type="color"
                id="primaryColor"
                title="Scegli il colore primario"
                name="primaryColor"
                value={formData.primaryColor}
                onChange={onInputChange}
                className="w-full h-12 mx-auto shadow-sm cursor-pointer rounded-md"
                style={{ border: '3px solid #e5e7eb' }}
              />
              <small className="text-gray-500 mt-2 block font-mono">{formData.primaryColor}</small>
            </div>
          </div>

          <div
            className="border-2 rounded-lg h-full transition-all duration-300"
            style={{ borderColor: formData.secondaryColor }}
          >
            <div className="text-center p-4">
              <div
                className="rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: formData.secondaryColor,
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <Droplet size={30} className="text-white" />
              </div>
              <label htmlFor="secondaryColor" className="font-bold text-gray-600 mb-2 block">
                Colore Secondario
              </label>
              <input
                type="color"
                id="secondaryColor"
                title="Scegli il colore secondario"
                name="secondaryColor"
                value={formData.secondaryColor}
                onChange={onInputChange}
                className="w-full h-12 mx-auto shadow-sm cursor-pointer rounded-md"
                style={{ border: '3px solid #e5e7eb' }}
              />
              <small className="text-gray-500 mt-2 block font-mono">{formData.secondaryColor}</small>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg mt-4">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-semibold">
                <Eye size={14} className="inline mr-2" />
                Anteprima Palette
              </span>
              <div className="flex gap-2">
                <div className="rounded-md shadow-sm w-10 h-10" style={{ backgroundColor: formData.backgroundColor }} title="Background" />
                <div className="rounded-md shadow-sm w-10 h-10" style={{ backgroundColor: formData.primaryColor }} title="Primario" />
                <div className="rounded-md shadow-sm w-10 h-10" style={{ backgroundColor: formData.secondaryColor }} title="Secondario" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
