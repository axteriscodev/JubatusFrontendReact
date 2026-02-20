import { useEffect, useState } from "react";
import Modal from "@common/components/ui/Modal";
import Form from "@common/components/ui/Form";
import { apiRequest } from "@common/services/api-services";

interface LocationFormState {
  displayName: string;
  line1: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}

const EMPTY_FORM: LocationFormState = {
  displayName: "",
  line1: "",
  city: "",
  country: "IT",
  postalCode: "",
  state: "",
};

export interface LocationFormModalProps {
  show: boolean;
  onHide: () => void;
  onSaved?: () => void;
}

export default function LocationFormModal({ show, onHide, onSaved }: LocationFormModalProps) {
  const [form, setForm] = useState<LocationFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) setForm(EMPTY_FORM);
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/locations",
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          displayName: form.displayName,
          address: {
            line1: form.line1,
            city: form.city,
            country: form.country,
            postalCode: form.postalCode,
            state: form.state || null,
          },
        }),
      });
      if (response.ok) {
        onSaved?.();
        onHide();
      }
    } catch {
      console.error("Errore nel salvataggio della location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header onHide={onHide}>
        <Modal.Title>Aggiungi Location</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSave}>
        <Modal.Body>
          <Form.Group className="mb-4">
            <Form.Label>Nome visualizzato</Form.Label>
            <Form.Control
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Es. Sede Milano"
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Indirizzo</Form.Label>
            <Form.Control
              name="line1"
              value={form.line1}
              onChange={handleChange}
              placeholder="Es. Via Roma 10"
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Città</Form.Label>
            <Form.Control
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Es. Milano"
              required
            />
          </Form.Group>
          <div className="flex gap-3">
            <Form.Group className="flex-1 mb-4">
              <Form.Label>CAP</Form.Label>
              <Form.Control
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Es. 20100"
                required
              />
            </Form.Group>
            <Form.Group className="flex-1 mb-4">
              <Form.Label>Paese</Form.Label>
              <Form.Control
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Es. IT"
                maxLength={2}
                required
              />
            </Form.Group>
          </div>
          <Form.Group>
            <Form.Label>
              Provincia / Stato{" "}
              <span className="text-gray-400 font-normal">(opzionale)</span>
            </Form.Label>
            <Form.Control
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Es. MI"
            />
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
    </Modal>
  );
}
