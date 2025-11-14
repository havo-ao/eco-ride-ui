import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { registerPaymentMethod } from '../services/paymentsApi';
import { IonButton, IonItem, IonLabel, IonNote, IonSpinner, IonCheckbox } from '@ionic/react';

interface Props {
  onSuccess?: () => void;
}

export const PaymentMethodForm: React.FC<Props> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [cardComplete, setCardComplete] = useState({ number: false, expiry: false, cvc: false });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (loading) return; // prevent re-entry
    if (!stripe || !elements) {
      // Avoid setting a blocking error; user can reattempt when Stripe finishes loading
      setError('Stripe aún se está inicializando. Espera un momento e intenta de nuevo.');
      return;
    }

  setLoading(true);
    try {
      const card = elements.getElement(CardNumberElement);
      if (!card) throw new Error('No card element');

      const result = await stripe.createPaymentMethod({ type: 'card', card });
      if (result.error || !result.paymentMethod) {
        setError('No pudimos validar tu tarjeta, intenta de nuevo.');
        setLoading(false);
        return;
      }

  const pm = result.paymentMethod;
      const brand = (pm.card?.brand || '').toUpperCase();
      const last4 = pm.card?.last4 || '';
      const expMonth = pm.card?.exp_month || 0;
      const expYear = pm.card?.exp_year || 0;

      try {
        await registerPaymentMethod({
          paymentMethodId: pm.id,
          brand,
          last4,
          expMonth,
          expYear,
          setAsDefault,
        });
        // success
        setLoading(false);
        if (onSuccess) onSuccess();
      } catch (err: unknown) {
        setLoading(false);
  const errObj = err as Record<string, unknown> | undefined;
  const msg = errObj && typeof errObj.message === 'string' ? errObj.message : undefined;
        if (msg === 'PAYMENT_METHOD_REJECTED') {
          setError('La tarjeta fue rechazada por el banco, intenta con otra.');
        } else if (msg === 'UNAUTHORIZED') {
          setError('No estás autenticado. Por favor inicia sesión.');
          setAuthRequired(true);
        } else if (msg === 'ALREADY_EXISTS') {
          setError('Este método de pago ya está registrado.');
        } else if (msg === 'ERROR_INTERNAL') {
          setError('Ocurrió un error, intenta más tarde.');
        } else {
          setError('Ocurrió un error, intenta más tarde.');
        }
      }
    } catch {
      setLoading(false);
      setError('No pudimos validar tu tarjeta, intenta de nuevo.');
    }
  };

  const stripeReady = Boolean(stripe && elements);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: 'var(--ion-color-dark)',
        fontSize: '15px',
        '::placeholder': { color: '#aab7c4' },
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#fa755a',
      },
    },
  } as const;

  // showIcon is supported only on the CardNumberElement; provide a separate options object
  const CARD_NUMBER_OPTIONS = { ...CARD_ELEMENT_OPTIONS, showIcon: true } as const;

  const handleElementChange = (e: unknown, field: 'number' | 'expiry' | 'cvc') => {
    if (typeof e === 'object' && e !== null) {
      const ev = e as { complete?: boolean; error?: { message?: string } };
      setCardComplete(c => ({ ...c, [field]: !!ev.complete }));
      if (ev.error && ev.error.message) setError(ev.error.message);
      else setError(null);
    }
  };

  const onNumberChange = (e: unknown) => handleElementChange(e, 'number');
  const onExpiryChange = (e: unknown) => handleElementChange(e, 'expiry');
  const onCvcChange = (e: unknown) => handleElementChange(e, 'cvc');

  return (
    <form onSubmit={handleSubmit}>
      {/* Ensure Stripe's iframe elements are fully interactive and sized */}
      <style>{`
        /* Keep the Stripe iframe compact and interactive */
        .__PrivateStripeElement iframe, .StripeElement iframe {
          height: 32px !important;
          min-height: 32px !important;
          box-sizing: border-box !important;
          pointer-events: auto !important;
        }
  .stripe-field-label{display:block; margin-bottom:6px; font-size:0.85rem; color: var(--ion-color-medium);} 
  .stripe-element-container{ padding:6px 10px; border:1px solid var(--ion-color-medium); border-radius:4px; height:40px; display:flex; align-items:center; background:#fff; position:relative; z-index:10; }
  /* Ensure any Stripe iframe inside the element is interactive and not covered by Ionic overlays */
  .stripe-element-container .__PrivateStripeElement, .stripe-element-container .StripeElement { width:100%; }
      `}</style>

      <div style={{ marginBottom: 12 }}>
        <label className="stripe-field-label">Número de tarjeta</label>
        <div className="stripe-element-container">
          <CardNumberElement options={CARD_NUMBER_OPTIONS} onChange={onNumberChange} />
        </div>
      </div>

      <div style={{ marginBottom: 12, maxWidth: 220 }}>
        <label className="stripe-field-label">Vencimiento</label>
        <div className="stripe-element-container">
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} onChange={onExpiryChange} />
        </div>
      </div>

      <div style={{ marginBottom: 12, maxWidth: 220 }}>
        <label className="stripe-field-label">CVC</label>
        <div className="stripe-element-container">
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} onChange={onCvcChange} />
        </div>
      </div>

      <IonItem>
        <IonLabel>Usar como método de pago predeterminado</IonLabel>
        <IonCheckbox checked={setAsDefault} onIonChange={ev => setSetAsDefault(Boolean(ev.detail.checked))} />
      </IonItem>

      {error && <IonNote color="danger">{error}</IonNote>}
      {authRequired && (
        <div style={{ marginTop: 8 }}>
          <IonButton onClick={() => navigate('/login')} fill="clear">Ir a iniciar sesión</IonButton>
        </div>
      )}

      {!stripeReady && !loading && <IonNote color="medium">Stripe inicializándose…</IonNote>}

          <div style={{ marginTop: 12 }}>
      <IonButton type="submit" expand="block" disabled={loading || !stripeReady || !cardComplete.number || !cardComplete.expiry || !cardComplete.cvc}>
          {loading ? (
            <>
              Guardando método de pago… <IonSpinner name="crescent" />
            </>
          ) : (
            'Agregar tarjeta'
          )}
        </IonButton>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
