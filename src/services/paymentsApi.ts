import type { PaymentMethod } from '../types/payment';

const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL) as string || '';

function getAuthHeader(): HeadersInit {
  // Some parts of the app store the JWT under 'auth_token' (login flow),
  // others may use 'token'. Check both for compatibility.
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getToken(): string | null {
  return localStorage.getItem('auth_token') || localStorage.getItem('token');
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload || typeof payload.exp !== 'number') return false;
    // exp is in seconds
    return Date.now() / 1000 >= payload.exp;
  } catch {
    return true;
  }
}

export interface RegisterPaymentMethodInput {
  paymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  setAsDefault: boolean;
}

/**
 * POST /api/pagos/metodo
 * Body: CreatePaymentMethodDto
 * Response: { message: string } or 400 { message: 'PAYMENT_METHOD_REJECTED'|'ALREADY_EXISTS' }
 */
export async function registerPaymentMethod(input: RegisterPaymentMethodInput): Promise<{ message: string }> {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error('UNAUTHORIZED');
  }
  const body = {
    type: 'CARD',
    stripePaymentMethodId: input.paymentMethodId,
    brand: input.brand,
    last4: input.last4,
    expMonth: input.expMonth,
    expYear: input.expYear,
    setAsDefault: input.setAsDefault,
  };

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };

  const res = await fetch(`${API_BASE}/api/pagos/metodo`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const payload = await res.json().catch(() => ({ message: 'ERROR_INTERNAL' }));

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('UNAUTHORIZED');
    }
    // Backend returns meaningful messages in payload.message
    throw new Error(payload.message || 'ERROR_INTERNAL');
  }

  return payload as { message: string };
}

/**
 * GET /api/pagos/metodo
 * Response: { data: PaymentMethod[] }
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error('UNAUTHORIZED');
  }
  const res = await fetch(`${API_BASE}/api/pagos/metodo`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('UNAUTHORIZED');
    }
    const payload = await res.json().catch(() => ({ message: 'ERROR_INTERNAL' }));
    throw new Error(payload.message || 'ERROR_INTERNAL');
  }

  const payload = await res.json();
  return (payload && payload.data) as PaymentMethod[];
}

/**
 * PATCH /api/pagos/metodo/:id
 * Purpose: mark as default
 */
export async function setDefaultPaymentMethod(id: number): Promise<void> {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error('UNAUTHORIZED');
  }
  const res = await fetch(`${API_BASE}/api/pagos/metodo/${id}`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: 'ERROR_INTERNAL' }));
    throw new Error(payload.message || 'ERROR_INTERNAL');
  }
}

/**
 * DELETE /api/pagos/metodo/:id
 */
export async function deletePaymentMethod(id: number): Promise<{ message?: string }> {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    throw new Error('UNAUTHORIZED');
  }
  const res = await fetch(`${API_BASE}/api/pagos/metodo/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

  const payload = await res.json().catch(() => ({ message: 'ERROR_INTERNAL' }));

  if (!res.ok) {
    throw new Error(payload.message || 'ERROR_INTERNAL');
  }

  // return server message (if any) so UI can show it
  return payload as { message?: string };
}
