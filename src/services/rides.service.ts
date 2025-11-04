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
  startTime: string;
  endTime: string | null;
  status: RideStatus;
};

export type StartRideInput = {
  reservationId: number;
  bikeId: number;
};

export type EndRideInput = {
  destinationStationId: number;
};

export async function getActiveRide(): Promise<Ride | null> {
  return apiGet<Ride | null>("/api/rides/active");
}

export async function startRide(input: StartRideInput): Promise<Ride> {
  return apiPost<Ride>("/api/rides/start", input);
}

export async function endRide(
  rideId: number,
  input: EndRideInput
): Promise<Ride> {
  return apiPost<Ride>(`/api/rides/${rideId}/end`, input);
}
