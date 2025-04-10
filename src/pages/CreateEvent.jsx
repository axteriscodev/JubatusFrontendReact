import { useState, useEffect } from "react";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation, redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addCompetition,
  editCompetition,
} from "../repositories/admin-competitions/admin-competitions-actions";
import { toast, Bounce } from "react-toastify";
import { isAdmin } from "../utils/auth";
import { slugify } from "../utils/data-formatter";

/**
 * Pagina per la creazione dell'evento
 *
 * @returns
 *
 */
export default function CreateEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const receivedComp = useLocation().state;
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [formData, setFormData] = useState({
    slug: "",
    pathS3: "",
    emoji: "",
    backgroundColor: "#000000",
    primaryColor: "#000000",
    secondaryColor: "#000000",
    logo: "",
    dateEvent: "",
    dateExpiry: "",
    dateStart: "",
    title: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (receivedComp) {
      setFormData({
        id: receivedComp.id,
        slug: receivedComp.slug,
        pathS3: receivedComp.pathS3,
        emoji: receivedComp.emoji,
        backgroundColor: receivedComp.backgroundColor,
        primaryColor: receivedComp.primaryColor,
        secondaryColor: receivedComp.secondaryColor,
        logo: "",
        dateEvent: receivedComp.dateEvent.split("T")[0],
        dateExpiry: receivedComp.dateExpiry.split("T")[0],
        dateStart: receivedComp.dateStart.split("T")[0],
        title: receivedComp.languages[0].title,
        location: receivedComp.languages[0].location,
        description: receivedComp.languages[0].description,
      });
    }
    // aggiungo la classe admin per aggiornare le variabili CSS
    document.body.classList.add("admin");
    // rimuovo la classe admin al "destroy" del componente
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  const handleReturnToList = () => navigate("/admin");

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle));
    setFormData({
      ...formData,
      title: newTitle,
      slug: slugify(newTitle),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Prende il primo file selezionato
    setFormData({
      ...formData,
      logo: file, // Memorizza il file nello stato
    });
  };

  const handleSubmit = async (event, data) => {
    data.languages = [
      {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        emoji: formData.emoji,
      },
    ];

    let outcome = false;
    if (data.id) {
      outcome = await dispatch(editCompetition(data));
    } else {
      outcome = await dispatch(addCompetition(data));
    }

    if (outcome) {
      toast.success("Evento creato!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      navigate("/admin");
    } else {
      toast.error("Si è verificato un errore", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="container text-start">
      <h1>Gestione evento</h1>
      <Form>
        <Row>
          <Col sm={6} className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              placeholder="Titolo"
              value={formData.title}
              onChange={handleTitleChange}
            />
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Label>Url</Form.Label>
            <Form.Control
              placeholder="Url"
              value={formData.slug}
              disabled
              readOnly
            />
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Label>Località</Form.Label>
            <Form.Control
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Località"
            />
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Label>Path S3</Form.Label>
            <Form.Control
              name="pathS3"
              value={formData.pathS3}
              onChange={handleInputChange}
              placeholder="Path S3"
            />
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Label>Emote attesa</Form.Label>
            <Form.Control
              name="emoji"
              value={formData.emoji}
              onChange={handleInputChange}
              placeholder="Inserisci delle emote (es: 🚴)"
            />
          </Col>
          <Col sm={12} className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descrizione"
              as="textarea"
              rows={3}
            />
          </Col>
          <Col sm={4} className="mb-3">
            <Form.Label>Data evento</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon-data-e">
                <i className="bi bi-calendar"></i>
              </InputGroup.Text>
              <Form.Control
                name="dateEvent"
                value={formData.dateEvent}
                onChange={handleInputChange}
                placeholder="Data evento"
                type="date"
              />
            </InputGroup>
          </Col>
          <Col sm={4} className="mb-3">
            <Form.Label>Data pubblicazione</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon-data-p">
                <i className="bi bi-calendar"></i>
              </InputGroup.Text>
              <Form.Control
                name="dateStart"
                value={formData.dateStart}
                onChange={handleInputChange}
                placeholder="Data pubblicazione"
                type="date"
              />
            </InputGroup>
          </Col>
          <Col sm={4} className="mb-3">
            <Form.Label>Data scadenza</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon-data-s">
                <i className="bi bi-calendar"></i>
              </InputGroup.Text>
              <Form.Control
                name="dateExpiry"
                value={formData.dateExpiry}
                onChange={handleInputChange}
                placeholder="Data scadenza"
                type="date"
              />
            </InputGroup>
          </Col>
          <Col sm={4} className="mb-3">
            <Form.Label htmlFor="exampleColorInput">
              Colore background
            </Form.Label>
            <Form.Control
              type="color"
              id="exampleColorInput"
              title="Choose your color"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleInputChange}
            />
          </Col>
          <Col sm={4} className="mb-3">
            <Form.Label htmlFor="exampleColorInput">Colore primario</Form.Label>
            <Form.Control
              type="color"
              id="exampleColorInput"
              title="Choose your color"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleInputChange}
            />
          </Col>
          <Col sm={4} className="mb-3">
            <Form.Label htmlFor="exampleColorInput">
              Colore secondario
            </Form.Label>
            <Form.Control
              type="color"
              id="exampleColorInput"
              title="Choose your color"
              name="secondaryColor"
              value={formData.secondaryColor}
              onChange={handleInputChange}
            />
          </Col>
          <Col xs={12}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                onChange={handleFileChange}
                type="file"
                accept="image/*"
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-sm">
          <Button
            onClick={(event) => handleSubmit(event, formData)}
            variant="success"
          >
            Salva dati
          </Button>
          <Button onClick={handleReturnToList} variant="secondary">
            Vai all'elenco
          </Button>
        </div>
      </Form>
    </div>
  );
}

export function loader() {
  if (!isAdmin()) {
    return redirect("/");
  }
  return null;
}
