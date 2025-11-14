import { apiGet, apiPost } from "./apiClient";

export function getBalance() {
  return apiGet<{ balance: number }>("/api/loyalty/balance");
}

export function getHistory() {
  return apiGet<Array<{ description: string; points: number; created_at: string }>>("/api/loyalty/history");
}

export function redeemPoints(points: number) {
  return apiPost<{ balance: number; discount?: string }>("/api/loyalty/redeem", { points });
}