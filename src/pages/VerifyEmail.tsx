import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verificando...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/activate/${token}`);
        const data = await response.json();

        if (!response.ok) {
          if (data.message?.includes("Token inválido")) {
            setMessage("Tu cuenta ya está activada. Puedes iniciar sesión.");
            setStatus("success");
            return;
          }

          setMessage(data.message || "Error al verificar el correo.");
          setStatus("error");
          return;
        }

        setMessage(data.message); // "Cuenta activada exitosamente." o "Cuenta ya estaba activada."
        setStatus("success");
      } catch (err: any) {
        if (err.code === "ALREADY_ACTIVE") {
          setMessage("Tu cuenta ya estaba activada. Puedes iniciar sesión.");
        } else if (err.code === "TOKEN_EXPIRED") {
          setMessage("El enlace ha expirado. Solicita uno nuevo.");
        } else if (err.code === "INVALID_TOKEN") {
          setMessage("Token inválido.");
        } else {
          setMessage(err.message || "Error al verificar el correo.");
        }
        setStatus("error");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status === "success" ? "Cuenta activada" : "Verificación de correo"}</h2>
      <p>{message}</p>

      {status === "error" && (
        <button onClick={() => navigate("/resend-activation")}>
          Reenviar enlace de activación
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
