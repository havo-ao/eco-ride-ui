import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  to: string;
  label: string;
  private?: boolean;
  onlyWhenLoggedOut?: boolean;
};

type Props = {
  authed: boolean;
  onLogout: () => void;
  navItems: NavItem[];
  contentId: string;
};

export default function SideMenu({
  authed,
  onLogout,
  navItems,
  contentId,
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <IonMenu side="start" contentId={contentId} type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menú</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset>
          {navItems
            .filter((i) => {
              if (i.private && !authed) return false;
              if (i.onlyWhenLoggedOut && authed) return false;
              return true;
            })
            .map((i) => {
              const active = currentPath.startsWith(i.to);
              return (
                <IonMenuToggle key={i.to} autoHide={true}>
                  <IonItem
                    button
                    detail={false}
                    routerDirection="forward"
                    onClick={() => navigate(i.to)}
                    aria-current={active ? "page" : undefined}
                  >
                    <IonLabel style={{ fontWeight: active ? 600 : 400 }}>
                      {i.label}
                    </IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          {authed ? (
            <IonMenuToggle autoHide={true}>
              <IonItem
                button
                detail={false}
                onClick={() => {
                  onLogout();
                }}
              >
                <IonLabel>Cerrar Sesión</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ) : null}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
