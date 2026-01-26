import Card from "../../../shared/components/ui/Card";
import { FormLabel } from "../../../shared/components/ui/Form";
import Input from "../../../shared/components/ui/Input";

/**
 * Componente per le informazioni base dell'evento - VERSIONE MIGRATA A TAILWIND
 */
export function EventBasicInfo({
  formData,
  onInputChange,
  onTitleChange,
  tagList,
  currencyList,
  errors = {},
  onClearError = () => {}
}) {
  // Handler per input con pulizia errore
  const handleInputWithClear = (e) => {
    const { name } = e.target;
    if (errors[name]) {
      onClearError(name);
    }
    onInputChange(e);
  };

  // Handler per titolo con pulizia errore
  const handleTitleWithClear = (e) => {
    if (errors.title) {
      onClearError('title');
    }
    onTitleChange(e);
  };

  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body className="p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-lg p-3 mr-4">
            <i className="bi bi-info-circle-fill text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-lg">Informazioni Base</h5>
            <p className="text-gray-500 mb-0 text-sm">Dettagli principali dell'evento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Titolo evento */}
          <div>
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-pencil-fill mr-2"></i>Titolo evento
            </FormLabel>
            <Input
              placeholder="Inserisci il titolo dell'evento"
              value={formData.title}
              onChange={handleTitleWithClear}
              error={!!errors.title}
              className="text-base"
            />
            {errors.title && (
              <p className="text-danger text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-link-45deg mr-2"></i>URL
            </FormLabel>
            <Input
              placeholder="URL generato automaticamente"
              value={formData.slug}
              disabled
              className="bg-gray-100 text-base"
            />
          </div>

          {/* Località */}
          <div>
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-geo-alt-fill mr-2"></i>Località
            </FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={onInputChange}
              placeholder="Es: Milano, Via Roma 123"
              className="text-base"
            />
          </div>

          {/* Path S3 */}
          <div>
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-cloud-arrow-up-fill mr-2"></i>Path S3
            </FormLabel>
            <Input
              name="pathS3"
              value={formData.pathS3}
              onChange={handleInputWithClear}
              placeholder="percorso/cartella/s3"
              error={!!errors.pathS3}
              className="text-base"
            />
            {errors.pathS3 && (
              <p className="text-danger text-sm mt-1">{errors.pathS3}</p>
            )}
          </div>

          {/* Tipologia evento */}
          <div>
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-tag-fill mr-2"></i>Tipologia evento
            </FormLabel>
            <select
              name="tagId"
              value={formData.tagId}
              onChange={handleInputWithClear}
              className={`w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 text-base ${
                errors.tagId ? 'border-danger' : 'border-gray-300'
              }`}
            >
              <option value="">Seleziona una tipologia</option>
              {Array.isArray(tagList) &&
                tagList.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.tag}
                  </option>
                ))}
            </select>
            {errors.tagId && (
              <p className="text-danger text-sm mt-1">{errors.tagId}</p>
            )}
          </div>

          {/* Valuta */}
          <div>
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-currency-exchange mr-2"></i>Valuta
            </FormLabel>
            <select
              name="currencyId"
              value={formData.currencyId}
              onChange={handleInputWithClear}
              className={`w-full px-4 py-2 border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 text-base ${
                errors.currencyId ? 'border-danger' : 'border-gray-300'
              }`}
            >
              <option value="">Seleziona una valuta</option>
              {Array.isArray(currencyList) &&
                currencyList.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.currency}
                  </option>
                ))}
            </select>
            {errors.currencyId && (
              <p className="text-danger text-sm mt-1">{errors.currencyId}</p>
            )}
          </div>

          {/* Emoji attesa */}
          <div className="col-span-full">
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-emoji-smile-fill mr-2"></i>Emoji attesa
            </FormLabel>
            <Input
              name="emoji"
              value={formData.emoji}
              onChange={onInputChange}
              placeholder="🚴 🏃 ⚽"
              className="text-xl"
            />
          </div>

          {/* Descrizione */}
          <div className="col-span-full">
            <FormLabel className="font-semibold text-gray-600 text-sm mb-2 flex items-center">
              <i className="bi bi-text-paragraph mr-2"></i>Descrizione
            </FormLabel>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Inserisci una descrizione dettagliata dell'evento..."
              rows={4}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-event/50 text-base"
            />
          </div>

          {/* Checkbox partecipanti verificati */}
          <div className="col-span-full">
            <Card className="bg-gray-50 border-0">
              <Card.Body className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="verifiedAttendanceEvent"
                    name="verifiedAttendanceEvent"
                    checked={formData.verifiedAttendanceEvent}
                    onChange={(e) => onInputChange({
                      target: {
                        name: 'verifiedAttendanceEvent',
                        value: e.target.checked
                      }
                    })}
                    className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="verifiedAttendanceEvent" className="flex-1 cursor-pointer">
                    <span className="font-semibold text-base block">
                      <i className="bi bi-shield-check mr-2 text-blue-600"></i>
                      Evento con partecipanti verificati
                    </span>
                    <div className="text-gray-600 text-sm mt-1">
                      Abilita la gestione dei partecipanti con caricamento Excel (numero chiuso)
                    </div>
                  </label>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
