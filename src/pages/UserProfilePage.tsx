import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonSpinner, IonButton, IonRefresher, IonRefresherContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import { useUserProfile } from '../hooks/useUserProfile';
import { formatCurrencyCOP, formatDateTimeISOToLocal } from '../services/format';
import { useNavigate } from 'react-router-dom';
import type { ApiError } from '../services/userProfile.service';

const UserProfilePage: React.FC = () => {
  const { profile, loading, error, reload } = useUserProfile();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (error && (error as ApiError).status === 401) {
      navigate('/login');
    }
  }, [error, navigate]);

  const onRefresh = (e: CustomEvent) => {
    reload();
    setTimeout(() => e.detail.complete(), 700);
  };

  function isCompletedStatus(status?: string) {
    if (!status) return false;
    return /finished|completed/i.test(status);
  }

  function isRideFinished(r: { endTime?: string | null; status?: string }) {
    // Consider a ride finished if endTime is present or status indicates finished
    if (r.endTime) return true;
    return isCompletedStatus(r.status);
  }

  function formatRideStatus(status?: string, endTime?: string | null) {
    if (endTime) return 'FINALIZADO';
    if (!status) return 'N/A';
    if (/finished|completed/i.test(status)) return 'FINALIZADO';
    if (/in[_ ]?progress|active/i.test(status)) return 'EN CURSO';
    if (/cancelled|canceled/i.test(status)) return 'CANCELADO';
    return String(status).toUpperCase();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <IonSpinner name="crescent" />
            <div>Cargando perfil...</div>
          </div>
        )}

        {error && (error as ApiError).status !== 401 && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Error al cargar perfil</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {(error as ApiError).status === 404 ? (
                <div>Usuario no encontrado.</div>
              ) : (
                <div>
                  Ocurrió un error al cargar tu perfil. Intenta de nuevo.
                  <div style={{ marginTop: 12 }}>
                    <IonButton onClick={() => reload()}>Reintentar</IonButton>
                  </div>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        )}

        {!loading && profile && (
          <div style={{ padding: 12 }}>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{profile.fullName}</IonCardTitle>
                <IonCardSubtitle>{profile.email}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>
                        {formatCurrencyCOP(profile.balance, true)}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <IonButton onClick={() => { /* TODO: recargar saldo */ }}>Recargar saldo</IonButton>
                        <IonButton color="light" onClick={() => reload()} style={{ marginLeft: 8 }}>Actualizar</IonButton>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Multas</IonCardTitle>
                <IonCardSubtitle>Historial de multas</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                {profile.fines && profile.fines.length > 0 ? (
                  <IonList>
                    {profile.fines.map(f => (
                      <IonItem key={f.id}>
                        <IonLabel>
                          <h3>{f.reason}</h3>
                          <p>{formatDateTimeISOToLocal(f.createdAt)}</p>
                        </IonLabel>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 600 }}>{formatCurrencyCOP(f.amount, true)}</div>
                          <IonBadge color={f.status === 'PENDING' ? 'warning' : f.status === 'PAID' ? 'success' : 'medium'}>
                            {f.status === 'PENDING' ? 'PENDIENTE' : f.status === 'PAID' ? 'PAGADA' : 'CANCELADA'}
                          </IonBadge>
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                ) : (
                  <div style={{ padding: 12 }}>No hay multas registradas.</div>
                )}
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Últimos viajes</IonCardTitle>
                <IonCardSubtitle>Hasta 10 viajes finalizados</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                {profile.lastRides && profile.lastRides.filter(r => isRideFinished(r)).length > 0 ? (
                  <IonList>
                    {profile.lastRides
                      .filter(r => isRideFinished(r))
                      .sort((a, b) => {
                        const ta = new Date(a.endTime || a.startTime).getTime();
                        const tb = new Date(b.endTime || b.startTime).getTime();
                        return tb - ta;
                      })
                      .slice(0, 10)
                      .map(r => (
                        <IonItem key={r.id}>
                          <IonLabel>
                            <h3>{formatDateTimeISOToLocal(r.endTime || r.startTime)}</h3>
                            <p>Duración: {r.durationMinutes != null ? `${r.durationMinutes} min` : 'N/A'}</p>
                          </IonLabel>
                          <div style={{ textAlign: 'right' }}>
                            <IonBadge color={isRideFinished(r) ? 'success' : 'medium'}>{formatRideStatus(r.status, r.endTime)}</IonBadge>
                          </div>
                        </IonItem>
                      ))}
                  </IonList>
                ) : (
                  <div style={{ padding: 12 }}>Aún no tienes viajes.</div>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UserProfilePage;
