import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from '../services/paymentsApi';
import type { PaymentMethod } from '../types/payment';
import { IonList, IonItem, IonLabel, IonButton, IonNote, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import { trash, checkmarkCircleOutline } from 'ionicons/icons';

interface Props {
  onChange?: () => void;
}

export const PaymentMethodsList: React.FC<Props> = ({ onChange }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentMethods();
      // Only show methods that are not revoked. Backend may return revoked items
      // (status could be 'REVOKED'); normalize and filter client-side.
      const visible = (data || []).filter(m => ((m.status || '') as string).toUpperCase() !== 'REVOKED');
      setMethods(visible);
      setAuthRequired(false);
    } catch {
      setError('No se pudieron cargar los métodos de pago. Verifica que estés autenticado.');
      setAuthRequired(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultPaymentMethod(id);
      await load();
      if (onChange) onChange();
    } catch {
      setError('No se pudo actualizar el método por defecto.');
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm('¿Eliminar este método de pago? Esta acción no se puede deshacer.');
    if (!ok) return;
    setDeletingId(id);
    try {
      const res = await deletePaymentMethod(id);
      // optimistically remove from UI immediately
      setMethods(prev => prev.filter(m => m.id !== id));
      if (res && res.message) setToastMessage(res.message.toString());
      // refresh in background to ensure server/DB consistency
      load().catch(() => {});
      if (onChange) onChange();
    } catch (err: unknown) {
      const msg = (err as Record<string, unknown>)?.message;
      setError(typeof msg === 'string' ? msg : 'No se pudo eliminar el método.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {error && <IonNote color="danger">{error}</IonNote>}
      {authRequired && (
        <div style={{ marginTop: 8 }}>
          <IonButton onClick={() => navigate('/login')} fill="clear">Iniciar sesión</IonButton>
        </div>
      )}
      <IonList>
        {methods.map(m => (
          <IonItem key={m.id}>
            <IonLabel>
              <div>
                {m.type === 'CARD' ? (
                  <>
                    {m.brand} •••• {m.last4}
                  </>
                ) : (
                  <>{m.type}</>
                )}
              </div>
              <div>
                <small>Vence: {m.expMonth}/{m.expYear}</small>
                {m.isDefault && <IonNote color="success"> &nbsp; Predeterminado</IonNote>}
              </div>
            </IonLabel>

            {!m.isDefault && (
              <IonButton fill="clear" onClick={() => handleSetDefault(m.id)}>
                <IonIcon icon={checkmarkCircleOutline} />
              </IonButton>
            )}

            <IonButton color="danger" onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}>
              {deletingId === m.id ? <IonSpinner name="crescent" /> : <IonIcon icon={trash} />}
            </IonButton>
          </IonItem>
        ))}
      </IonList>
        <IonToast isOpen={!!toastMessage} message={toastMessage ?? ''} duration={3000} onDidDismiss={() => setToastMessage(null)} />
    </div>
  );
};

export default PaymentMethodsList;
