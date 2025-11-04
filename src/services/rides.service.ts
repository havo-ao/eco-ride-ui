import { apiGet, apiPost } from "./apiClient";

export type RideStatus = "Active" | "Completed";

export type Ride = {
  id: number;
  userId: number;
  bikeId: number;
  originStationId: number;
  originStationName: string;
  destinationStationId: number | null;
  destinationStationName: string | null;
  startTime: string; // ISO
  endTime: string | null; // ISO
  status: RideStatus;
};

export type StartRideInput = {
  reservationId: number;
  bikeId: number;
};

export type EndRideInput = {
  destinationStationId: number;
};

export function getActiveRide(): Promise<Ride | null> {
  return apiGet<Ride | null>("/api/rides/active");
}

export function startRide(input: StartRideInput): Promise<Ride> {
  return apiPost<Ride>("/api/rides/start", input);
}

export function endRide(rideId: number, input: EndRideInput): Promise<Ride> {
  return apiPost<Ride>(`/api/rides/${rideId}/end`, input);
}
