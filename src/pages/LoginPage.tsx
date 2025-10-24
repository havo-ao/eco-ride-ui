import { IonButton, IonInput, IonItem, IonList } from "@ionic/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const handleLogin = () => alert(`(demo) login ${email}`);

  return (
    <IonList class="ion-padding">
      <IonItem>
        <IonInput
          label="Email"
          labelPlacement="floating"
          value={email}
          onIonInput={(e) => setEmail(String(e.detail.value))}
        />
      </IonItem>
      <IonItem>
        <IonInput
          type="password"
          label="Password"
          labelPlacement="floating"
          value={pwd}
          onIonInput={(e) => setPwd(String(e.detail.value))}
        />
      </IonItem>
      <IonButton
        expand="block"
        className="ion-margin-top"
        onClick={handleLogin}
      >
        Entrar
      </IonButton>
    </IonList>
  );
}
