import { IonCard, IonCardContent, IonText } from "@ionic/react";

type Props = {
  stationName: string;
  latitude: number;
  longitude: number;
};

export default function StationMap({
  stationName,
  latitude,
  longitude,
}: Props) {
  return (
    <IonCard>
      <IonCardContent>
        <div
          style={{
            width: "100%",
            height: 220,
            borderRadius: 12,
            background: "var(--ion-color-light)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: 12,
            boxSizing: "border-box",
          }}
        >
          <IonText>
            <h2 style={{ marginBottom: 8 }}>Estación más cercana</h2>
          </IonText>
          <IonText>
            <p style={{ margin: 0, fontWeight: 500 }}>{stationName}</p>
          </IonText>
          <IonText color="medium">
            <p style={{ margin: 4 }}>
              Lat: {latitude.toFixed(5)} · Lng: {longitude.toFixed(5)}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>
              Aquí se integrará el mapa con Google Maps API.
            </p>
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
}
