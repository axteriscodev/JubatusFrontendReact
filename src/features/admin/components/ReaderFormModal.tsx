import { useEffect, useState, type SubmitEvent } from "react";
import Modal from "@common/components/ui/Modal";
import Form from "@common/components/ui/Form";
import LoadingState from "@common/components/ui/LoadingState";
import { apiRequest } from "@common/services/api-services";
import { useFormState } from "@common/hooks/useFormState";
import { useAsync } from "@common/hooks/useAsync";
import { API } from "@common/services/api-endpoints";

type ActiveTab = "register" | "import";

interface RegisterFormState {
  label: string;
  registrationCode: string;
  locationId: string;
}

interface ImportFormState {
  stripeReaderId: string;
  registrationCode: string;
  label: string;
}

interface StripeLocation {
  id: string;
  displayName: string;
  city: string;
}

const EMPTY_REGISTER_FORM: RegisterFormState = { label: "", registrationCode: "", locationId: "" };
const EMPTY_IMPORT_FORM: ImportFormState = { stripeReaderId: "", registrationCode: "", label: "" };

export interface ReaderFormModalProps {
  show: boolean;
  onHide: () => void;
  onSaved?: () => void;
}

export default function ReaderFormModal({ show, onHide, onSaved }: ReaderFormModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("register");
  const { form: registerForm, handleChange: handleRegisterChange, resetForm: resetRegisterForm } = useFormState(EMPTY_REGISTER_FORM);
  const { form: importForm, handleChange: handleImportChange, resetForm: resetImportForm } = useFormState(EMPTY_IMPORT_FORM);
  const [locations, setLocations] = useState<StripeLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const { run, loading: saving } = useAsync<void>();

  useEffect(() => {
    if (!show) return;
    setActiveTab("register");
    resetRegisterForm();
    resetImportForm();
    setLoadingLocations(true);
    apiRequest({
      api: API.TERMINAL_LOCATIONS,
      method: "GET",
      needAuth: true,
    })
      .then((res) => res.ok && res.json())
      .then((data) => data && setLocations((data as { data: { locations: StripeLocation[] } }).data.locations))
      .catch(() => console.error("Errore nel caricamento delle location"))
      .finally(() => setLoadingLocations(false));
  }, [show]);

  const handleRegisterSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await run(async () => {
      const response = await apiRequest({
        api: API.TERMINAL_READERS,
        method: "POST",
        needAuth: true,
        body: JSON.stringify({
          locationId: Number(registerForm.locationId),
          label: registerForm.label,
          registrationCode: registerForm.registrationCode,
        }),
      });
      if (response.ok) {
        onSaved?.();
        onHide();
      }
    });
  };

  const handleImportSave = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await run(async () => {
      const body: Record<string, string> = {
        stripeReaderId: importForm.stripeReaderId,
        registrationCode: importForm.registrationCode,
      };
      if (importForm.label.trim()) body.label = importForm.label.trim();
      const response = await apiRequest({
        api: API.TERMINAL_READERS_IMPORT,
        method: "POST",
        needAuth: true,
        body: JSON.stringify(body),
      });
      if (response.ok) {
        onSaved?.();
        onHide();
      }
    });
  };

  const tabClass = (tab: ActiveTab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? "border-green-500 text-green-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    }`;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header onHide={onHide}>
        <Modal.Title>Aggiungi Reader</Modal.Title>
      </Modal.Header>
      <div className="flex border-b border-gray-200 px-4">
        <button type="button" className={tabClass("register")} onClick={() => setActiveTab("register")}>
          Registrazione Reader
        </button>
        <button type="button" className={tabClass("import")} onClick={() => setActiveTab("import")}>
          Reader già registrato
        </button>
      </div>
      {activeTab === "register" && (
        loadingLocations ? (
          <Modal.Body>
            <LoadingState message="Caricamento location..." />
          </Modal.Body>
        ) : (
          <form onSubmit={handleRegisterSave}>
            <Modal.Body>
              <Form.Group className="mb-4">
                <Form.Label>Label</Form.Label>
                <Form.Control
                  name="label"
                  value={registerForm.label}
                  onChange={handleRegisterChange}
                  placeholder="Es. Cassa 1"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Codice di registrazione</Form.Label>
                <Form.Control
                  name="registrationCode"
                  value={registerForm.registrationCode}
                  onChange={handleRegisterChange}
                  placeholder="Es. present-rattle-solve"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Select
                  name="locationId"
                  value={registerForm.locationId}
                  onChange={handleRegisterChange}
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
        )
      )}
      {activeTab === "import" && (
        <form onSubmit={handleImportSave}>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label>Stripe Reader ID</Form.Label>
              <Form.Control
                name="stripeReaderId"
                value={importForm.stripeReaderId}
                onChange={handleImportChange}
                placeholder="Es. tmr_xxx"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Codice di registrazione</Form.Label>
              <Form.Control
                name="registrationCode"
                value={importForm.registrationCode}
                onChange={handleImportChange}
                placeholder="Es. simulated-wpe"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Label <span className="text-gray-400 text-xs">(opzionale)</span>
              </Form.Label>
              <Form.Control
                name="label"
                value={importForm.label}
                onChange={handleImportChange}
                placeholder="Es. Cassa 1"
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
              {saving ? "Importazione..." : "Importa"}
            </button>
          </Modal.Footer>
        </form>
      )}
    </Modal>
  );
}
