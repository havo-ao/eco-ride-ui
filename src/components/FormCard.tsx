import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

type Props = {
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
};

export default function FormCard({ title, children, maxWidth = 520 }: Props) {
  return (
    <IonCard style={{ maxWidth, margin: "0 auto" }}>
      {title ? (
        <IonCardHeader>
          <IonCardTitle>{title}</IonCardTitle>
        </IonCardHeader>
      ) : null}
      <IonCardContent>{children}</IonCardContent>
    </IonCard>
  );
}
