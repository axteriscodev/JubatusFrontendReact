// Loader React Router per il dettaglio reader admin. Stessa guardia di AdminPanel.loader.
import { redirect } from 'react-router-dom';
import { isAdmin } from '@common/utils/auth';
import type { LoaderFunction } from 'react-router-dom';

export const loader: LoaderFunction = () => {
  if (!isAdmin()) {
    return redirect('/');
  }
  return null;
};
