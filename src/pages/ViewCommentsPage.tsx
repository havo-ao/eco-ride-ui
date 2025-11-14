import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonList,
} from '@ionic/react';

import { useState, useEffect } from 'react';
import { commentsService } from '../services/comments.service';

export const CommentsPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentsService.getAllComments();
        setComments(data);
      } catch (err) {
        setError('No se pudieron cargar los comentarios.');
        console.error('Error al cargar comentarios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Comentarios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText>Cargando comentarios...</IonText>
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Comentarios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">{error}</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comentarios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {comments.length === 0 ? (
          <IonText>No hay comentarios aún.</IonText>
        ) : (
          <IonList> 
            {comments.map((comment, index) => (
              <IonCard key={index}>
                <IonCardContent>
                  <IonText color="medium" style={{ fontSize: '0.875rem' }}>
                    {comment.nombreUsuario} 
                  </IonText>
                  <IonText>
                    <p>{comment.comentarioTexto}</p>
                  </IonText>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <IonText key={i} color={i < comment.puntaje ? 'warning' : 'medium'}>
                        ★
                      </IonText>
                    ))}
                  </div>
                  
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};