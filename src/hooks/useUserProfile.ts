import { useCallback, useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/userProfile.service';
import type { UserProfileResponse } from '../services/userProfile.types';
import type { ApiError } from '../services/userProfile.service';

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token') || localStorage.getItem('token') || null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey(k => k + 1), []);

  useEffect(() => {
    let mounted = true;
    const token = getAuthToken();

    if (!token) {
      const e = new Error('No autenticado') as ApiError;
      e.status = 401;
      setError(e);
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchUserProfile(token)
      .then(data => {
        if (!mounted) return;
        setProfile(data);
      })
      .catch((err: ApiError) => {
        if (!mounted) return;
        setError(err);
        setProfile(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => { mounted = false; };
  }, [reloadKey]);

  return { profile, loading, error, reload } as const;
}
