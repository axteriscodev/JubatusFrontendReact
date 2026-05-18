// Loader React Router per le pagine admin.
// Reindirizza alla home se l'utente non ha i permessi di admin (JWT assente o level=3).
import { redirect } from 'react-router-dom';
import { isAdmin } from '@common/utils/auth';
import type { LoaderFunction } from 'react-router-dom';

export const loader: LoaderFunction = () => {
  if (!isAdmin()) {
    return redirect('/');
  }
  return null;
};
