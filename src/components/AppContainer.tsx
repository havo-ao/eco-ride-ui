import { IonContent, IonPage } from "@ionic/react";
import HeaderToolbar from "./HeaderToolbar";
import SideMenu from "./SideMenu";
import { useMemo } from "react";
import { isAuthenticated } from "../routes/guards";

export default function AppContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = isAuthenticated();
  const onLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.assign("/home");
  };

  const contentId = "main-content";

  const navItems = useMemo(
    () => [
      { to: "/home", label: "Home", public: true },
      { to: "/stations", label: "Stations", private: true },
      { to: "/rides", label: "Rides", private: true },
      { to: "/login", label: "Login", onlyWhenLoggedOut: true },
      { to: "/register", label: "Register", onlyWhenLoggedOut: true },
    ],
    []
  );

  return (
    <>
      <SideMenu
        authed={authed}
        onLogout={onLogout}
        navItems={navItems}
        contentId={contentId}
      />
      <IonPage id={contentId}>
        <HeaderToolbar authed={authed} onLogout={onLogout} />
        <IonContent fullscreen>{children}</IonContent>
      </IonPage>
    </>
  );
}
