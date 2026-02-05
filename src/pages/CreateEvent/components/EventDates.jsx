/**
 * Componente per la gestione delle date dell'evento - VERSIONE TAILWIND
 */
export function EventDates({ formData, onInputChange }) {
  return (
    <div className="shadow-sm rounded-lg bg-white mb-4">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="bg-green-500/10 rounded-xl p-3 mr-3">
            <i className="bi bi-calendar-event-fill text-green-500 text-2xl"></i>
          </div>
          <div>
            <h5 className="mb-1 font-bold text-lg">Date e Scadenze</h5>
            <p className="text-gray-500 mb-0 text-sm">Gestisci le date importanti dell'evento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Date principali - Titolo sezione */}
          <div className="col-span-12">
            <div className="border-l-4 border-blue-600 pl-3 mb-3">
              <h6 className="text-blue-600 font-semibold mb-0">Date Principali</h6>
            </div>
          </div>

          {/* Data evento */}
          <div className="col-span-12 md:col-span-4">
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <i className="bi bi-calendar-check-fill mr-2"></i>Data evento
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                <i className="bi bi-calendar3 text-blue-600"></i>
              </span>
              <input
                type="date"
                name="dateEvent"
                value={formData.dateEvent}
                onChange={onInputChange}
                placeholder="Data evento"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Data pubblicazione */}
          <div className="col-span-12 md:col-span-4">
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <i className="bi bi-calendar-plus-fill mr-2"></i>Data pubblicazione
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                <i className="bi bi-calendar3 text-green-500"></i>
              </span>
              <input
                type="date"
                name="dateStart"
                value={formData.dateStart}
                onChange={onInputChange}
                placeholder="Data pubblicazione"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Data scadenza */}
          <div className="col-span-12 md:col-span-4">
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <i className="bi bi-calendar-x-fill mr-2"></i>Data scadenza
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                <i className="bi bi-calendar3 text-red-500"></i>
              </span>
              <input
                type="date"
                name="dateExpiry"
                value={formData.dateExpiry}
                onChange={onInputChange}
                placeholder="Data scadenza"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preordini - Titolo sezione */}
          <div className="col-span-12 mt-4">
            <div className="border-l-4 border-yellow-500 pl-3 mb-3">
              <h6 className="text-yellow-600 font-semibold mb-0">Periodo Preordini</h6>
            </div>
          </div>

          {/* Inizio preordini */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <i className="bi bi-hourglass-split mr-2"></i>Inizio preordini
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                <i className="bi bi-calendar3 text-yellow-500"></i>
              </span>
              <input
                type="date"
                name="datePreorderStart"
                value={formData.datePreorderStart}
                onChange={onInputChange}
                placeholder="Data inizio preordini"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Fine preordini */}
          <div className="col-span-12 md:col-span-6">
            <label className="block font-semibold text-gray-600 text-sm mb-2">
              <i className="bi bi-hourglass-bottom mr-2"></i>Fine preordini
            </label>
            <div className="flex shadow-sm">
              <span className="inline-flex items-center px-3 bg-white border-2 border-r-0 border-gray-300 rounded-l-md">
                <i className="bi bi-calendar3 text-yellow-500"></i>
              </span>
              <input
                type="date"
                name="datePreorderExpiry"
                value={formData.datePreorderExpiry}
                onChange={onInputChange}
                placeholder="Data fine preordini"
                className="flex-1 border-2 border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-[0.95rem]
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}