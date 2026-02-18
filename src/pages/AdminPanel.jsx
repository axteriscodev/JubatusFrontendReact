import { LogOut, Pencil, ExternalLink, Plus, Settings } from "lucide-react";
import Button from "../shared/components/ui/Button";
import ButtonGroup from "../shared/components/ui/ButtonGroup";
import Table from "../shared/components/ui/Table";
import Tooltip from "../shared/components/ui/Tooltip";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { formatDate } from "../utils/data-formatter";
import { logOut } from "../utils/auth";
import { ROUTES } from "../routes";

import {
  fetchCompetitions,
  //deleteCompetition,
} from "../repositories/admin-competitions/admin-competitions-actions";

/**
 * Pagina di admin
 *
 * @returns {React.ReactElement} admin panel
 */

export default function AdminPanel() {
  //const tooltipRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const competitions = useSelector(
    (state) => state.adminCompetitions.competitions,
  );

  useEffect(() => {
    // aggiungo la classe admin per aggiornare le variabili CSS
    document.body.classList.add("admin");
    // rimuovo la classe admin al "destroy" del componente
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  useEffect(() => {
    dispatch(fetchCompetitions());
  }, []);

  const handleCreateCompetition = () => navigate(ROUTES.ADMIN_CREATE_EVENT);

  const handleEditCompetition = (competition) => {
    navigate(ROUTES.ADMIN_EVENT(competition.id));
  };

  const handleOpenCompetition = (competition) => {
    const url = `${import.meta.env.VITE_APP_DOMAIN}${ROUTES.EVENT(competition.slug)}`;
    window.open(url, "_blank");
  };

  // const handleDeleteCompetition = (competition) => {
  //   dispatch(deleteCompetition(competition));
  // };

  const handleLogout = () => {
    logOut();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <div className="container text-left">
      <div className="flex justify-end my-10">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
      <h1>Elenco eventi</h1>
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
                  <img src={competition.logo} alt="" className="h-8 w-auto" />
                )}
              </td>
              <td>{competition.languages[0].title}</td>
              <td>{competition.languages[0].location}</td>
              <td>{formatDate(competition.dateEvent)}</td>
              <td>{formatDate(competition.dateStart)}</td>
              <td>{formatDate(competition.dateExpiry)}</td>
              <td className="text-right">
                <ButtonGroup>
                  {competition.canManage !== false && (
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
