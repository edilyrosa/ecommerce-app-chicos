// lib/formatPrice.js
export function formatPrice(price) {
  if (price === undefined || price === null) return '$0.00';
  const number = Number(price);
  if (isNaN(number)) return '$0.00';
  // 'es-MX' usa coma para miles y punto para decimales
  return number.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}