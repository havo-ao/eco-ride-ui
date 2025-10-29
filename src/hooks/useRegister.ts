import { useState } from "react";
import type { RegisterInput } from "../services/users.service";
import { registerUser } from "../services/users.service";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(input: RegisterInput) {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(input);
      return res;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, setError };
}
