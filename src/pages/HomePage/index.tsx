import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonText,
  IonChip,
  IonAvatar,
  IonLabel,
} from "@ionic/react";
import {
  bicycleOutline,
  logInOutline,
  personAddOutline,
  mapOutline,
  statsChartOutline,
  timeOutline,
  shieldCheckmarkOutline,
  walletOutline,
  arrowForwardOutline,
  sparklesOutline,
  list,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import "./homepage.scss";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <IonGrid className="home-grid">
      <IonRow className="hero">
        <IonCol size="12" sizeMd="10" sizeLg="8" offsetMd="1" offsetLg="2">
          <IonCard className="hero-card">
            <IonCardHeader>
              <IonCardSubtitle className="hero-overline">
                Movilidad sostenible inteligente
              </IonCardSubtitle>
              <IonCardTitle className="hero-title">
                EcoRide
                <IonChip color="success" outline className="hero-chip">
                  <IonIcon icon={sparklesOutline} />
                  <IonLabel>Smart Mobility</IonLabel>
                </IonChip>
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="hero-content">
              <IonText className="hero-description">
                Reduce el tráfico, mejora tu salud y contribuye con el medio
                ambiente. EcoRide te conecta con una red inteligente de
                bicicletas compartidas en toda la ciudad.
              </IonText>
              <div className="hero-actions">
                <IonButton size="large" onClick={() => navigate("/stations")}>
                  Explorar estaciones
                  <IonIcon slot="end" icon={arrowForwardOutline} />
                </IonButton>
                <IonButton
                  color="light"
                  size="large"
                  onClick={() => navigate("/rides")}
                >
                  Mis viajes
                </IonButton>
              </div>
              <div className="hero-quick">
                <IonButton fill="clear" onClick={() => navigate("/login")}>
                  <IonIcon slot="start" icon={logInOutline} />
                  Iniciar sesión
                </IonButton>
                <IonButton fill="clear" onClick={() => navigate("/register")}>
                  <IonIcon slot="start" icon={personAddOutline} />
                  Crear cuenta
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow className="quick-cards">
        <IonCol size="12" sizeMd="4">
          <IonCard className="quick-card">
            <IonCardHeader>
              <div className="quick-icon" aria-hidden="true">
                <IonIcon icon={mapOutline} />
              </div>
              <IonCardTitle>Encuentra tu estación</IonCardTitle>
              <IonCardSubtitle>Ubicación en tiempo real</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                Consulta estaciones cercanas, disponibilidad y rutas más
                ecológicas para moverte rápido.
              </IonText>
              <div className="quick-actions">
                <IonButton expand="block" onClick={() => navigate("/stations")}>
                  Ver estaciones
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="4">
          <IonCard className="quick-card">
            <IonCardHeader>
              <div className="quick-icon" aria-hidden="true">
                <IonIcon icon={bicycleOutline} />
              </div>
              <IonCardTitle>Reserva tu bicicleta</IonCardTitle>
              <IonCardSubtitle>Viajes seguros y simples</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                Reserva, desbloquea y devuelve tu bicicleta en cualquier punto
                autorizado de la red EcoRide.
              </IonText>
              <div className="quick-actions">
                <IonButton expand="block" onClick={() => navigate("/rides")}>
                  Mis viajes
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>

        <IonCol size="12" sizeMd="4">
          <IonCard className="quick-card">
            <IonCardHeader>
              <div className="quick-icon" aria-hidden="true">
                <IonIcon icon={walletOutline} />
              </div>
              <IonCardTitle>Tarifas inteligentes</IonCardTitle>
              <IonCardSubtitle>Ahorra más, pedalea más</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                Tarifas dinámicas según distancia, tiempo y energía ahorrada.
              </IonText>
              <div className="quick-actions">
                <IonButton disabled expand="block">
                  Muy pronto
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow className="stats">
        <IonCol size="12" sizeMd="10" sizeLg="8" offsetMd="1" offsetLg="2">
          <div className="stats-wrap" role="group" aria-label="Indicadores">
            <div className="stat">
              <div className="stat-icon">
                <IonIcon icon={statsChartOutline} />
              </div>
              <div className="stat-text">
                <strong>+3</strong>
                <span>Estaciones activas</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <IonIcon icon={timeOutline} />
              </div>
              <div className="stat-text">
                <strong>24/7</strong>
                <span>Disponibilidad</span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon">
                <IonIcon icon={shieldCheckmarkOutline} />
              </div>
              <div className="stat-text">
                <strong>100%</strong>
                <span>Uso seguro y verificado</span>
              </div>
            </div>
          </div>
        </IonCol>
      </IonRow>

      <IonRow className="highlights">
        <IonCol size="12" sizeMd="10" sizeLg="8" offsetMd="1" offsetLg="2">
          <div className="comments-section" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <IonButton
              size="large"
              color="medium"
              onClick={() => navigate("/commentList")}
            >
              <IonIcon icon={list} slot="start" />
              Ver comentarios de usuarios
            </IonButton>
          </div>
        </IonCol>
      </IonRow>

      <IonRow className="highlights">
        <IonCol size="12" sizeMd="10" sizeLg="8" offsetMd="1" offsetLg="2">
          <IonCard className="highlight-card">
            <IonCardContent className="highlight-content">
              <div className="highlight-left">
                <h2 className="highlight-title">Muévete con propósito</h2>
                <p className="highlight-desc">
                  Cada kilómetro recorrido con EcoRide reduce la huella de
                  carbono y mejora la movilidad en tu ciudad. Somos parte del
                  cambio hacia un futuro más limpio.
                </p>
                <div className="highlight-badges">
                  <IonBadge color="success">Ecológico</IonBadge>
                  <IonBadge color="primary">Urbano</IonBadge>
                  <IonBadge color="tertiary">Accesible</IonBadge>
                  <IonBadge color="medium">Comunitario</IonBadge>
                </div>
                <div className="highlight-actions">
                  <IonButton onClick={() => navigate("/register")}>
                    Crear cuenta
                  </IonButton>
                  <IonButton color="light" onClick={() => navigate("/login")}>
                    Iniciar sesión
                  </IonButton>
                </div>
              </div>
              <div className="highlight-right" aria-hidden="true">
                <div className="highlight-avatars">
                  <IonAvatar>
                    <img src="https://picsum.photos/seed/user1/64" alt="" />
                  </IonAvatar>
                  <IonAvatar>
                    <img src="https://picsum.photos/seed/user2/64" alt="" />
                  </IonAvatar>
                  <IonAvatar>
                    <img src="https://picsum.photos/seed/user3/64" alt="" />
                  </IonAvatar>
                </div>
                <div className="highlight-note">
                  <IonIcon icon={shieldCheckmarkOutline} />
                  <span>Comunidad EcoRide en expansión</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow className="cta">
        <IonCol size="12" sizeMd="10" sizeLg="8" offsetMd="1" offsetLg="2">
          <IonCard className="cta-card">
            <IonCardContent className="cta-content">
              <div className="cta-left">
                <h3 className="cta-title">Únete al movimiento verde</h3>
                <p className="cta-desc">
                  Regístrate hoy y forma parte del sistema de transporte más
                  sostenible, rápido y accesible de tu ciudad.
                </p>
              </div>
              <div className="cta-right">
                <IonButton size="large" onClick={() => navigate("/register")}>
                  Empezar ahora
                </IonButton>
                <IonButton
                  size="large"
                  fill="clear"
                  onClick={() => navigate("/stations")}
                >
                  Ver estaciones
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}
