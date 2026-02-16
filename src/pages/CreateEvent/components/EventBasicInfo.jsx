import {
  Info,
  Pencil,
  Link,
  MapPin,
  CloudUpload,
  Tag,
  ArrowRightLeft,
  Smile,
  Text,
  ShieldCheck,
} from "lucide-react";

/**
 * Componente per le informazioni base dell'evento - VERSIONE TAILWIND
 */
export function EventBasicInfo({
  formData,
  onInputChange,
  onTitleChange,
  tagList,
  currencyList,
}) {
  return (
    <div className="shadow-sm rounded-lg bg-white mb-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="bg-cyan-500/10 rounded-xl p-3 mr-3">
            <Info size={24} className="text-blue-600" />
          </div>
          <div>
            <h5 className="mb-1 font-bold text-lg">Informazioni Base</h5>
            <p className="text-gray-500 mb-0 text-sm">
              Dettagli principali dell'evento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Titolo evento */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <Pencil size={14} className="inline mr-2" />
              Titolo evento
            </label>
            <input
              type="text"
              placeholder="Inserisci il titolo dell'evento"
              value={formData.title}
              onChange={onTitleChange}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <Link size={14} className="inline mr-2" />
              URL
            </label>
            <input
              type="text"
              placeholder="URL generato automaticamente"
              value={formData.slug}
              disabled
              readOnly
              className="w-full bg-gray-100 border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Località */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <MapPin size={14} className="inline mr-2" />
              Località
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              placeholder="Es: Milano, Via Roma 123"
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Path S3 */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <CloudUpload size={14} className="inline mr-2" />
              Path S3
            </label>
            <input
              type="text"
              name="pathS3"
              value={formData.pathS3}
              onChange={onInputChange}
              placeholder="percorso/cartella/s3"
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tipologia evento */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <Tag size={14} className="inline mr-2" />
              Tipologia evento
            </label>
            <select
              name="tagId"
              value={formData.tagId}
              onChange={onInputChange}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white"
            >
              <option value="">Seleziona una tipologia</option>
              {Array.isArray(tagList) &&
                tagList.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tag}
                  </option>
                ))}
            </select>
          </div>

          {/* Valuta */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <ArrowRightLeft size={14} className="inline mr-2" />
              Valuta
            </label>
            <select
              name="currencyId"
              value={formData.currencyId}
              onChange={onInputChange}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         bg-white"
            >
              <option value="">Seleziona una valuta</option>
              {Array.isArray(currencyList) &&
                currencyList.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.currency}
                  </option>
                ))}
            </select>
          </div>

          {/* Emoji attesa */}
          <div>
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <Smile size={14} className="inline mr-2" />
              Emoji attesa
            </label>
            <input
              type="text"
              name="emoji"
              value={formData.emoji}
              onChange={onInputChange}
              placeholder="🚴 🏃 ⚽"
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Descrizione - full width */}
          <div className="lg:col-span-2">
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <Text size={14} className="inline mr-2" />
              Descrizione
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Inserisci una descrizione dettagliata dell'evento..."
              rows={4}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 text-[0.95rem]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         resize-vertical"
            />
          </div>

          {/* Checkbox partecipanti verificati - full width */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-lg p-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="verifiedAttendanceEvent"
                  name="verifiedAttendanceEvent"
                  checked={formData.verifiedAttendanceEvent}
                  onChange={(e) =>
                    onInputChange({
                      target: {
                        name: "verifiedAttendanceEvent",
                        value: e.target.checked,
                      },
                    })
                  }
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-blue-500 shrink-0"
                />
                <div>
                  <span className="font-semibold">
                    <ShieldCheck
                      size={16}
                      className="inline mr-2 text-blue-600"
                    />
                    Evento con partecipanti verificati
                  </span>
                  <div className="text-gray-500 text-sm mt-1">
                    Abilita la gestione dei partecipanti con caricamento Excel
                    (numero chiuso)
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
