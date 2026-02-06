import Button from "../shared/components/ui/Button";
import ButtonGroup from "../shared/components/ui/ButtonGroup";
import Table from "../shared/components/ui/Table";
import Tooltip from "../shared/components/ui/Tooltip";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import { formatDate } from "../utils/data-formatter";
import { logOut } from "../utils/auth";

import {
  fetchCompetitions,
  deleteCompetition,
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

  const handleCreateCompetition = () => navigate("/admin/create-event");

  const handleEditCompetition = (competition) => {
    navigate("/admin/create-event", { state: competition });
  };

  const handleDeleteCompetition = (competition) => {
    dispatch(deleteCompetition(competition));
  };

  const handleLogout = () => {
    logOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="container text-left">
      <div className="flex justify-end my-10">
        <Button onClick={handleLogout} variant="outline">
          <i className="bi bi-box-arrow-right"></i> Logout
        </Button>
      </div>
      <h1>Elenco eventi</h1>
      <Table className="my-10 table-auto">
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Località</th>
            <th>Data evento</th>
            <th>Data inizio</th>
            <th>Data scadenza</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {competitions.map((competition) => (
            <tr key={competition.id}>
              <td>{competition.id}</td>
              <td>{competition.languages[0].title}</td>
              <td>{competition.languages[0].location}</td>
              <td>{formatDate(competition.dateEvent)}</td>
              <td>{formatDate(competition.dateStart)}</td>
              <td>{formatDate(competition.dateExpiry)}</td>
              <td className="text-right">
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    onClick={() => handleEditCompetition(competition)}
                    size="sm"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  {/*<Button variant="warning" className="btn-sm" data-bs-toggle="tooltip" title="Disattiva evento"><i className="bi bi-eraser-fill"></i></Button>
              <Button variant="success" className="btn-sm" data-bs-toggle="tooltip" title="Ripristina evento"><i className="bi bi-arrow-counterclockwise"></i></Button>*/}
                  {/* <Button
                    variant="danger"
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "Sei sicuro di voler rimuovere l'evento?",
                      );
                      if (confirmDelete) {
                        handleDeleteCompetition(competition);
                      }
                    }}
                    size="sm"
                  >
                    <i className="bi bi-trash"></i>
                  </Button> */}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `${import.meta.env.VITE_EVENT_ENDPOINT}${competition.slug}`,
                        "_blank",
                      )
                    }
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={handleCreateCompetition} variant="primary">
        <i className="bi bi-plus"></i> Aggiungi nuovo evento
      </Button>
    </div>
  );
}
