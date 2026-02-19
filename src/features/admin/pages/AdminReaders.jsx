import { Settings, Plus } from "lucide-react";
import Button from "@common/components/ui/Button";
import ButtonGroup from "@common/components/ui/ButtonGroup";
import Table from "@common/components/ui/Table";
import Modal from "@common/components/ui/Modal";
import Form from "@common/components/ui/Form";
import LoadingState from "@common/components/ui/LoadingState";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { ROUTES } from "@/routes";
import { fetchReaders } from "@features/admin/store/admin-readers-actions";
import { apiRequest } from "@common/services/api-services";

/**
 * Pagina di gestione dei Reader POS Stripe
 *
 * @returns {React.ReactElement} admin readers panel
 */
export default function AdminReaders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const readers = useSelector((state) => state.adminReaders.readers);

  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: "", registrationCode: "", locationId: "" });

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationForm, setLocationForm] = useState({
    displayName: "",
    line1: "",
    city: "",
    country: "IT",
    postalCode: "",
    state: "",
  });

  useEffect(() => {
    document.body.classList.add("admin");
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  useEffect(() => {
    dispatch(fetchReaders());
  }, []);

  const handleOpenModal = async () => {
    setForm({ label: "", registrationCode: "", locationId: "" });
    setShowModal(true);
    setLoadingLocations(true);
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
      setLoadingLocations(false);
    }
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
        dispatch(fetchReaders());
        handleCloseModal();
      }
    } catch {
      console.error("Errore nel salvataggio del reader");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLocationModal = () => {
    setLocationForm({ displayName: "", line1: "", city: "", country: "IT", postalCode: "", state: "" });
    setShowLocationModal(true);
  };

  const handleCloseLocationModal = () => {
    setShowLocationModal(false);
  };

  const handleLocationFormChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveLocation = async (e) => {
    e.preventDefault();
    setSavingLocation(true);
    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/locations",
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          displayName: locationForm.displayName,
          address: {
            line1: locationForm.line1,
            city: locationForm.city,
            country: locationForm.country,
            postalCode: locationForm.postalCode,
            state: locationForm.state || null,
          },
        }),
      });
      if (response.ok) {
        handleCloseLocationModal();
      }
    } catch {
      console.error("Errore nel salvataggio della location");
    } finally {
      setSavingLocation(false);
    }
  };

  const handleConfigureReader = (reader) => {
    navigate(ROUTES.ADMIN_READER(reader.id));
  };

  return (
    <div className="container text-left">
      <div className="my-10 flex items-center justify-between">
        <h1>Elenco Reader POS</h1>
        <button
          type="button"
          onClick={handleOpenLocationModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus size={14} /> nuova location
        </button>
      </div>
      <Table className="table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Label</th>
            <th>Stripe ID</th>
            <th>Evento</th>
            <th className="flex justify-end">
              <button
                type="button"
                onClick={handleOpenModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-100 border border-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Plus size={14} /> nuovo reader
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {readers.map((reader) => (
            <tr key={reader.id}>
              <td>{reader.id}</td>
              <td>{reader.label}</td>
              <td>{reader.stripeReaderId}</td>
              <td>
                {reader.events.length > 0 ? reader.events[0].slug : "-"}
              </td>
              <td className="text-right">
                <ButtonGroup>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleConfigureReader(reader)}
                  >
                    <Settings size={16} />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header onHide={handleCloseModal}>
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
                  onChange={handleFormChange}
                  placeholder="Es. Cassa 1"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Codice di registrazione</Form.Label>
                <Form.Control
                  name="registrationCode"
                  value={form.registrationCode}
                  onChange={handleFormChange}
                  placeholder="Es. present-rattle-solve"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Select
                  name="locationId"
                  value={form.locationId}
                  onChange={handleFormChange}
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
              <Button variant="secondary" type="button" onClick={handleCloseModal}>
                Annulla
              </Button>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Salvataggio..." : "Salva"}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal>
      <Modal show={showLocationModal} onHide={handleCloseLocationModal} centered>
        <Modal.Header onHide={handleCloseLocationModal}>
          <Modal.Title>Aggiungi Location</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSaveLocation}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label>Nome visualizzato</Form.Label>
              <Form.Control
                name="displayName"
                value={locationForm.displayName}
                onChange={handleLocationFormChange}
                placeholder="Es. Sede Milano"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Indirizzo</Form.Label>
              <Form.Control
                name="line1"
                value={locationForm.line1}
                onChange={handleLocationFormChange}
                placeholder="Es. Via Roma 10"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Città</Form.Label>
              <Form.Control
                name="city"
                value={locationForm.city}
                onChange={handleLocationFormChange}
                placeholder="Es. Milano"
                required
              />
            </Form.Group>
            <div className="flex gap-3">
              <Form.Group className="flex-1 mb-4">
                <Form.Label>CAP</Form.Label>
                <Form.Control
                  name="postalCode"
                  value={locationForm.postalCode}
                  onChange={handleLocationFormChange}
                  placeholder="Es. 20100"
                  required
                />
              </Form.Group>
              <Form.Group className="flex-1 mb-4">
                <Form.Label>Paese</Form.Label>
                <Form.Control
                  name="country"
                  value={locationForm.country}
                  onChange={handleLocationFormChange}
                  placeholder="Es. IT"
                  maxLength={2}
                  required
                />
              </Form.Group>
            </div>
            <Form.Group>
              <Form.Label>Provincia / Stato <span className="text-gray-400 font-normal">(opzionale)</span></Form.Label>
              <Form.Control
                name="state"
                value={locationForm.state}
                onChange={handleLocationFormChange}
                placeholder="Es. MI"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={handleCloseLocationModal}>
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={savingLocation}>
              {savingLocation ? "Salvataggio..." : "Salva"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
