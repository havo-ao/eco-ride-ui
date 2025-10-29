/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useRef, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import FormCard from "../components/FormCard";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [autoFocusInvalid, setAutoFocusInvalid] = useState(false);

  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const pwdRef = useRef<HTMLIonInputElement | null>(null);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const pwdValid = useMemo(() => pwd.trim().length >= 6, [pwd]);
  const formValid = emailValid && pwdValid;

  const fieldErrors = {
    email: touched.email && !emailValid ? "Email inválido" : "",
    pwd: touched.pwd && !pwdValid ? "Mínimo 6 caracteres" : "",
  };

  useEffect(() => {
    if (!autoFocusInvalid) return;
    if (fieldErrors.email) emailRef.current?.setFocus();
    else if (fieldErrors.pwd) pwdRef.current?.setFocus();
    setAutoFocusInvalid(false);
  }, [autoFocusInvalid, fieldErrors]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, pwd: true });
    if (!formValid) {
      setAutoFocusInvalid(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Demo: simulación login
      await new Promise((r) => setTimeout(r, 600));
      localStorage.setItem("auth_token", "demo-token");
      setSuccess(true);
      setTimeout(() => navigate("/stations", { replace: true }), 900);
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Iniciar sesión</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <FormCard title="Iniciar sesión">
          <form onSubmit={handleLogin} noValidate>
            <IonList>
              <IonItem>
                <IonInput
                  ref={emailRef}
                  label="Email"
                  labelPlacement="floating"
                  aria-invalid={!!fieldErrors.email}
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? "")}
                  onIonBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  inputMode="email"
                  required
                />
              </IonItem>
              {fieldErrors.email && (
                <IonText color="danger" class="ion-padding-start">
                  {fieldErrors.email}
                </IonText>
              )}

              <IonItem>
                <IonInput
                  ref={pwdRef}
                  type="password"
                  label="Contraseña"
                  labelPlacement="floating"
                  aria-invalid={!!fieldErrors.pwd}
                  value={pwd}
                  onIonInput={(e) => setPwd(e.detail.value ?? "")}
                  onIonBlur={() => setTouched((t) => ({ ...t, pwd: true }))}
                  required
                />
              </IonItem>
              {fieldErrors.pwd && (
                <IonText color="danger" class="ion-padding-start">
                  {fieldErrors.pwd}
                </IonText>
              )}

              <div className="ion-padding">
                <IonButton
                  expand="block"
                  type="submit"
                  disabled={!formValid || loading}
                >
                  {loading ? <IonSpinner name="dots" /> : "Entrar"}
                </IonButton>
              </div>

              {error && (
                <IonText color="danger" class="ion-padding-start">
                  Error: {error}
                </IonText>
              )}
            </IonList>
          </form>
        </FormCard>

        <IonToast
          isOpen={success}
          message="Inicio de sesión exitoso"
          duration={900}
          position="top"
          color="success"
          onDidDismiss={() => setSuccess(false)}
        />
      </IonContent>
    </IonPage>
  );
}
