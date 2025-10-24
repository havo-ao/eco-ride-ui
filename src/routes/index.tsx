import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import StationsPage from "../pages/StationsPage";
import RidesPage from "../pages/RidesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/home"
        element={
          <Shell>
            <HomePage />
          </Shell>
        }
      />
      <Route
        path="/login"
        element={
          <Shell>
            <LoginPage />
          </Shell>
        }
      />
      <Route
        path="/stations"
        element={
          <Shell>
            <StationsPage />
          </Shell>
        }
      />
      <Route
        path="/rides"
        element={
          <Shell>
            <RidesPage />
          </Shell>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>EcoRide</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <nav style={{ padding: 12, display: "flex", gap: 12 }}>
          <Link to="/home">Home</Link>
          <Link to="/stations">Stations</Link>
          <Link to="/rides">Rides</Link>
          <Link to="/login">Login</Link>
        </nav>
        {children}
      </IonContent>
    </IonPage>
  );
}
