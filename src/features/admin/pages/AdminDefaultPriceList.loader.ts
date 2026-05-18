import { redirect } from 'react-router-dom';
import { isOrganizationAdmin } from '@common/utils/auth';
import type { LoaderFunction } from 'react-router-dom';

// Accessibile solo agli admin di organizzazione (canManageEvents con pieno accesso)
export const loader: LoaderFunction = () => {
  if (!isOrganizationAdmin()) {
    return redirect('/');
  }
  return null;
};
