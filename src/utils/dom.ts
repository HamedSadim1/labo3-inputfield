/** True als de gebruiker verminderde beweging wenst (prefers-reduced-motion). */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Leest een CSS-variabele van :root (afgetrimd). */
export const getCssVariableValue = (name: string): string =>
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

/**
 * Zet een CSS-duur om naar milliseconden. De minifier normaliseert
 * "250ms" soms naar ".25s", dus de eenheid telt mee. Geeft `null`
 * terug bij een ongeldige of niet-positieve waarde.
 */
export const parseCssDurationToMs = (raw: string): number | null => {
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return raw.endsWith("ms") ? parsed : parsed * 1000;
};

/**
 * Leest een CSS-duurvariabele van :root en zet die om naar milliseconden,
 * met een fallback als de variabele ontbreekt of ongeldig is.
 */
export const readCssDurationMs = (name: string, fallbackMs: number): number =>
  parseCssDurationToMs(getCssVariableValue(name)) ?? fallbackMs;

/** Richt de focus op een element (ná de render, zoals bij stapwissels). */
export const focusElementAfterRender = (id: string): void => {
  window.setTimeout(() => {
    document.getElementById(id)?.focus();
  }, 0);
};
