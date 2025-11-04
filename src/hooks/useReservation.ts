import { useCallback, useEffect, useState } from "react";
import type { Reservation, BikeType } from "../services/reservations.service";
import {
  createReservation as createReservationApi,
  getActiveReservation as getActiveReservationApi,
  cancelReservation as cancelReservationApi,
} from "../services/reservations.service";
import type { NearestStationResponse } from "../services/stations.service";
import { getNearestStation } from "../services/stations.service";

export default function useReservation() {
  const [activeReservation, setActiveReservation] =
    useState<Reservation | null>(null);
  const [nearestStation, setNearestStation] =
    useState<NearestStationResponse | null>(null);
  const [loadingReservation, setLoadingReservation] = useState(false);
  const [loadingNearest, setLoadingNearest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const refreshActiveReservation = useCallback(async () => {
    try {
      setLoadingReservation(true);
      const res = await getActiveReservationApi();
      setActiveReservation(res);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Error al consultar la reserva activa";
      setError(message);
    } finally {
      setLoadingReservation(false);
    }
  }, []);

  useEffect(() => {
    void refreshActiveReservation();
  }, [refreshActiveReservation]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoError(
        "No pudimos acceder a tu ubicación. Revisa el listado de estaciones."
      );
      return;
    }

    setLoadingNearest(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const station = await getNearestStation(
            position.coords.latitude,
            position.coords.longitude
          );
          setNearestStation(station);
        } catch (e) {
          const message =
            e instanceof Error
              ? e.message
              : "Error al buscar estaciones cercanas";
          setError(message);
        } finally {
          setLoadingNearest(false);
        }
      },
      (err) => {
        setGeoError(err.message || "No pudimos obtener tu ubicación actual.");
        setLoadingNearest(false);
      }
    );
  }, []);

  const createReservation = useCallback(
    async (stationId: number, bikeType?: BikeType) => {
      setError(null);
      const res = await createReservationApi({ stationId, bikeType });
      setActiveReservation(res);
      return res;
    },
    []
  );

  const cancelReservation = useCallback(async (reservationId: number) => {
    setError(null);
    const res = await cancelReservationApi(reservationId);
    setActiveReservation(null);
    return res;
  }, []);

  return {
    activeReservation,
    nearestStation,
    loadingReservation,
    loadingNearest,
    error,
    geoError,
    createReservation,
    cancelReservation,
    refreshActiveReservation,
    setError,
  };
}
