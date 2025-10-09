import { Form, Row, Col } from "react-bootstrap";
import Logo from "../../../components/Logo";

/**
 * Componente per la gestione del logo dell'evento
 */
export function EventLogo({ formData, receivedComp, onFileChange }) {
  /**
   * Determina il src dell'immagine da mostrare
   */
  const getLogoSrc = () => {
    if (formData.logo && formData.logo instanceof File) {
      return URL.createObjectURL(formData.logo);
    }
    
    if (receivedComp?.logo) {
      return `${import.meta.env.VITE_API_URL}/${receivedComp.logo}`;
    }
    
    return "/public/images/noimage.jpg";
  };

  return (
    <Row>
      <Col xs={6} className="my-4">
        <Logo src={getLogoSrc()} css="mb-sm" />
      </Col>

      <Col xs={6}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Logo</Form.Label>
          <Form.Control
            onChange={onFileChange}
            type="file"
            accept="image/*"
          />
        </Form.Group>
      </Col>
    </Row>
  );
}