import { IonItem, IonLabel, IonBadge } from "@ionic/react";

type Station = { id: string; name: string; bikes: number; capacity: number };

export default function StationCard({ station }: { station: Station }) {
  const free = station.capacity - station.bikes;
  return (
    <IonItem>
      <IonLabel>
        <h2>{station.name}</h2>
        <p>
          {station.bikes} bicis • cap {station.capacity}
        </p>
      </IonLabel>
      <IonBadge color={free > 0 ? "success" : "medium"} slot="end">
        {free > 0 ? `${free} libres` : "Completa"}
      </IonBadge>
    </IonItem>
  );
}
