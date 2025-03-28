import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";

/**
 * Pagina di login
 *
 * @returns {React.ReactElement}  Pagina Login.
 */
export default function Login() {
  return (
    <>
      <h1>Login</h1>

      <Row>
        <Link to="/event/evento-test6">Selfie upload</Link>

        <Link to="/personal">Area personale</Link>

        <Link to="/processing-selfie">Foto selfie</Link>

        <Link to="/processing-photos">Foto processing</Link>

        <Link to="/purchased">Foto appena acquistate</Link>

        <Link to="/admin">Admin</Link>

        <Link to="/admin/create-event">Crea evento</Link>
      </Row>
    </>
  );
}
