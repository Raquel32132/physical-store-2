export function formatPostalCode(postalCode: string): string {
  return postalCode.replace(/\D/g, '');
}