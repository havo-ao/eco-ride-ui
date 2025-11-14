export type FineStatus = 'PENDING' | 'PAID' | 'CANCELLED';
// `status` puede variar según la BD (ej. 'Completed', 'Active', 'Cancelled').
// Usamos `string` para aceptar esos valores reales del backend.
export type RideStatus = string;

export interface UserProfileFine {
  id: number;
  amount: number;
  reason: string;
  status: FineStatus;
  createdAt: string; // ISO 8601
}

export interface UserProfileRide {
  id: number;
  startTime: string; // ISO 8601
  endTime: string | null;
  durationMinutes: number | null;
  status: RideStatus;
}

export interface UserProfileResponse {
  userId: number;
  fullName: string;
  email: string;
  balance: number;
  fines: UserProfileFine[];
  lastRides: UserProfileRide[];
}
