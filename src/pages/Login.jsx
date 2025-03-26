import { Link } from 'react-router-dom'

/**
 * Pagina di login
 *
 * @returns {React.ReactElement}  Pagina Login.
 */
export default function Login() {
  return (
    <>
      <h1>Login</h1>
      <Link to="/event/evento-test6">Selfie upload</Link>
    </>
  );
}
