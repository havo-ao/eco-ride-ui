import React from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../lib/stripe';
import PaymentMethodForm from '../components/PaymentMethodForm';
import PaymentMethodsList from '../components/PaymentMethodsList';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonNote,
} from '@ionic/react';

const PaymentMethodsPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [stripeReady, setStripeReady] = React.useState<'loading' | 'ready' | 'missing'>('loading');
  const [stripePromise, setStripePromise] = React.useState<Promise<Stripe | null> | null>(null);

  const loadStripeKey = React.useCallback(async () => {
    setStripeReady('loading');
    const p = getStripe();
    const s = await p.catch(() => null);
    if (s) {
      setStripePromise(p);
      setStripeReady('ready');
    } else {
      setStripePromise(null);
      setStripeReady('missing');
    }
  }, []);

  React.useEffect(() => {
    loadStripeKey();
  }, [loadStripeKey]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Métodos de pago</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {stripeReady === 'loading' && <IonNote>Comprobando configuración de Stripe…</IonNote>}

        {/* Debug panel intentionally removed for production UI; stripe init still runs in getStripe() when needed */}

        {stripeReady === 'missing' && (
          <div>
            <IonNote color="danger">No se encontró la clave pública de Stripe. Verifica la configuración del backend o la variable VITE_STRIPE_PUBLISHABLE_KEY.</IonNote>
            <div style={{ marginTop: 12 }}>
              <IonButton onClick={loadStripeKey}>Reintentar</IonButton>
            </div>
          </div>
        )}

        {stripeReady === 'ready' && stripePromise && (
          <Elements stripe={stripePromise}>
            <IonGrid>
              <IonRow>
                <IonCol sizeMd="6" size="12">
                  <h3>Agregar tarjeta</h3>
                  <PaymentMethodForm onSuccess={() => setRefreshKey(k => k + 1)} />
                </IonCol>

                <IonCol sizeMd="6" size="12">
                  <h3>Tus métodos</h3>
                  <PaymentMethodsList key={refreshKey} onChange={() => setRefreshKey(k => k + 1)} />
                </IonCol>
              </IonRow>
            </IonGrid>
          </Elements>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PaymentMethodsPage;
