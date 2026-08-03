/** Begrenst een getal tussen een minimum en maximum. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Controleert of een string een geheel getal binnen een bereik voorstelt.
 * Gebruikt o.a. voor leeftijd- en andere numerieke veldvalidatie.
 */
export const isIntegerInRange = (
  value: string,
  min: number,
  max: number
): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num >= min && num <= max;
};
