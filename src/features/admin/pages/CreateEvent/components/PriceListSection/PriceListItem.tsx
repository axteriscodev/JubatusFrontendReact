import { useState } from 'react';
import {
  Star,
  Trash2,
  Tag,
  ChevronUp,
  ChevronDown,
  Languages,
  TriangleAlert,
  Info,
  Box,
  Camera,
  Image,
  Presentation,
  Film,
  CirclePlay,
  Euro,
  Percent,
  Calculator,
} from 'lucide-react';
import Collapse from '@common/components/ui/Collapse';
import type { PriceItem } from '@/types/cart';
import type { ListItemLabel } from '../../hooks/useListItemLabels';

interface LabelLanguage {
  title: string;
  subtitle?: string;
}

interface LabelWithTranslations extends ListItemLabel {
  labelsLanguages?: LabelLanguage[];
}

interface PriceItemWithLegacy extends PriceItem {
  itemsLanguages?: Array<{ title?: string; subTitle?: string }>;
}

// Accetta anche string perché i valori arrivano da input HTML (e.target.value)
type PriceItemInputValue = PriceItem[keyof PriceItem] | string;

export interface PriceListItemProps {
  item: PriceItemWithLegacy;
  formIndex: number;
  rowIndex: number;
  onUpdate: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItemInputValue) => void;
  onUpdateWithLanguage: (formIndex: number, rowIndex: number, field: keyof PriceItem, value: PriceItemInputValue) => void;
  onRemove: (formIndex: number, rowIndex: number) => void;
  canRemove: boolean;
  currencySymbol?: string;
  labelList?: LabelWithTranslations[];
}

export function PriceListItem({
  item,
  formIndex,
  rowIndex,
  onUpdate,
  onUpdateWithLanguage,
  onRemove,
  canRemove,
  currencySymbol = '€',
  labelList = [],
}: PriceListItemProps) {
  const [showTranslations, setShowTranslations] = useState(false);

  const selectedLabel = labelList.find((label) => label.id === item.labelId) as LabelWithTranslations | undefined;

  const hasLegacyTexts =
    !item.labelId &&
    (item.itemsLanguages?.[0]?.title || item.itemsLanguages?.[0]?.subTitle);

  return (
    <div className="border-2 border-blue-500/25 rounded-lg bg-white">
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium">
              Pacchetto #{rowIndex + 1}
            </span>
            {item.bestOffer && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                <Star size={12} className="inline mr-1" />
                Migliore Offerta
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(formIndex, rowIndex)}
            disabled={!canRemove}
            className="p-1.5 border border-red-500 text-red-500 rounded-md shadow-sm
                       hover:bg-red-500 hover:text-white transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
          <div>
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-labelId`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <Tag size={14} className="inline mr-2" />
              Label Pacchetto
            </label>
            <select
              id={`f${formIndex}-r${rowIndex}-labelId`}
              value={item.labelId ?? ''}
              onChange={(e) =>
                onUpdate(
                  formIndex,
                  rowIndex,
                  'labelId',
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem] bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleziona una label...</option>
              {labelList.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.label}
                </option>
              ))}
            </select>

            {selectedLabel && selectedLabel.labelsLanguages && selectedLabel.labelsLanguages.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors"
                >
                  {showTranslations ? (
                    <ChevronUp size={14} className="inline mr-1" />
                  ) : (
                    <ChevronDown size={14} className="inline mr-1" />
                  )}
                  <Languages size={14} className="inline mr-1" />
                  Mostra testi ({selectedLabel.labelsLanguages.length} lingue)
                </button>
                <Collapse in={showTranslations}>
                  <div className="mt-2 p-2 bg-gray-100 rounded-lg border flex flex-col gap-2">
                    {selectedLabel.labelsLanguages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="bg-white border rounded px-2 py-1"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <span className="font-semibold text-blue-600">{lang.title}</span>
                        {lang.subtitle && (
                          <span className="text-gray-500"> - {lang.subtitle}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            )}

            {hasLegacyTexts && (
              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                <small className="text-yellow-600 font-semibold block mb-2">
                  <TriangleAlert size={14} className="inline mr-1" />
                  Testi esistenti (modalità legacy)
                </small>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor={`f${formIndex}-r${rowIndex}-title`}
                      className="block font-semibold text-gray-600 text-xs mb-1"
                    >
                      Titolo
                    </label>
                    <input
                      type="text"
                      id={`f${formIndex}-r${rowIndex}-title`}
                      value={item.itemsLanguages?.[0]?.title ?? ''}
                      onChange={(e) =>
                        onUpdateWithLanguage(formIndex, rowIndex, 'price', e.target.value)
                      }
                      placeholder="Titolo pacchetto"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`f${formIndex}-r${rowIndex}-subTitle`}
                      className="block font-semibold text-gray-600 text-xs mb-1"
                    >
                      Sottotitolo
                    </label>
                    <input
                      type="text"
                      id={`f${formIndex}-r${rowIndex}-subTitle`}
                      value={item.itemsLanguages?.[0]?.subTitle ?? ''}
                      onChange={(e) =>
                        onUpdateWithLanguage(formIndex, rowIndex, 'price', e.target.value)
                      }
                      placeholder="Sottotitolo pacchetto"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <small className="text-gray-500 block mt-2">
                  <Info size={14} className="inline mr-1" />
                  Seleziona una label sopra per passare al nuovo sistema
                </small>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <Star size={14} className="inline mr-2" />
              Opzioni
            </label>
            <div className="bg-gray-100 border-0 rounded-md p-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={`f${formIndex}-r${rowIndex}-bestOffer`}
                  checked={item.bestOffer}
                  onChange={(e) => onUpdate(formIndex, rowIndex, 'bestOffer', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-semibold text-sm">Migliore offerta</span>
              </label>
            </div>
          </div>
        </div>

        <hr className="my-3 border-gray-200" />

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <small className="text-gray-500 font-semibold">
              <Box size={14} className="inline mr-2" />
              QUANTITÀ E PREZZI
            </small>
          </div>

          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-quantityPhoto`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <Camera size={14} className="inline mr-2" />
              Foto
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-quantityPhoto`}
                value={item.quantityPhoto}
                onChange={(e) => onUpdate(formIndex, rowIndex, 'quantityPhoto', e.target.value)}
                placeholder="0"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <Image size={16} className="text-blue-600" />
              </span>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-quantityClip`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <Presentation size={14} className="inline mr-2" />
              Clip
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-quantityClip`}
                value={item.quantityClip}
                onChange={(e) => onUpdate(formIndex, rowIndex, 'quantityClip', e.target.value)}
                placeholder="0"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <Presentation size={16} className="text-yellow-600" />
              </span>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-quantityVideo`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <Film size={14} className="inline mr-2" />
              Video
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-quantityVideo`}
                value={item.quantityVideo}
                onChange={(e) => onUpdate(formIndex, rowIndex, 'quantityVideo', e.target.value)}
                placeholder="0"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <CirclePlay size={16} className="text-red-500" />
              </span>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-price`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <Euro size={14} className="inline mr-2" />
              Prezzo
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md font-medium">
                {currencySymbol}
              </span>
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-price`}
                value={item.price}
                onChange={(e) => onUpdate(formIndex, rowIndex, 'price', e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-discount`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <Percent size={14} className="inline mr-2" />
              Sconto
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-discount`}
                value={item.discount}
                onChange={(e) => onUpdate(formIndex, rowIndex, 'discount', e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <Tag size={16} className="text-green-500" />
              </span>
            </div>
          </div>
        </div>

        {Number(item.price) > 0 && (
          <div className="mt-3 p-3 bg-green-500/10 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">
                <Calculator size={14} className="inline mr-2" />
                Prezzo finale:
              </span>
              <div className="text-right">
                {Number(item.discount) > 0 && (
                  <div>
                    <small className="text-gray-500 line-through">
                      {currencySymbol}
                      {parseFloat(String(item.price)).toFixed(2)}
                    </small>
                  </div>
                )}
                <span className="text-xl font-bold text-green-600">
                  {currencySymbol}
                  {(
                    parseFloat(String(item.price)) *
                    (1 - parseFloat(String(item.discount || 0)) / 100)
                  ).toFixed(2)}
                </span>
                {Number(item.discount) > 0 && (
                  <small className="text-green-600 ml-2">(-{item.discount}%)</small>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
