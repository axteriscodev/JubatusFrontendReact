import { ExternalLink, Plus, Settings } from "lucide-react";
import Button from "@common/components/ui/Button";
import ButtonGroup from "@common/components/ui/ButtonGroup";
import Table from "@common/components/ui/Table";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useEffect, useState } from "react";
import { formatDate } from "@common/utils/data-formatter";
import { ROUTES } from "@/routes";
import { fetchCompetitions } from "@features/admin/store/admin-competitions-actions";
import type { Competition } from "@/types/competition";
import LoadingState from "@common/components/ui/LoadingState";
import EventFilters from "../components/EventFilters";

type Filters = {
  dateFrom: string;
  dateTo: string;
  eventName: string;
  sortOrder: 'ASC' | 'DESC';
};

const DEFAULT_FILTERS: Filters = {
  dateFrom: '',
  dateTo: '',
  eventName: '',
  sortOrder: 'DESC',
};

export default function AdminEvents() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const competitions = useAppSelector(
    (state) => state.adminCompetitions.competitions,
  );
  const [loading, setLoading] = useState(true);

  // Separazione tra filtri "in input" (modificati dall'utente in tempo reale)
  // e filtri "applicati" (quelli effettivamente usati per la fetch).
  // La fetch scatta solo quando l'utente preme "Applica filtri", non ad ogni keystroke.
  const [inputFilters, setInputFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Ricarica la lista ogni volta che cambiano i filtri applicati.
  // I campi vuoti vengono omessi dalla query (undefined) per non vincolare il backend.
  useEffect(() => {
    setLoading(true);
    const params = {
      dateFrom: appliedFilters.dateFrom || undefined,
      dateTo: appliedFilters.dateTo || undefined,
      eventName: appliedFilters.eventName || undefined,
      sortOrder: appliedFilters.sortOrder,
    };
    dispatch(fetchCompetitions(params)).finally(() => setLoading(false));
  }, [dispatch, appliedFilters]);

  // Congela una copia degli inputFilters come filtri applicati, triggherando la fetch
  const handleApplyFilters = () => setAppliedFilters({ ...inputFilters });

  // Azzera sia la UI dei filtri sia la fetch (torna ai DEFAULT_FILTERS)
  const handleResetFilters = () => {
    setInputFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const handleCreateCompetition = () => navigate(ROUTES.ADMIN_CREATE_EVENT);

  const handleEditCompetition = (competition: Competition) => {
    navigate(ROUTES.ADMIN_EVENT(competition.id));
  };

  const handleOpenCompetition = (competition: Competition) => {
    const url = `${import.meta.env.VITE_APP_DOMAIN}${ROUTES.EVENT(competition.slug)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="container text-left">
      <div className="mb-6">
        <h1 className="mb-1">Elenco eventi</h1>
        <p className="text-sm text-gray-500">
          Visualizza e gestisci tutti gli eventi fotografici. Da qui puoi creare nuovi eventi, modificarne la configurazione e accedere alla pagina pubblica.
        </p>
      </div>

      <EventFilters
        filters={inputFilters}
        onChange={setInputFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {loading ? (
        <LoadingState message="Caricamento eventi..." />
      ) : (
      <Table className="my-10 table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Logo</th>
            <th>Nome</th>
            <th>Località</th>
            <th>Data evento</th>
            <th>Data inizio</th>
            <th>Data scadenza</th>
            <th className="flex justify-end">
              <button
                type="button"
                onClick={handleCreateCompetition}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-100 border border-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
              >
                <Plus size={14} /> nuovo evento
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((competition) => (
            <tr key={competition.id}>
              <td>{competition.id}</td>
              <td>
                {competition.logo && (
                  <img src={`${import.meta.env.VITE_API_URL}/${competition.logo}`} alt="" className="h-8 w-auto" />
                )}
              </td>
              <td>{competition.languages?.[0]?.title}</td>
              <td>{competition.languages?.[0]?.location}</td>
              <td>{formatDate(competition.dateEvent, 'it-IT')}</td>
              <td>{formatDate(competition.dateStart, 'it-IT')}</td>
              <td>{formatDate(competition.dateExpiry, 'it-IT')}</td>
              <td className="text-right">
                <ButtonGroup>
                  {(competition as Competition & { canManage?: boolean }).canManage !== false && (
                    <Button
                      variant="link"
                      onClick={() => handleEditCompetition(competition)}
                      size="sm"
                    >
                      <Settings size={16} />
                    </Button>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleOpenCompetition(competition)}
                  >
                    <ExternalLink size={16} />
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
    </div>
  );
}
