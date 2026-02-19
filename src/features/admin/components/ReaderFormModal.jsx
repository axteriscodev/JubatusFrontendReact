import { useEffect, useState } from "react";
import Button from "@common/components/ui/Button";
import Modal from "@common/components/ui/Modal";
import Form from "@common/components/ui/Form";
import LoadingState from "@common/components/ui/LoadingState";
import { apiRequest } from "@common/services/api-services";

const EMPTY_FORM = { label: "", registrationCode: "", locationId: "" };

/**
 * Modal per la registrazione di un Reader POS Stripe Terminal.
 * Gestisce internamente stato del form, fetch delle location e chiamata API.
 *
 * @param {Object} props
 * @param {boolean} props.show - Visibilità del modal
 * @param {Function} props.onHide - Callback per chiudere il modal
 * @param {Function} [props.onSaved] - Callback chiamata dopo salvataggio riuscito
 */
export default function ReaderFormModal({ show, onHide, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    setForm(EMPTY_FORM);
    setLoadingLocations(true);
    apiRequest({
      api: import.meta.env.VITE_API_URL + "/terminal/locations",
      method: "GET",
      needAuth: true,
    })
      .then((res) => res.ok && res.json())
      .then((data) => data && setLocations(data.data.locations))
      .catch(() => console.error("Errore nel caricamento delle location"))
      .finally(() => setLoadingLocations(false));
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/readers",
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          locationId: Number(form.locationId),
          label: form.label,
          registrationCode: form.registrationCode,
        }),
      });
      if (response.ok) {
        onSaved?.();
        onHide();
      }
    } catch {
      console.error("Errore nel salvataggio del reader");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header onHide={onHide}>
        <Modal.Title>Aggiungi Reader</Modal.Title>
      </Modal.Header>
      {loadingLocations ? (
        <Modal.Body>
          <LoadingState message="Caricamento location..." />
        </Modal.Body>
      ) : (
        <form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label>Label</Form.Label>
              <Form.Control
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Es. Cassa 1"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Codice di registrazione</Form.Label>
              <Form.Control
                name="registrationCode"
                value={form.registrationCode}
                onChange={handleChange}
                placeholder="Es. present-rattle-solve"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Select
                name="locationId"
                value={form.locationId}
                onChange={handleChange}
                required
              >
                <option value="">Seleziona una location...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.displayName} — {loc.city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={onHide}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-green-600 border border-green-500 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Salvataggio..." : "Salva"}
            </button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  );
}
