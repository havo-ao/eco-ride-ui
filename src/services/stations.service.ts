import { apiGet } from "./apiClient";

export type StationType = "Residential" | "Metro" | "Financial Center";

export type Station = {
  id: string;
  name: string;
  bikes: number;
  capacity: number;
};

export type StationWithAvailability = {
  id: number;
  name: string;
  type: StationType;
  capacity: number;
  availableMechanical: number;
  availableElectric: number;
  latitude: number;
  longitude: number;
};

export type NearestStationResponse = StationWithAvailability & {
  distanceMeters: number;
};

export function getStations(): Promise<Station[]> {
  return apiGet<Station[]>("/api/stations");
}

export async function getNearestStation(
  lat: number,
  lng: number
): Promise<NearestStationResponse | null> {
  const query = `lat=${encodeURIComponent(
    String(lat)
  )}&lng=${encodeURIComponent(String(lng))}`;
  return apiGet<NearestStationResponse | null>(
    `/api/stations/nearest?${query}`
  );
}

export function getStationsWithAvailability(): Promise<
  StationWithAvailability[]
> {
  return apiGet<StationWithAvailability[]>("/api/stations/with-availability");
}
