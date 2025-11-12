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
    let code = "";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") {
        msg = data.message;
        code = data.code || "";
      }
    } catch {
      // ignoramos error al parsear JSON
    }
    const error = new Error(msg) as any;
    error.code = code; // ✅ Agregamos el código
    throw error;
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
    let code = "";
    try {
      const data = await res.json();
      if (typeof data?.message === "string") {
        msg = data.message;
        code = data.code || "";
      }
    } catch {
      // ignoramos error al parsear JSON
    }
    const error = new Error(msg) as any;
    error.code = code; // ✅ Agregamos el código
    throw error;
  }

  const data = (await res.json()) as T;
  return data;
}