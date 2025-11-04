import { apiGet, apiPost } from "./apiClient";

export type BikeType = "Mechanical" | "Electric";

export type ReservationStatus = "Active" | "Expired" | "Cancelled";

export type Reservation = {
  id: number;
  userId: number;
  bikeId: number;
  stationId: number;
  stationName: string;
  bikeType: BikeType;
  reservedAt: string; // ISO
  expiresAt: string; // ISO (reserved_at + 10 min)
  status: ReservationStatus;
};

export type CreateReservationInput = {
  stationId: number;
  bikeType?: BikeType;
};

export async function createReservation(
  input: CreateReservationInput
): Promise<Reservation> {
  return apiPost<Reservation>("/api/reservations", input);
}

export async function getActiveReservation(): Promise<Reservation | null> {
  return apiGet<Reservation | null>("/api/reservations/active");
}

export async function cancelReservation(
  reservationId: number
): Promise<Reservation> {
  return apiPost<Reservation>(`/api/reservations/${reservationId}/cancel`, {});
}
