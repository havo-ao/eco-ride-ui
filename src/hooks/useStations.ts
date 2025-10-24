import { useEffect, useState } from "react";
import { getStations } from "../services/stations.service";

type Station = { id: string; name: string; bikes: number; capacity: number };

export default function useStations() {
  const [data, setData] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStations()
      .then(setData)
      .catch((e) => setError(e?.message ?? "Error"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
