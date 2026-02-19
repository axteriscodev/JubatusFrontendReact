import { Plus } from "lucide-react";
import Button from "@common/components/ui/Button";
import Table from "@common/components/ui/Table";
import Modal from "@common/components/ui/Modal";
import Form from "@common/components/ui/Form";
import { useEffect, useState } from "react";
import { apiRequest } from "@common/services/api-services";

const EMPTY_FORM = {
  displayName: "",
  line1: "",
  city: "",
  country: "IT",
  postalCode: "",
  state: "",
};

/**
 * Pagina di gestione delle Location Stripe Terminal
 *
 * @returns {React.ReactElement} admin locations panel
 */
export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/locations",
        method: "GET",
        needAuth: true,
      });
      if (response.ok) {
        const data = await response.json();
        setLocations(data.data.locations);
      }
    } catch {
      console.error("Errore nel caricamento delle location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenModal = () => {
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
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
        await fetchLocations();
        handleCloseModal();
      }
    } catch {
      console.error("Errore nel salvataggio della location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container text-left">
      <div className="mb-10 flex items-center justify-between">
        <h1>Elenco Location</h1>
      </div>
      <Table className="table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Paese</th>
            <th>Reader</th>
            <th className="flex justify-end">
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-100 border border-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Plus size={14} /> nuova location
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            locations.map((loc) => (
              <tr key={loc.id}>
                <td>{loc.id}</td>
                <td>{loc.displayName}</td>
                <td>{loc.addressLine1}</td>
                <td>{loc.city}</td>
                <td>{loc.country}</td>
                <td>{loc.readers?.length ?? 0}</td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header onHide={handleCloseModal}>
          <Modal.Title>Aggiungi Location</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label>Nome visualizzato</Form.Label>
              <Form.Control
                name="displayName"
                value={form.displayName}
                onChange={handleFormChange}
                placeholder="Es. Sede Milano"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control
                name="line1"
                value={form.line1}
                onChange={handleFormChange}
                placeholder="Es. Via Roma 10"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Città</Form.Label>
              <Form.Control
                name="city"
                value={form.city}
                onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  placeholder="Es. 20100"
                  required
                />
              </Form.Group>
              <Form.Group className="flex-1 mb-4">
                <Form.Label>Paese</Form.Label>
                <Form.Control
                  name="country"
                  value={form.country}
                  onChange={handleFormChange}
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
                onChange={handleFormChange}
                placeholder="Es. MI"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={handleCloseModal}>
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Salvataggio..." : "Salva"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
