import { Settings, Plus } from "lucide-react";
import Button from "@common/components/ui/Button";
import ButtonGroup from "@common/components/ui/ButtonGroup";
import Table from "@common/components/ui/Table";
import Badge from "@common/components/ui/Badge";
import LocationFormModal from "../components/LocationFormModal";
import ReaderFormModal from "../components/ReaderFormModal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useEffect, useState } from "react";
import { ROUTES } from "@/routes";
import { fetchReaders } from "@features/admin/store/admin-readers-actions";
import { apiRequest } from "@common/services/api-services";
import type { Reader, StripeLocation } from "@/types/admin";

type Tab = "readers" | "locations";

export default function AdminReaders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const readers = useAppSelector((state) => state.adminReaders.readers);

  const [activeTab, setActiveTab] = useState<Tab>("readers");
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [locations, setLocations] = useState<StripeLocation[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchReaders());
  }, [dispatch]);

  const fetchLocations = async () => {
    setLocationsLoading(true);
    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/locations",
        method: "GET",
        needAuth: true,
      });
      if (response.ok) {
        const data = (await response.json()) as {
          data: { locations: StripeLocation[] };
        };
        setLocations(data.data.locations);
      }
    } catch {
      console.error("Errore nel caricamento delle location");
    } finally {
      setLocationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "locations") {
      fetchLocations();
    }
  }, [activeTab]);

  const handleConfigureReader = (reader: Reader) => {
    navigate(ROUTES.ADMIN_READER(reader.id));
  };

  return (
    <div className="container text-left">
      <div className="mb-6">
        <h1 className="mb-1">Reader Stripe</h1>
        <p className="text-sm text-gray-500">
          Gestione dei reader POS Stripe Terminal e delle location fisiche associate. I reader vengono assegnati agli eventi per accettare pagamenti in presenza.
        </p>
      </div>
      <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("readers")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "readers"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Reader POS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("locations")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "locations"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Location
        </button>
      </div>

      {activeTab === "readers" && (
        <Table className="table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>Label</th>
              <th>Stripe ID</th>
              <th>Location</th>
              <th>Evento</th>
              <th>Stato</th>
              <th className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowReaderModal(true)}
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
                <td>{reader.location?.displayName || "-"}</td>
                <td>{reader.event ? reader.event.title : "-"}</td>
                <td>
                  <Badge bg={reader.active ? "success" : "secondary"}>
                    {reader.active ? "Attivo" : "Disattivo"}
                  </Badge>
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
      )}

      {activeTab === "locations" && (
        <Table className="table-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>StripeId</th>
              <th>Nome</th>
              <th>Indirizzo</th>
              <th>Citta</th>
              <th>Paese</th>
              <th>Evento</th>
              <th>Default</th>
              <th>Reader</th>
              <th className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-100 border border-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Plus size={14} /> nuova location
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {!locationsLoading &&
              locations.map((loc) => (
                <tr key={loc.id}>
                  <td>{loc.id}</td>
                  <td>{loc.stripeLocationId}</td>
                  <td>{loc.displayName}</td>
                  <td>{loc.addressLine1}</td>
                  <td>{loc.city}</td>
                  <td>{loc.country}</td>
                  <td>{loc.event?.title || "-"}</td>
                  <td>{loc.defaultLocation ? "Si" : "No"}</td>
                  <td>{loc.readers?.length ?? 0}</td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      <ReaderFormModal
        show={showReaderModal}
        onHide={() => setShowReaderModal(false)}
        onSaved={() => dispatch(fetchReaders())}
      />

      <LocationFormModal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
        onSaved={fetchLocations}
      />
    </div>
  );
}
