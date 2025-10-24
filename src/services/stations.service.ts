import { apiGet } from "./apiClient";

type Station = { id: string; name: string; bikes: number; capacity: number };

export function getStations(): Promise<Station[]> {
  // backend: GET /api/stations
  return apiGet<Station[]>("/api/stations");
}
