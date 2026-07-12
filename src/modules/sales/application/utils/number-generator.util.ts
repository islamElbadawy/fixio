export function generateOrderNumber(lastNumber: string | null): string {
  const year = new Date().getFullYear();
  if (!lastNumber) return `ORD-${year}-001`;

  const parts = lastNumber.split('-');
  const lastSeq = parseInt(parts[2], 10);
  const nextSeq = String(lastSeq + 1).padStart(3, '0');
  return `ORD-${year}-${nextSeq}`;
}

export function generateInvoiceNumber(lastNumber: string | null): string {
  const year = new Date().getFullYear();
  if (!lastNumber) return `INV-${year}-001`;

  const parts = lastNumber.split('-');
  const lastSeq = parseInt(parts[2], 10);
  const nextSeq = String(lastSeq + 1).padStart(3, '0');
  return `INV-${year}-${nextSeq}`;
}

export function generateWorkOrderNumber(lastNumber: string | null): string {
  const year = new Date().getFullYear();
  if (!lastNumber) return `WO-${year}-001`;

  const parts = lastNumber.split('-');
  const lastSeq = parseInt(parts[2], 10);
  const nextSeq = String(lastSeq + 1).padStart(3, '0');
  return `WO-${year}-${nextSeq}`;
}
