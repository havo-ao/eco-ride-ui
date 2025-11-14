/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonToast,
} from "@ionic/react";
import {
  bicycleOutline,
  timeOutline,
  locationOutline,
  warningOutline,
} from "ionicons/icons";
import useReservation from "../../hooks/useReservation";
import useRide from "../../hooks/useRide";
import type { BikeType } from "../../services/reservations.service";
import StationMap from "../../components/StationMap";

import {
  getStationsWithAvailability,
  type StationWithAvailability,
} from "../../services/stations.service";

function formatRemaining(seconds: number | null): string {
  if (seconds === null || seconds < 0) return "--:--";
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  const mm = m < 10 ? `0${m}` : String(m);
  const ss = s < 10 ? `0${s}` : String(s);
  return `${mm}:${ss}`;
}

export default function RidesPage() {
  const {
    activeReservation,
    nearestStation,
    loadingReservation,
    loadingNearest,
    error: reservationError,
    geoError,
    createReservation,
    cancelReservation,
    refreshActiveReservation,
    setError: setReservationError,
  } = useReservation();

  const {
    activeRide,
    loading: loadingRide,
    error: rideError,
    startRide,
    endRide,
    setError: setRideError,
  } = useRide();

  const [stations, setStations] = useState<StationWithAvailability[]>([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<number | null>(
    null
  );

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [creatingType, setCreatingType] = useState<BikeType | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [arrivalBikeId, setArrivalBikeId] = useState("");

  const [destinationStationId, setDestinationStationId] = useState<
    number | null
  >(null);
  const [endingRide, setEndingRide] = useState(false);

  const hasActiveRide = !!activeRide;
  const hasActiveReservation = !!activeReservation && !hasActiveRide;

  // Cargar estaciones con disponibilidad
  useEffect(() => {
    async function loadStations() {
      try {
        setLoadingStations(true);
        const list = await getStationsWithAvailability();
        setStations(list);
        if (!selectedStationId && list.length > 0) {
          setSelectedStationId(list[0].id);
        }
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : "Error al cargar las estaciones disponibles.";
        setReservationError(msg);
        setErrorToast(msg);
      } finally {
        setLoadingStations(false);
      }
    }

    void loadStations();
  }, []);

  // Contador de expiración de reserva
  useEffect(() => {
    if (!activeReservation) {
      setRemainingSeconds(null);
      return;
    }
    const expiresAtTime = new Date(activeReservation.expiresAt).getTime();

    const tick = () => {
      const now = Date.now();
      const diffSeconds = Math.round((expiresAtTime - now) / 1000);
      setRemainingSeconds(diffSeconds);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [activeReservation]);

  // Sincronizar errores en toast
  useEffect(() => {
    if (reservationError) {
      setErrorToast(reservationError);
    }
  }, [reservationError]);

  useEffect(() => {
    if (rideError) {
      setErrorToast(rideError);
    }
  }, [rideError]);

  // Estación seleccionada: la elegida o la más cercana si no hay selección
  const stationForReservation = useMemo(() => {
    if (selectedStationId) {
      const found = stations.find((s) => s.id === selectedStationId);
      if (found) return found;
    }
    if (nearestStation) return nearestStation;
    return null;
  }, [selectedStationId, stations, nearestStation]);

  const anyAvailable = useMemo(() => {
    if (!stationForReservation) return false;
    return (
      stationForReservation.availableMechanical +
        stationForReservation.availableElectric >
      0
    );
  }, [stationForReservation]);

  async function handleReserveClick(bikeType: BikeType) {
    if (!stationForReservation) return;
    if (activeReservation) {
      const msg = "Ya tienes una reserva activa.";
      setReservationError(msg);
      setErrorToast(msg);
      return;
    }
    if (hasActiveRide) {
      const msg = "No puedes reservar mientras tienes un viaje activo.";
      setReservationError(msg);
      setErrorToast(msg);
      return;
    }

    try {
      setCreatingType(bikeType);
      setReservationError(null);
      const reservation = await createReservation(
        stationForReservation.id,
        bikeType
      );
      setSuccessMessage(
        `Reserva creada en ${reservation.stationName}. Tienes 10 minutos para llegar.`
      );
      setArrivalBikeId("");
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "No se pudo crear la reserva. Intenta de nuevo.";
      setReservationError(message);
      setErrorToast(message);
    } finally {
      setCreatingType(null);
    }
  }

  async function handleCancelReservation() {
    if (!activeReservation) return;
    try {
      setCancelling(true);
      await cancelReservation(activeReservation.id);
      setSuccessMessage("Tu reserva ha sido cancelada.");
      setArrivalBikeId("");
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "No se pudo cancelar la reserva. Intenta de nuevo.";
      setReservationError(message);
      setErrorToast(message);
    } finally {
      setCancelling(false);
    }
  }

  // Confirmar bici + iniciar viaje en un solo paso
  async function handleConfirmAndStartRide() {
    if (!activeReservation) return;

    if (activeReservation.bikeId == null) {
      const msg =
        "La reserva activa no tiene ID de bicicleta. Verifica que la API esté devolviendo 'bikeId' o 'bike_id'.";
      console.error("activeReservation sin bikeId:", activeReservation);
      setReservationError(msg);
      setErrorToast(msg);
      return;
    }

    const expectedId = String(activeReservation.bikeId);
    const enteredId = arrivalBikeId.trim();

    if (enteredId !== expectedId) {
      console.log("Entered: ", enteredId, " vs expected: ", expectedId);
      const msg = `La bicicleta reservada es la #${expectedId}. Verifica el número en la estación.`;
      setReservationError(msg);
      setErrorToast(msg);
      return;
    }

    try {
      setRideError(null);

      await startRide({
        reservationId: activeReservation.id,
        bikeId: activeReservation.bikeId,
      });

      // La reserva deja de estar activa; refrescamos estado desde backend
      await refreshActiveReservation();

      setSuccessMessage("Tu viaje ha comenzado. ¡Buen recorrido!");
      setArrivalBikeId("");
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "No se pudo iniciar el viaje. Intenta de nuevo.";
      setRideError(message);
      setErrorToast(message);
    }
  }

  // Finalizar viaje
  async function handleEndRide() {
    if (!activeRide || !destinationStationId) return;
    try {
      setEndingRide(true);
      setRideError(null);
      await endRide(activeRide.id, { destinationStationId });
      setSuccessMessage("Tu viaje ha finalizado correctamente.");
      setDestinationStationId(null);
      setArrivalBikeId("");
      // Por si el backend, después de finalizar, permite nuevas reservas
      await refreshActiveReservation();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "No se pudo finalizar el viaje. Intenta de nuevo.";
      setRideError(message);
      setErrorToast(message);
    } finally {
      setEndingRide(false);
    }
  }

  return (
    <div style={{ maxWidth: 1080, margin: "auto" }}>
      <IonList inset={true}>
        {/* BLOQUE 1: Reserva o viaje activo */}
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Reserva y viaje</IonCardSubtitle>
            <IonCardTitle>
              {hasActiveRide ? "Viaje activo" : "Estado de tu reserva"}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loadingReservation || loadingRide ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IonSpinner name="dots" />
                <IonText>Cargando información...</IonText>
              </div>
            ) : hasActiveRide && activeRide ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <IonBadge color="success">Viaje activo</IonBadge>
                  <IonText>
                    <strong>{activeRide.originStationName}</strong>
                  </IonText>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <IonIcon icon={bicycleOutline} />
                    <IonText>Bici #{activeRide.bikeId}</IonText>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <IonIcon icon={timeOutline} />
                    <IonText>
                      Inicio:{" "}
                      {new Date(activeRide.startTime).toLocaleTimeString()}
                    </IonText>
                  </div>
                </div>

                <IonText color="medium">
                  Cuando llegues a tu destino, selecciona la estación donde vas
                  a dejar la bicicleta y finaliza el viaje.
                </IonText>

                <IonItem lines="full">
                  <IonSelect
                    label="Estación de destino"
                    labelPlacement="floating"
                    value={destinationStationId}
                    onIonChange={(e) =>
                      setDestinationStationId(
                        e.detail.value === undefined
                          ? null
                          : (e.detail.value as number)
                      )
                    }
                    interface="popover"
                  >
                    {stations.map((s) => (
                      <IonSelectOption key={s.id} value={s.id}>
                        {s.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <IonButton
                    color="primary"
                    expand="block"
                    onClick={handleEndRide}
                    disabled={!destinationStationId || endingRide}
                  >
                    {endingRide ? (
                      <IonSpinner name="dots" />
                    ) : (
                      "Finalizar viaje"
                    )}
                  </IonButton>
                </div>
              </div>
            ) : hasActiveReservation && activeReservation ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <IonBadge color="success">Reserva activa</IonBadge>
                  <IonText>
                    <strong>{activeReservation.stationName}</strong>
                  </IonText>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <IonIcon icon={bicycleOutline} />
                    <IonText>
                      Bici #{activeReservation.bikeId} ·{" "}
                      {activeReservation.bikeType === "Mechanical"
                        ? "Mecánica"
                        : "Eléctrica"}
                    </IonText>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <IonIcon icon={timeOutline} />
                    <IonText>
                      Expira en:{" "}
                      <strong>{formatRemaining(remainingSeconds)}</strong>
                    </IonText>
                  </div>
                </div>

                <IonText color="medium">
                  Tienes 10 minutos desde la creación de la reserva para llegar
                  a la estación. Si no llegas a tiempo, la bicicleta vuelve a
                  estar disponible.
                </IonText>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <IonButton
                    color="medium"
                    fill="outline"
                    onClick={handleCancelReservation}
                    disabled={cancelling}
                  >
                    {cancelling ? (
                      <IonSpinner name="dots" />
                    ) : (
                      "Cancelar reserva"
                    )}
                  </IonButton>
                </div>

                {/* ¿Ya llegaste? – confirmación de bici + inicio de viaje */}
                <IonCard color="light">
                  <IonCardHeader>
                    <IonCardSubtitle>¿Ya llegaste?</IonCardSubtitle>
                    <IonCardTitle>Confirma tu bicicleta</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText color="medium">
                      Ingresa el ID de la bicicleta que ves en la estación para
                      confirmar que estás tomando la que reservaste e iniciar tu
                      viaje.
                    </IonText>

                    <IonItem lines="full" className="ion-margin-top">
                      <IonInput
                        label="ID de la bicicleta"
                        labelPlacement="floating"
                        type="number"
                        value={arrivalBikeId}
                        onIonInput={(e) =>
                          setArrivalBikeId(e.detail.value ?? "")
                        }
                      />
                    </IonItem>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 12,
                      }}
                    >
                      <IonButton
                        expand="block"
                        color="primary"
                        onClick={handleConfirmAndStartRide}
                        disabled={!arrivalBikeId.trim()}
                      >
                        Confirmar e iniciar viaje
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                <IonText>
                  Actualmente no tienes ninguna reserva ni viaje activo. Elige
                  una estación y reserva tu bicicleta antes de llegar.
                </IonText>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        {/* BLOQUE 2: Estación para reservar (seleccionable) */}
        {!activeReservation && !activeRide && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>Estación para reservar</IonCardSubtitle>
              <IonCardTitle>
                <IonIcon icon={locationOutline} style={{ marginRight: 6 }} />
                Cerca de ti o seleccionada
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {loadingNearest || loadingStations ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <IonSpinner name="dots" />
                  <IonText>Cargando estaciones...</IonText>
                </div>
              ) : stationForReservation ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <IonItem lines="full">
                    <IonSelect
                      label="Estación"
                      labelPlacement="floating"
                      value={selectedStationId ?? stationForReservation.id}
                      onIonChange={(e) =>
                        setSelectedStationId(
                          e.detail.value === undefined
                            ? null
                            : (e.detail.value as number)
                        )
                      }
                      interface="popover"
                    >
                      {stations.map((s) => (
                        <IonSelectOption key={s.id} value={s.id}>
                          {s.name}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <IonText>
                      <strong>{stationForReservation.name}</strong>
                    </IonText>
                    <IonBadge color="primary">
                      {stationForReservation.type === "Residential"
                        ? "Residencial"
                        : stationForReservation.type === "Metro"
                        ? "Metro"
                        : "Centro Financiero"}
                    </IonBadge>
                    {nearestStation &&
                    stationForReservation.id === nearestStation.id ? (
                      <IonBadge color="success">Más cercana</IonBadge>
                    ) : null}
                  </div>

                  <IonText color="medium">
                    Capacidad: {stationForReservation.capacity} · Disponibles:{" "}
                    {stationForReservation.availableMechanical} mecánicas ·{" "}
                    {stationForReservation.availableElectric} eléctricas.
                  </IonText>

                  <StationMap
                    stationName={stationForReservation.name}
                    latitude={stationForReservation.latitude}
                    longitude={stationForReservation.longitude}
                  />

                  {!anyAvailable && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 4,
                      }}
                    >
                      <IonIcon icon={warningOutline} color="warning" />
                      <IonText color="warning">
                        No hay bicicletas disponibles en esta estación en este
                        momento.
                      </IonText>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <IonButton
                      expand="block"
                      onClick={() => handleReserveClick("Mechanical")}
                      disabled={
                        creatingType !== null ||
                        hasActiveReservation ||
                        hasActiveRide ||
                        stationForReservation.availableMechanical === 0
                      }
                    >
                      {creatingType === "Mechanical" ? (
                        <IonSpinner name="dots" />
                      ) : (
                        "Reservar bicicleta mecánica"
                      )}
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="tertiary"
                      onClick={() => handleReserveClick("Electric")}
                      disabled={
                        creatingType !== null ||
                        hasActiveReservation ||
                        hasActiveRide ||
                        stationForReservation.availableElectric === 0
                      }
                    >
                      {creatingType === "Electric" ? (
                        <IonSpinner name="dots" />
                      ) : (
                        "Reservar bicicleta eléctrica"
                      )}
                    </IonButton>
                  </div>
                </div>
              ) : (
                <IonText>
                  No pudimos encontrar estaciones.{" "}
                  {geoError
                    ? `Detalle: ${geoError}`
                    : "Intenta nuevamente o revisa el listado de estaciones."}
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {reservationError || rideError ? (
          <IonText color="danger" class="ion-padding-start">
            Error: {reservationError ?? rideError}
          </IonText>
        ) : null}
      </IonList>

      <IonToast
        isOpen={!!successMessage}
        message={successMessage ?? ""}
        duration={1500}
        color="success"
        position="top"
        onDidDismiss={() => setSuccessMessage(null)}
      />

      <IonToast
        isOpen={!!errorToast}
        message={errorToast ?? ""}
        duration={2000}
        color="danger"
        position="top"
        onDidDismiss={() => setErrorToast(null)}
      />
    </div>
  );
}
