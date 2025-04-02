import { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import "../Admin.css";

/**
 * Pagina per la creazione dell'evento
 * 
 * @returns 
 * 
 */
export default function CreateEvent() {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();

    const handleReturnToList = () => navigate('/admin');

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setUrl('/' + slugify(newTitle));
    };

    const slugify = (text) =>
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');

    return(
    <div className='container text-start'>
        <h1>Gestione evento</h1>
        <Form>
            <Row>
                <Col sm={6} className="mb-3">
                    <Form.Label>Titolo</Form.Label>
                    <Form.Control placeholder="Titolo"value={title} onChange={handleTitleChange} />
                </Col>
                <Col sm={6} className="mb-3">
                    <Form.Label>Url</Form.Label>
                    <Form.Control placeholder="Url" value={url} disabled readOnly />
                </Col>
                <Col sm={6} className="mb-3">
                    <Form.Label>Località</Form.Label>
                    <Form.Control placeholder="Località" />
                </Col>
                <Col sm={6} className="mb-3">
                    <Form.Label>Descrizione</Form.Label>
                    <Form.Control placeholder="Descrizione" as="textarea" rows={3} />
                </Col>
                <Col sm={4} className="mb-3">
                    <Form.Label>Data evento</Form.Label>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon-data-e"><i class="bi bi-calendar"></i></InputGroup.Text>
                        <Form.Control placeholder="Data evento" type='date' />
                    </InputGroup >
                </Col>
                <Col sm={4} className="mb-3">
                    <Form.Label>Data pubblicazione</Form.Label>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon-data-p"><i class="bi bi-calendar"></i></InputGroup.Text>
                        <Form.Control placeholder="Data pubblicazione" type='date' />
                    </InputGroup >
                </Col>
                <Col sm={4} className="mb-3">
                    <Form.Label>Data scadenza</Form.Label>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon-data-s"><i class="bi bi-calendar"></i></InputGroup.Text>
                        <Form.Control placeholder="Data scadenza" type='date' />
                    </InputGroup >
                </Col>
                <Col sm={4} className="mb-3">
                    <Form.Label htmlFor="exampleColorInput">Colore background</Form.Label>
                    <Form.Control
                        type="color"
                        id="exampleColorInput"
                        defaultValue="#000000"
                        title="Choose your color"
                    />
                </Col>
                <Col sm={4} className="mb-3">
                    <Form.Label htmlFor="exampleColorInput">Colore primario</Form.Label>
                    <Form.Control
                        type="color"
                        id="exampleColorInput"
                        defaultValue="#ffffff"
                        title="Choose your color"
                    />
                </Col>
                <Col sm={4} className="mb-3">
                    <Form.Label htmlFor="exampleColorInput">Colore secondario</Form.Label>
                    <Form.Control
                        type="color"
                        id="exampleColorInput"
                        defaultValue="#ffa500"
                        title="Choose your color"
                    />
                </Col>
                <Col xs={12}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Logo</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                </Col>
            </Row>
            <div className='d-flex justify-content-between mt-sm'>
                <Button variant="success">Salva dati</Button>
                <Button onClick={handleReturnToList} variant="secondary">Vai all'elenco</Button>
            </div>
        </Form>
    </div>
    );
}