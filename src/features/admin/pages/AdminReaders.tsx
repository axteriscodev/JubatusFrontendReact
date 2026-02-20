import { Settings, Plus } from "lucide-react";
import Button from "@common/components/ui/Button";
import ButtonGroup from "@common/components/ui/ButtonGroup";
import Table from "@common/components/ui/Table";
import LocationFormModal from "../components/LocationFormModal";
import ReaderFormModal from "../components/ReaderFormModal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useEffect, useState } from "react";
import { ROUTES } from "@/routes";
import { fetchReaders } from "@features/admin/store/admin-readers-actions";
import type { Reader } from "@/types/admin";

export default function AdminReaders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const readers = useAppSelector((state) => state.adminReaders.readers);

  const [showReaderModal, setShowReaderModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    dispatch(fetchReaders());
  }, [dispatch]);

  const handleConfigureReader = (reader: Reader) => {
    navigate(ROUTES.ADMIN_READER(reader.id));
  };

  return (
    <div className="container text-left">
      <div className="mb-10 flex items-center justify-between">
        <h1>Elenco Reader POS</h1>
        <button
          type="button"
          onClick={() => setShowLocationModal(true)}
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
              <td>{reader.events && reader.events.length > 0 ? reader.events[0].slug : "-"}</td>
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

      <ReaderFormModal
        show={showReaderModal}
        onHide={() => setShowReaderModal(false)}
        onSaved={() => dispatch(fetchReaders())}
      />

      <LocationFormModal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
      />
    </div>
  );
}
