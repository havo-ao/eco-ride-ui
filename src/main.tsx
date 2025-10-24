import React from "react";
import ReactDOM from "react-dom/client";
import { setupIonicReact, IonApp } from "@ionic/react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import "@ionic/react/css/core.css";
import "@ionic/react/css/ionic.bundle.css";

setupIonicReact();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IonApp>
      <BrowserRouter>
        <AppRoutes />
        Hola
      </BrowserRouter>
    </IonApp>
  </React.StrictMode>
);
