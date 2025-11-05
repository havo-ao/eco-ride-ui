const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...getAuthHeaders(),
    } as HeadersInit,
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.message === "string") {
        msg = data.message;
      }
    } catch {
      // ignoramos error al parsear JSON
    }
    throw new Error(msg);
  }

  const data = (await res.json()) as T;
  return data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    } as HeadersInit,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let msg = "Error de servidor";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") {
        msg = data.message;
      }
    } catch {
      
    }
    throw new Error(msg);
  }
  if (res.status === 204 || res.status === 201) {
    return undefined as T;
  }

  const data = (await res.json()) as T;
  return data;
}
