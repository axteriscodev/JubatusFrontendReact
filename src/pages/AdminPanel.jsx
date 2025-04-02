import {Button, ButtonGroup, Table} from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'bootstrap';

import "../Admin.css";

/**
 * Pagina di admin
 * 
 * @returns {React.ReactElement} admin panel
 */

export default function AdminPanel() {
  //const tooltipRef = useRef(null);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
      new Tooltip(el);
    });
  }, []);

  return (
  <div className='container text-start'>
    <h1>Elenco eventi</h1>
    <Table striped bordered hover className='my-sm'>
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
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>
            <ButtonGroup aria-label="Azioni">
              <Button variant="secondary" className="btn-sm" data-bs-toggle="tooltip" title="Modifica evento"><i className="bi bi-pencil"></i></Button>
              <Button variant="warning" className="btn-sm" data-bs-toggle="tooltip" title="Disattiva evento"><i className="bi bi-eraser-fill"></i></Button>
              <Button variant="success" className="btn-sm" data-bs-toggle="tooltip" title="Ripristina evento"><i className="bi bi-arrow-counterclockwise"></i></Button>
              <Button variant="danger" className="btn-sm" data-bs-toggle="tooltip" title="Elimina evento"><i className="bi bi-trash"></i></Button>
            </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>
            <ButtonGroup aria-label="Azioni">
              <Button variant="secondary" className="btn-sm" data-bs-toggle="tooltip" title="Modifica evento"><i className="bi bi-pencil"></i></Button>
              <Button variant="warning" className="btn-sm" data-bs-toggle="tooltip" title="Disattiva evento"><i className="bi bi-eraser-fill"></i></Button>
              <Button variant="success" className="btn-sm" data-bs-toggle="tooltip" title="Ripristina evento"><i className="bi bi-arrow-counterclockwise"></i></Button>
              <Button variant="danger" className="btn-sm" data-bs-toggle="tooltip" title="Elimina evento"><i className="bi bi-trash"></i></Button>
            </ButtonGroup>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>
            <ButtonGroup aria-label="Azioni">
              <Button variant="secondary" className="btn-sm" data-bs-toggle="tooltip" title="Modifica evento"><i className="bi bi-pencil"></i></Button>
              <Button variant="warning" className="btn-sm" data-bs-toggle="tooltip" title="Disattiva evento"><i className="bi bi-eraser-fill"></i></Button>
              <Button variant="success" className="btn-sm" data-bs-toggle="tooltip" title="Ripristina evento"><i className="bi bi-arrow-counterclockwise"></i></Button>
              <Button variant="danger" className="btn-sm" data-bs-toggle="tooltip" title="Elimina evento"><i className="bi bi-trash"></i></Button>
            </ButtonGroup>
          </td>
        </tr>
      </tbody>
    </Table>
    <Button variant='primary'><i className="bi bi-plus"></i> Aggiungi nuovo evento</Button>
  </div>
  );
}
