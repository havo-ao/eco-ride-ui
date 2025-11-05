import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonFooter,
  IonIcon,
  IonToast,
} from '@ionic/react';
import { starOutline, star } from 'ionicons/icons';
import { commentsService } from '../services/comments.service';

const MAX_LENGTH = 500;

export const AddCommentPage = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; color: 'success' | 'danger' } | null>(null);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setToast({ message: 'Por favor, escribe un comentario.', color: 'danger' });
      return;
    }
    if (rating === 0) {
      setToast({ message: 'Selecciona una puntuación (1-5).', color: 'danger' });
      return;
    }

    setLoading(true);
    try {
      //AQUÍ VA QUEMADO UN ID DE PRUEBA, AHORA HAY QUE TRAER EL ID DESDE LA SESIÓN E INSERTARLO AQUÍ
      await commentsService.createComment({
        idUsuario: 1,       // Placeholder
        idViaje: 1,         // Placeholder
        comentarioTexto: comment,
        puntaje: rating,
      });

      setToast({ message: '¡Comentario enviado con éxito!', color: 'success' });
      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setToast({ message: 'Error al enviar. Inténtalo de nuevo.', color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <IonIcon
        key={i}
        icon={i < rating ? star : starOutline}
        style={{ fontSize: '2rem', cursor: 'pointer', color: i < rating ? '#FFD700' : '#ccc' }}
        onClick={() => setRating(i + 1)}
      />
    ));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dejar Comentario</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Comentario</IonLabel>
          <IonTextarea
            value={comment}
            onIonChange={(e) => setComment(e.detail.value!)}
            placeholder="Escribe tu experiencia..."
            rows={5}
            maxlength={MAX_LENGTH}
            counter={true}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Puntuación</IonLabel>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
            {renderStars()}
          </div>
        </IonItem>

        <IonButton
          expand="full"
          disabled={loading}
          onClick={handleSubmit}
          style={{ marginTop: '2rem' }}
        >
          {loading ? 'Enviando...' : 'Enviar Comentario'}
        </IonButton>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonTitle size="small" color="medium">
            IDs de usuario/viaje: temporales
          </IonTitle>
        </IonToolbar>
      </IonFooter>

      <IonToast
        isOpen={!!toast}
        message={toast?.message || ''}
        color={toast?.color}
        duration={3000}
        onDidDismiss={() => setToast(null)}
      />
    </IonPage>
  );
};