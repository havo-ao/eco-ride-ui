import type { UserProfileResponse } from './userProfile.types';

export interface ApiError extends Error {
  status: number;
  code?: string;
}

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchUserProfile(token: string | null): Promise<UserProfileResponse> {
  const base = import.meta.env.VITE_API_URL ?? '';
  const res = await fetch(`${base}/api/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 200) {
    const body = await res.json();
    return body as UserProfileResponse;
  }

  const body = await parseJsonSafe(res);

  if (res.status === 401) {
    const err = new Error((body && (body.message || 'No autenticado')) || 'No autenticado') as ApiError;
    err.status = 401;
    throw err;
  }

  if (res.status === 404) {
    const err = new Error((body && (body.message || 'USER_NOT_FOUND')) || 'USER_NOT_FOUND') as ApiError;
    err.status = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  const err = new Error((body && (body.message || 'ERROR_INTERNAL')) || 'ERROR_INTERNAL') as ApiError;
  err.status = res.status || 500;
  err.code = 'ERROR_INTERNAL';
  throw err;
}
