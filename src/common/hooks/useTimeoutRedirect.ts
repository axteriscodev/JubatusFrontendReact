import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimeoutRedirectOptions {
  replace?: boolean;
  onTimeout?: () => void;
}

export function useTimeoutRedirect(
  path: string,
  delayMs: number,
  options: TimeoutRedirectOptions = {},
) {
  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      options.onTimeout?.();
      navigate(path, { replace: options.replace ?? false });
    }, delayMs);

    return () => clearTimeout(timeOut);
  }, []);
}
