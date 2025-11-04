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
  IonList,
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
import type { BikeType } from "../../services/reservations.service";
import StationMap from "../../components/StationMap";

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
    error,
    geoError,
    createReservation,
    cancelReservation,
    setError,
  } = useReservation();

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [creatingType, setCreatingType] = useState<BikeType | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

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

  useEffect(() => {
    if (error) {
      setErrorToast(error);
    }
  }, [error]);

  const anyAvailable = useMemo(() => {
    if (!nearestStation) return false;
    return (
      nearestStation.availableMechanical + nearestStation.availableElectric > 0
    );
  }, [nearestStation]);

  async function handleReserveClick(bikeType: BikeType) {
    if (!nearestStation) return;
    if (activeReservation) {
      const msg = "Ya tienes una reserva activa.";
      setError(msg);
      setErrorToast(msg);
      return;
    }

    try {
      setCreatingType(bikeType);
      setError(null);
      const reservation = await createReservation(nearestStation.id, bikeType);
      setSuccessMessage(
        `Reserva creada en ${reservation.stationName}. Tienes 10 minutos para llegar.`
      );
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "No se pudo crear la reserva. Intenta de nuevo.";
      setError(message);
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
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : "No se pudo cancelar la reserva. Intenta de nuevo.";
      setError(message);
      setErrorToast(message);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="ion-padding">
      <IonList inset={true}>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Reserva de bicicleta</IonCardSubtitle>
            <IonCardTitle>Estado de tu reserva</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loadingReservation ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IonSpinner name="dots" />
                <IonText>Cargando reserva activa...</IonText>
              </div>
            ) : activeReservation ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <IonBadge color="success">Activa</IonBadge>
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
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                <IonText>
                  Actualmente no tienes ninguna reserva activa. Busca la
                  estación más cercana y reserva tu bicicleta antes de llegar.
                </IonText>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Estación más cercana</IonCardSubtitle>
            <IonCardTitle>
              <IonIcon icon={locationOutline} style={{ marginRight: 6 }} />
              Cerca de ti
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loadingNearest ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IonSpinner name="dots" />
                <IonText>Buscando estaciones cercanas...</IonText>
              </div>
            ) : nearestStation ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <IonText>
                    <strong>{nearestStation.name}</strong>
                  </IonText>
                  <IonBadge color="primary">
                    {nearestStation.type === "Residential"
                      ? "Residencial"
                      : nearestStation.type === "Metro"
                      ? "Metro"
                      : "Centro Financiero"}
                  </IonBadge>
                  <IonBadge color="medium">
                    {(nearestStation.distanceMeters / 1000).toFixed(2)} km
                  </IonBadge>
                </div>

                <IonText color="medium">
                  Capacidad: {nearestStation.capacity} · Disponibles:{" "}
                  {nearestStation.availableMechanical} mecánicas ·{" "}
                  {nearestStation.availableElectric} eléctricas.
                </IonText>

                <StationMap
                  stationName={nearestStation.name}
                  latitude={nearestStation.latitude}
                  longitude={nearestStation.longitude}
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
                      !!activeReservation ||
                      nearestStation.availableMechanical === 0
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
                      !!activeReservation ||
                      nearestStation.availableElectric === 0
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
                No pudimos encontrar estaciones cercanas.{" "}
                {geoError
                  ? `Detalle: ${geoError}`
                  : "Intenta nuevamente o revisa el mapa de estaciones."}
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {error ? (
          <IonText color="danger" class="ion-padding-start">
            Error: {error}
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
