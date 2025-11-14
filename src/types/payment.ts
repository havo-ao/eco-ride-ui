export interface PaymentMethod {
  id: number;
  type: 'CARD' | 'WALLET';
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
  status: 'PENDING' | 'VALID' | 'REJECTED';
}
