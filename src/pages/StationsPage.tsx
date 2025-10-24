import { IonList, IonItem, IonLabel, IonSpinner } from "@ionic/react";
import useStations from "../hooks/useStations";
import StationCard from "../components/StationCard";

export default function StationsPage() {
  const { data, loading, error } = useStations();

  if (loading) return <IonSpinner class="ion-padding" />;
  if (error)
    return (
      <IonItem color="danger">
        <IonLabel>Error: {error}</IonLabel>
      </IonItem>
    );

  return (
    <IonList>
      {data.map((st) => (
        <StationCard key={st.id} station={st} />
      ))}
    </IonList>
  );
}
