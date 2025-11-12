/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
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
  IonCheckbox,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import useRegister from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";
import FormCard from "../components/FormCard";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { submit, loading, error, setError } = useRegister();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState(false);
  const [autoFocusInvalid, setAutoFocusInvalid] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const firstNameRef = useRef<HTMLIonInputElement | null>(null);
  const lastNameRef = useRef<HTMLIonInputElement | null>(null);
  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const passwordRef = useRef<HTMLIonInputElement | null>(null);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );
  const passwordValid = useMemo(() => password.length >= 8, [password]);
  const firstNameValid = useMemo(
    () => firstName.trim().length > 0,
    [firstName]
  );
  const lastNameValid = useMemo(() => lastName.trim().length > 0, [lastName]);
  const formValid =
    firstNameValid && lastNameValid && emailValid && passwordValid && terms;

  const fieldErrors = {
    firstName: touched.firstName && !firstNameValid ? "Requerido" : "",
    lastName: touched.lastName && !lastNameValid ? "Requerido" : "",
    email: touched.email && !emailValid ? "Email inválido" : "",
    password: touched.password && !passwordValid ? "Mínimo 8 caracteres" : "",
    terms: touched.terms && !terms ? "Debes aceptar los términos" : "",
  };

  useEffect(() => {
    if (!autoFocusInvalid) return;
    const order = [
      "firstName",
      "lastName",
      "email",
      "password",
      "terms",
    ] as const;
    const firstInvalid = order.find(
      (k) => (fieldErrors as Record<string, string>)[k]
    );
    if (firstInvalid === "firstName") firstNameRef.current?.setFocus();
    else if (firstInvalid === "lastName") lastNameRef.current?.setFocus();
    else if (firstInvalid === "email") emailRef.current?.setFocus();
    else if (firstInvalid === "password") passwordRef.current?.setFocus();
    setAutoFocusInvalid(false);
  }, [autoFocusInvalid, fieldErrors]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      terms: true,
    });
    if (!formValid) {
      setAutoFocusInvalid(true);
      return;
    }
    try {
  await submit({ firstName, lastName, email, password });
  setSuccess(true);
  setToastMessage("Cuenta creada. Revisa tu correo para activar tu cuenta."); // ✅ mensaje dinámico
  setFirstName("");
  setLastName("");
  setEmail("");
  setPassword("");
  setTerms(false);
  setTouched({});
  setError(null);
} catch {
  setError("Error al crear la cuenta");
}
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <FormCard title="Crear cuenta">
          <form onSubmit={onSubmit} noValidate>
            <IonList>
              <IonItem>
                <IonInput
                  ref={firstNameRef}
                  label="Nombre"
                  labelPlacement="floating"
                  aria-invalid={!!fieldErrors.firstName}
                  value={firstName}
                  onIonInput={(e) => setFirstName(e.detail.value ?? "")}
                  onIonBlur={() =>
                    setTouched((t) => ({ ...t, firstName: true }))
                  }
                  type="text"
                  inputMode="text"
                  required
                />
              </IonItem>
              {fieldErrors.firstName && (
                <IonText color="danger" class="ion-padding-start">
                  {fieldErrors.firstName}
                </IonText>
              )}

              <IonItem>
                <IonInput
                  ref={lastNameRef}
                  label="Apellido"
                  labelPlacement="floating"
                  aria-invalid={!!fieldErrors.lastName}
                  value={lastName}
                  onIonInput={(e) => setLastName(e.detail.value ?? "")}
                  onIonBlur={() =>
                    setTouched((t) => ({ ...t, lastName: true }))
                  }
                  type="text"
                  inputMode="text"
                  required
                />
              </IonItem>
              {fieldErrors.lastName && (
                <IonText color="danger" class="ion-padding-start">
                  {fieldErrors.lastName}
                </IonText>
              )}

              <IonItem>
                <IonInput
                  ref={emailRef}
                  label="Email"
                  labelPlacement="floating"
                  aria-invalid={!!fieldErrors.email}
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? "")}
                  onIonBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  type="email"
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
                  ref={passwordRef}
                  label="Contraseña"
                  labelPlacement="floating"
                  aria-invalid={!!fieldErrors.password}
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? "")}
                  onIonBlur={() =>
                    setTouched((t) => ({ ...t, password: true }))
                  }
                  type="password"
                  required
                />
              </IonItem>
              {fieldErrors.password && (
                <IonText color="danger" class="ion-padding-start">
                  {fieldErrors.password}
                </IonText>
              )}

              <IonItem lines="none">
                <IonCheckbox
                  checked={terms}
                  onIonChange={(e) => {
                    setTerms(e.detail.checked);
                    setTouched((t) => ({ ...t, terms: true }));
                  }}
                  aria-invalid={!!fieldErrors.terms}
                >
                  Acepto los términos y condiciones
                </IonCheckbox>
              </IonItem>

              <div className="ion-padding">
                <IonButton
                  type="submit"
                  expand="block"
                  disabled={!formValid || loading}
                >
                  {loading ? <IonSpinner name="dots" /> : "Crear cuenta"}
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
          message={toastMessage} // ✅ ahora sí existe
          duration={900}
          position="top"
          color="success"
          onDidDismiss={() => setSuccess(false)}
        />
      </IonContent>
    </IonPage>
  );
}
