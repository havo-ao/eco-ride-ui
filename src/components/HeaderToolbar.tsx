import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
} from "@ionic/react";
import { logInOutline, personAddOutline, logOutOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

type Props = {
  authed: boolean;
  onLogout: () => void;
};

export default function HeaderToolbar({ authed, onLogout }: Props) {
  const navigate = useNavigate();

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home", { replace: true })}
        >
          EcoRide
        </IonTitle>
        <IonButtons slot="end">
          {!authed ? (
            <>
              <IonButton onClick={() => navigate("/login")}>
                <IonIcon slot="start" icon={logInOutline} />
                Iniciar Sesión
              </IonButton>
              <IonButton onClick={() => navigate("/register")}>
                <IonIcon slot="start" icon={personAddOutline} />
                Registrarse
              </IonButton>
            </>
          ) : (
            <IonButton color="medium" onClick={onLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              Logout
            </IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
