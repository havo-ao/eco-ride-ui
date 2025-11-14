export function formatCurrencyCOP(balanceInt: number, assumeCents = true): string {
  const amount = assumeCents ? balanceInt / 100 : balanceInt;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(amount);
}

export function formatDateTimeISOToLocal(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
