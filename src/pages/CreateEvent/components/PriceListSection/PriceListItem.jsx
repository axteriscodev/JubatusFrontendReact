/**
 * Componente per un singolo item (pacchetto) all'interno di un listino - VERSIONE TAILWIND
 */
export function PriceListItem({
  item,
  formIndex,
  rowIndex,
  onUpdate,
  onUpdateWithLanguage,
  onRemove,
  canRemove,
}) {
  return (
    <div className="border-2 border-blue-500/25 rounded-lg bg-white">
      <div className="p-3">
        {/* Header con badge e bottone elimina */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/10 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium">
              Pacchetto #{rowIndex + 1}
            </span>
            {item.bestOffer && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                <i className="bi bi-star-fill mr-1"></i>
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
            <i className="bi bi-trash"></i>
          </button>
        </div>

        {/* Informazioni principali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Titolo */}
          <div>
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-title`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-type mr-2"></i>Titolo
            </label>
            <input
              type="text"
              id={`f${formIndex}-r${rowIndex}-title`}
              value={item.itemsLanguages?.[0]?.title ?? ""}
              onChange={(e) =>
                onUpdateWithLanguage(
                  formIndex,
                  rowIndex,
                  "title",
                  e.target.value,
                )
              }
              placeholder="Es: Pacchetto Basic"
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sottotitolo */}
          <div>
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-subTitle`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-text-left mr-2"></i>Sottotitolo
            </label>
            <input
              type="text"
              id={`f${formIndex}-r${rowIndex}-subTitle`}
              value={item.itemsLanguages?.[0]?.subTitle ?? ""}
              onChange={(e) =>
                onUpdateWithLanguage(
                  formIndex,
                  rowIndex,
                  "subTitle",
                  e.target.value,
                )
              }
              placeholder="Es: Ideale per eventi piccoli"
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Opzioni */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <i className="bi bi-star-fill mr-2"></i>Opzioni
            </label>
            <div className="bg-gray-100 border-0 rounded-md p-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={`f${formIndex}-r${rowIndex}-bestOffer`}
                  checked={item.bestOffer}
                  onChange={(e) =>
                    onUpdate(formIndex, rowIndex, "bestOffer", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-semibold text-sm">Migliore offerta</span>
              </label>
            </div>
          </div>
        </div>

        {/* Divisore */}
        <hr className="my-3 border-gray-200" />

        {/* Quantità e prezzi */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <small className="text-gray-500 font-semibold">
              <i className="bi bi-box mr-2"></i>QUANTITÀ E PREZZI
            </small>
          </div>

          {/* Foto */}
          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-quantityPhoto`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-camera-fill mr-2"></i>Foto
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-quantityPhoto`}
                value={item.quantityPhoto}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "quantityPhoto", e.target.value)
                }
                placeholder="0"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <i className="bi bi-image text-blue-600"></i>
              </span>
            </div>
          </div>

          {/* Clip */}
          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-quantityClip`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-easel-fill mr-2"></i>Clip
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-quantityClip`}
                value={item.quantityClip}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "quantityClip", e.target.value)
                }
                placeholder="0"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <i className="bi bi-easel text-yellow-600"></i>
              </span>
            </div>
          </div>

          {/* Video */}
          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-quantityVideo`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-film mr-2"></i>Video
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-quantityVideo`}
                value={item.quantityVideo}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "quantityVideo", e.target.value)
                }
                placeholder="0"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <i className="bi bi-play-circle text-red-500"></i>
              </span>
            </div>
          </div>

          {/* Prezzo */}
          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-price`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-currency-euro mr-2"></i>Prezzo
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md font-medium">
                €
              </span>
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-price`}
                value={item.price}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "price", e.target.value)
                }
                placeholder="0.00"
                step="0.01"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sconto */}
          <div className="col-span-6 md:col-span-3">
            <label
              htmlFor={`f${formIndex}-r${rowIndex}-discount`}
              className="block font-semibold text-gray-600 text-sm mb-2"
            >
              <i className="bi bi-percent mr-2"></i>Sconto
            </label>
            <div className="flex shadow-sm">
              <input
                type="number"
                id={`f${formIndex}-r${rowIndex}-discount`}
                value={item.discount}
                onChange={(e) =>
                  onUpdate(formIndex, rowIndex, "discount", e.target.value)
                }
                placeholder="0"
                min="0"
                max="100"
                className="flex-1 border-2 border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10"
              />
              <span className="inline-flex items-center px-3 bg-white border-2 border-l-0 border-gray-300 rounded-r-md">
                <i className="bi bi-tag text-green-500"></i>
              </span>
            </div>
          </div>
        </div>

        {/* Riepilogo prezzo finale */}
        {item.price > 0 && (
          <div className="mt-3 p-3 bg-green-500/10 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">
                <i className="bi bi-calculator mr-2"></i>
                Prezzo finale:
              </span>
              <div className="text-right">
                {item.discount > 0 && (
                  <div>
                    <small className="text-gray-500 line-through">
                      €{parseFloat(item.price).toFixed(2)}
                    </small>
                  </div>
                )}
                <span className="text-xl font-bold text-green-600">
                  €
                  {(
                    parseFloat(item.price) *
                    (1 - parseFloat(item.discount || 0) / 100)
                  ).toFixed(2)}
                </span>
                {item.discount > 0 && (
                  <small className="text-green-600 ml-2">
                    (-{item.discount}%)
                  </small>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
