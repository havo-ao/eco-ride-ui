/* eslint-disable react-refresh/only-export-components */
import { Navigate, useLocation, type Location } from "react-router-dom";

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token");
}

type FromState = { from?: Location };

function isFromState(state: unknown): state is FromState {
  if (state && typeof state === "object") {
    const s = state as Record<string, unknown>;
    const from = s["from"];
    if (from && typeof from === "object") {
      const f = from as Record<string, unknown>;
      return typeof f["pathname"] === "string";
    }
  }
  return false;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (isAuthenticated()) {
    const to = isFromState(location.state)
      ? location.state.from?.pathname
      : "/home";
    return <Navigate to={to ?? "/home"} replace />;
  }
  return <>{children}</>;
}
