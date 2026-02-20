import { ExternalLink, Plus, Settings } from "lucide-react";
import Button from "@common/components/ui/Button";
import ButtonGroup from "@common/components/ui/ButtonGroup";
import Table from "@common/components/ui/Table";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@common/store/hooks";
import { useEffect } from "react";
import { formatDate } from "@common/utils/data-formatter";
import { ROUTES } from "@/routes";
import { fetchCompetitions } from "@features/admin/store/admin-competitions-actions";
import type { Competition } from "@/types/competition";

export default function AdminPanel() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const competitions = useAppSelector(
    (state) => state.adminCompetitions.competitions,
  );

  useEffect(() => {
    dispatch(fetchCompetitions());
  }, [dispatch]);

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
      <h1 className="mb-10">Elenco eventi</h1>
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
              <td>{competition.languages[0].title}</td>
              <td>{competition.languages[0].location}</td>
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
    </div>
  );
}
