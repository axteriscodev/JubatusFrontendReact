import { Form, Row, Col, Card } from "react-bootstrap";

/**
 * Componente per la selezione dei colori dell'evento - VERSIONE MIGLIORATA
 */
export function EventColors({ formData, onInputChange }) {
  return (
    <Card className="shadow-sm border-0 mb-4">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-danger bg-opacity-10 rounded-3 p-3 me-3">
            <i className="bi bi-palette-fill text-danger fs-4"></i>
          </div>
          <div>
            <h5 className="mb-1 fw-bold">Colori & Branding</h5>
            <p className="text-muted mb-0 small">Personalizza la palette cromatica dell'evento</p>
          </div>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="border-2 h-100 transition-all" style={{ 
              borderColor: formData.backgroundColor,
              transition: 'all 0.3s ease'
            }}>
              <Card.Body className="text-center p-4">
                <div 
                  className="rounded-circle mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    backgroundColor: formData.backgroundColor,
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <i className="bi bi-paint-bucket text-white fs-3"></i>
                </div>
                <Form.Label className="fw-bold text-secondary mb-2 d-block">
                  Colore Background
                </Form.Label>
                <Form.Control
                  type="color"
                  id="backgroundColor"
                  title="Scegli il colore di sfondo"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={onInputChange}
                  className="form-control-color mx-auto shadow-sm"
                  style={{ 
                    width: '100%', 
                    height: '50px',
                    cursor: 'pointer',
                    border: '3px solid #e9ecef'
                  }}
                />
                <small className="text-muted mt-2 d-block font-monospace">
                  {formData.backgroundColor}
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-2 h-100 transition-all" style={{ 
              borderColor: formData.primaryColor,
              transition: 'all 0.3s ease'
            }}>
              <Card.Body className="text-center p-4">
                <div 
                  className="rounded-circle mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    backgroundColor: formData.primaryColor,
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <i className="bi bi-star-fill text-white fs-3"></i>
                </div>
                <Form.Label className="fw-bold text-secondary mb-2 d-block">
                  Colore Primario
                </Form.Label>
                <Form.Control
                  type="color"
                  id="primaryColor"
                  title="Scegli il colore primario"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={onInputChange}
                  className="form-control-color mx-auto shadow-sm"
                  style={{ 
                    width: '100%', 
                    height: '50px',
                    cursor: 'pointer',
                    border: '3px solid #e9ecef'
                  }}
                />
                <small className="text-muted mt-2 d-block font-monospace">
                  {formData.primaryColor}
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-2 h-100 transition-all" style={{ 
              borderColor: formData.secondaryColor,
              transition: 'all 0.3s ease'
            }}>
              <Card.Body className="text-center p-4">
                <div 
                  className="rounded-circle mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    backgroundColor: formData.secondaryColor,
                    border: '4px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <i className="bi bi-droplet-fill text-white fs-3"></i>
                </div>
                <Form.Label className="fw-bold text-secondary mb-2 d-block">
                  Colore Secondario
                </Form.Label>
                <Form.Control
                  type="color"
                  id="secondaryColor"
                  title="Scegli il colore secondario"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={onInputChange}
                  className="form-control-color mx-auto shadow-sm"
                  style={{ 
                    width: '100%', 
                    height: '50px',
                    cursor: 'pointer',
                    border: '3px solid #e9ecef'
                  }}
                />
                <small className="text-muted mt-2 d-block font-monospace">
                  {formData.secondaryColor}
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Anteprima palette */}
        <Card className="bg-light border-0 mt-4">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center justify-content-between">
              <span className="text-muted small fw-semibold">
                <i className="bi bi-eye-fill me-2"></i>Anteprima Palette
              </span>
              <div className="d-flex gap-2">
                <div 
                  className="rounded shadow-sm"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: formData.backgroundColor 
                  }}
                  title="Background"
                ></div>
                <div 
                  className="rounded shadow-sm"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: formData.primaryColor 
                  }}
                  title="Primario"
                ></div>
                <div 
                  className="rounded shadow-sm"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: formData.secondaryColor 
                  }}
                  title="Secondario"
                ></div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
}