import { useState, useEffect } from "react";
import { Form, Row, Col, Button, InputGroup, Card } from "react-bootstrap";
import { useNavigate, useLocation, redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  addCompetition,
  editCompetition,
} from "../repositories/admin-competitions/admin-competitions-actions";
import { toast, Bounce } from "react-toastify";
import { isAdmin } from "../utils/auth";
import { slugify } from "../utils/data-formatter";
import Logo from "../components/Logo";
import { errorToast, successToast } from "../utils/toast-manager";

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
    datePreorderStart: "",
    datePreorderExpiry: "",
    title: "",
    location: "",
    description: "",
  });

  //Listini
  const [priceLists, setPriceLists] = useState([
    {
      dateStart: "",
      dateExpiry: "",
      items: [
        {
          title: "",
          subTitle: "",
          bestOffer: false,
          quantityPhoto: "",
          quantityVideo: "",
          price: "",
          discount: "",
          itemsLanguages: [
            {
              title: "",
              subTitle: "",
            },
          ],
        },
      ],
    },
  ]);

  //Aggiunta listino
  const addList = () => {
    setPriceLists([
      ...priceLists,
      {
        dateStart: "",
        dateExpiry: "",
        items: [
          {
            title: "",
            subTitle: "",
            bestOffer: false,
            quantityPhoto: "",
            quantityVideo: "",
            price: "",
            discount: "",
            itemsLanguages: [
              {
                title: "",
                subTitle: "",
              },
            ],
          },
        ],
      },
    ]);
  };

  //Rimozione listino
  const removeList = (priceListIndex) => {
    setPriceLists(priceLists.filter((_, i) => i !== priceListIndex));
  };

  //Gestione date listino
  const handleFormDateChange = (formIndex, field, value) => {
    const newPriceList = structuredClone(priceLists);
    newPriceList[formIndex][field] = value;
    setPriceLists(newPriceList);
  };

  //Aggiunta di un pacchetto
  const addRowToList = (formIndex) => {
    const newPriceList = structuredClone(priceLists);
    newPriceList[formIndex].items.push({
      title: "",
      subTitle: "",
      bestOffer: false,
      quantityPhoto: "",
      quantityVideo: "",
      price: "",
      discount: "",
      itemsLanguages: [
        {
          title: "",
          subTitle: "",
        },
      ],
    });
    setPriceLists(newPriceList);
  };

  //Rimozione di un pacchetto
  const removeRowFromList = (formIndex, rowIndex) => {
    const newPriceList = structuredClone(priceLists);
    newPriceList[formIndex].items = newPriceList[formIndex].items.filter(
      (_, i) => i !== rowIndex
    );
    setPriceLists(newPriceList);
  };

  // Aggiorna i valori all'interno di una righa
  const handleRowChange = (formIndex, rowIndex, field, value) => {
    const newPriceList = structuredClone(priceLists);
    newPriceList[formIndex].items[rowIndex][field] = value === "" ? "" : value;
    setPriceLists(newPriceList);
  };

  const handleRowSubListChange = (formIndex, rowIndex, field, value) => {
    const newPriceList = structuredClone(priceLists);
    newPriceList[formIndex].items[rowIndex][field] = value === "" ? "" : value;
    newPriceList[formIndex].items[rowIndex]["itemsLanguages"][0][field] =
      value === "" ? "" : value;
    setPriceLists(newPriceList);
  };

  useEffect(() => {
    //in caso modifica evento, precompilo i campi
    if (receivedComp) {
      setFormData({
        id: receivedComp.id,
        slug: receivedComp.slug,
        pathS3: receivedComp.pathS3,
        emoji: receivedComp.languages[0].emoji,
        backgroundColor: receivedComp.backgroundColor,
        primaryColor: receivedComp.primaryColor,
        secondaryColor: receivedComp.secondaryColor,
        logo: "",
        dateEvent: receivedComp.dateEvent.split("T")[0],
        dateExpiry: receivedComp.dateExpiry.split("T")[0],
        dateStart: receivedComp.dateStart.split("T")[0],
        datePreorderStart: receivedComp.datePreorderStart.split("T")[0],
        datePreorderExpiry: receivedComp.datePreorderExpiry.split("T")[0],
        title: receivedComp.languages[0].title,
        location: receivedComp.languages[0].location,
        description: receivedComp.languages[0].description,
      });

      setPriceLists(receivedComp.lists);
    }

    // aggiungo la classe admin per aggiornare le variabili CSS
    document.body.classList.add("admin");
    // rimuovo la classe admin al "destroy" del componente
    return () => {
      document.body.classList.remove("admin");
    };
  }, []);

  //pulsante ritorno alla lista eventi
  const handleReturnToList = () => navigate("/admin");

  //gestione del titolo evento e slug
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

  //metodo per aggiornare i campi
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

    data.lists = priceLists;

    let outcome = false;
    if (data.id) {
      outcome = await dispatch(editCompetition(data));
    } else {
      outcome = await dispatch(addCompetition(data));
    }

    if (outcome) {
      successToast("Evento creato!");
      navigate("/admin");
    } else {
      errorToast("Si è verificato un errore");
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
          <Col sm={6} className="mb-3">
            <Form.Label>Data inizio preordini</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon-data-s">
                <i className="bi bi-calendar"></i>
              </InputGroup.Text>
              <Form.Control
                name="datePreorderStart"
                value={formData.datePreorderStart}
                onChange={handleInputChange}
                placeholder="Data inizio preordini"
                type="date"
              />
            </InputGroup>
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Label>Data fine preordini</Form.Label>
            <InputGroup>
              <InputGroup.Text id="basic-addon-data-s">
                <i className="bi bi-calendar"></i>
              </InputGroup.Text>
              <Form.Control
                name="datePreorderExpiry"
                value={formData.datePreorderExpiry}
                onChange={handleInputChange}
                placeholder="Data fine preordini"
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
          <Col xs={6} className="my-4">
            <Logo
              src={
                formData.logo === ""
                  ? receivedComp
                    ? import.meta.env.VITE_API_URL + "/" + receivedComp?.logo
                    : "/public/images/noimage.jpg"
                  : URL.createObjectURL(formData.logo)
              }
              css="mb-sm"
            />
          </Col>
          <Col xs={6}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                onChange={handleFileChange}
                type="file"
                accept="image/*"
              />
            </Form.Group>
          </Col>

          <Col xs={12} className="mt-4">
            <h3>Listini prezzi</h3>
            {priceLists.map((form, formIndex) => (
              <Card className="mb-4" key={formIndex}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeList(formIndex)}
                    disabled={priceLists.length === 1}
                  >
                    Rimuovi listino
                  </Button>
                </Card.Header>
                <Card.Body>
                  {/* Campi Data */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId={`dateStart-${formIndex}`}>
                        <Form.Label>Data Inizio</Form.Label>
                        <Form.Control
                          type="date"
                          value={form.dateStart}
                          onChange={(e) =>
                            handleFormDateChange(
                              formIndex,
                              "dateStart",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`dateExpiry-${formIndex}`}>
                        <Form.Label>Data Fine</Form.Label>
                        <Form.Control
                          type="date"
                          value={form.dateExpiry}
                          onChange={(e) =>
                            handleFormDateChange(
                              formIndex,
                              "dateExpiry",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Righe */}
                  {form.items.map((row, rowIndex) => (
                    <Col key={rowIndex} md={12}>
                      <Row>
                        <Col md={4}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-title`}
                          >
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control
                              value={row.itemsLanguages[0]?.title ?? ""}
                              onChange={(e) =>
                                handleRowSubListChange(
                                  formIndex,
                                  rowIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Titolo"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-subTitle`}
                          >
                            <Form.Label>Sottotitolo</Form.Label>
                            <Form.Control
                              value={row.itemsLanguages[0]?.subTitle ?? ""}
                              onChange={(e) =>
                                handleRowSubListChange(
                                  formIndex,
                                  rowIndex,
                                  "subTitle",
                                  e.target.value
                                )
                              }
                              placeholder="Sottotitolo"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-bestOffer`}
                          >
                            <Form.Label>Miglior offerta</Form.Label>
                            <Form.Check
                              type="checkbox"
                              checked={row.bestOffer}
                              value={row.bestOffer}
                              onChange={(e) =>
                                handleRowChange(
                                  formIndex,
                                  rowIndex,
                                  "bestOffer",
                                  e.target.value
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-3 align-items-end">
                        <Col md={2}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-quantityPhoto`}
                          >
                            <Form.Label>Quantità foto</Form.Label>
                            <Form.Control
                              type="number"
                              value={row.quantityPhoto}
                              onChange={(e) =>
                                handleRowChange(
                                  formIndex,
                                  rowIndex,
                                  "quantityPhoto",
                                  e.target.value
                                )
                              }
                              placeholder="Numero"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-quantityVideo`}
                          >
                            <Form.Label>Quantità video</Form.Label>
                            <Form.Control
                              type="number"
                              value={row.quantityVideo}
                              onChange={(e) =>
                                handleRowChange(
                                  formIndex,
                                  rowIndex,
                                  "quantityVideo",
                                  e.target.value
                                )
                              }
                              placeholder="Numero"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-price`}
                          >
                            <Form.Label>Prezzo</Form.Label>
                            <Form.Control
                              type="number"
                              value={row.price}
                              onChange={(e) =>
                                handleRowChange(
                                  formIndex,
                                  rowIndex,
                                  "price",
                                  e.target.value
                                )
                              }
                              placeholder="Prezzo"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group
                            controlId={`f${formIndex}-r${rowIndex}-discount`}
                          >
                            <Form.Label>Sconto</Form.Label>
                            <Form.Control
                              type="number"
                              value={row.discount}
                              onChange={(e) =>
                                handleRowChange(
                                  formIndex,
                                  rowIndex,
                                  "discount",
                                  e.target.value
                                )
                              }
                              placeholder="Sconto"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="danger"
                            onClick={() =>
                              removeRowFromList(formIndex, rowIndex)
                            }
                            disabled={form.items.length === 1}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  ))}

                  <Button
                    variant="secondary"
                    onClick={() => addRowToList(formIndex)}
                    className="mt-2"
                  >
                    Aggiungi pacchetto
                  </Button>
                </Card.Body>
              </Card>
            ))}
            <Button variant="primary" onClick={addList} className="me-2">
              Aggiungi listino
            </Button>
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
