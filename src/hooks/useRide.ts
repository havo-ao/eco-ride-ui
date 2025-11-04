import { useCallback, useEffect, useState } from "react";
import {
  getActiveRide as getActiveRideApi,
  startRide as startRideApi,
  endRide as endRideApi,
  type Ride,
  type StartRideInput,
  type EndRideInput,
} from "../services/rides.service";

export default function useRide() {
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshActiveRide = useCallback(async () => {
    try {
      setLoading(true);
      const ride = await getActiveRideApi();
      setActiveRide(ride);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error al consultar el viaje activo";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshActiveRide();
  }, [refreshActiveRide]);

  const startRide = useCallback(async (input: StartRideInput) => {
    setError(null);
    const ride = await startRideApi(input);
    setActiveRide(ride);
    return ride;
  }, []);

  const endRide = useCallback(async (rideId: number, input: EndRideInput) => {
    setError(null);
    const ride = await endRideApi(rideId, input);
    setActiveRide(ride.status === "Active" ? ride : null);
    return ride;
  }, []);

  return {
    activeRide,
    loading,
    error,
    startRide,
    endRide,
    refreshActiveRide,
    setError,
  };
}
