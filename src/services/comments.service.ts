import { apiPost, apiGet } from './apiClient';

export type CommentPayload = {
  idUsuario: number;
  idViaje: number;
  comentarioTexto: string;
  puntaje: number;
};

export const commentsService = {
  createComment: async (data: CommentPayload): Promise<void> => {
    await apiPost<void>('/api/comments/postComment', data);
  },
    getAllComments: async (): Promise<Comment[]> => {
    return await apiGet<Comment[]>('/api/comments/userComments');
  },
};


