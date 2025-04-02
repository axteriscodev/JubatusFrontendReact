import { Button, ButtonGroup, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useRef } from "react";
import { Tooltip } from "bootstrap";
import { formatDate } from "../utils/data-formatter";

import {
  fetchCompetitions,
  editCompetition,
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
    (state) => state.adminCompetitions.competitions
  );

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((el) => {
      new Tooltip(el);
    });

    // aggiungo la classe admin per aggiornare le variabili CSS
    document.body.classList.add('admin');
    // rimuovo la classe admin al "destroy" del componente
    return () => {
      document.body.classList.remove('admin');
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

  return (
    <div className="container text-start">
      <h1>Elenco eventi</h1>
      <Table striped bordered hover className="my-sm">
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
          {competitions.map((competition, i) => (
            <tr key={competition.id}>
              <td>{competition.id}</td>
              <td>{competition.languages[0].title}</td>
              <td>{competition.languages[0].location}</td>
              <td>{formatDate(competition.dateEvent)}</td>
              <td>{formatDate(competition.dateStart)}</td>
              <td>{formatDate(competition.dateExpiry)}</td>
              <td>
                <ButtonGroup aria-label="Azioni">
                  <Button
                    variant="secondary"
                    onClick={() => handleEditCompetition(competition)}
                    className="btn-sm"
                    data-bs-toggle="tooltip"
                    title="Modifica evento"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  {/*<Button variant="warning" className="btn-sm" data-bs-toggle="tooltip" title="Disattiva evento"><i className="bi bi-eraser-fill"></i></Button>
              <Button variant="success" className="btn-sm" data-bs-toggle="tooltip" title="Ripristina evento"><i className="bi bi-arrow-counterclockwise"></i></Button>*/}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCompetition(competition)}
                    className="btn-sm"
                    data-bs-toggle="tooltip"
                    title="Elimina evento"
                  >
                    <i className="bi bi-trash"></i>
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
