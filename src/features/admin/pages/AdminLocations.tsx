import { Plus } from "lucide-react";
import Table from "@common/components/ui/Table";
import LocationFormModal from "../components/LocationFormModal";
import { useEffect, useState } from "react";
import { apiRequest } from "@common/services/api-services";

interface StripeLocation {
  id: string;
  stripeLocationId: string;
  displayName: string;
  addressLine1: string;
  city: string;
  country: string;
  readers?: unknown[];
}

export default function AdminLocations() {
  const [locations, setLocations] = useState<StripeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        api: import.meta.env.VITE_API_URL + "/terminal/locations",
        method: "GET",
        needAuth: true,
      });
      if (response.ok) {
        const data = await response.json() as { data: { locations: StripeLocation[] } };
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

  return (
    <div className="container text-left">
      <div className="mb-10 flex items-center justify-between">
        <h1>Elenco Location</h1>
      </div>
      <Table className="table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>StripeId</th>
            <th>Nome</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Paese</th>
            <th>Reader</th>
            <th className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
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
                <td>{loc.stripeLocationId}</td>
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

      <LocationFormModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSaved={fetchLocations}
      />
    </div>
  );
}
