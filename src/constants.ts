// Centrale bron voor gedeelde constanten en magische waarden (SSOT).
// Gebruik deze overal in plaats van losse literals; groepeer per domein.

// --- Wachtwoord ---

/** Minimale wachtwoordlengte voor validatie en checklist. */
export const MIN_PASSWORD_LENGTH = 6;

/** Lengte vanaf wanneer het wachtwoord een extra sterktepunt krijgt. */
export const PASSWORD_STRONG_LENGTH = 10;

// Gekoppeld aan het PasswordStrength-type (0-4) en STRENGTH_META: als de
// schaal ooit groter moet, pas dit getal én het type samen aan.
export const MAX_PASSWORD_STRENGTH = 4;

// --- Leeftijd ---

export const MIN_AGE = 0;
export const MAX_AGE = 120;

// --- Veld-maxima ---

export const MAX_NAME_LENGTH = 50;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 500;

// --- Storage ---

/** localStorage-sleutel voor de bewaarde formulier-draft. */
export const STORAGE_KEY = "contact-form-draft";

// --- Wizard ---

export interface StepConfig {
  title: string;
  emoji: string;
  step: number;
}

/** De drie wizard-stappen (titel + emoji + stap-index van de velden). */
export const STEP_CONFIG: readonly StepConfig[] = [
  { title: "Gegevens", emoji: "👤", step: 0 },
  { title: "Veiligheid", emoji: "🔒", step: 1 },
  { title: "Bericht", emoji: "💬", step: 2 },
];

/** Fallback-duur (ms) voor de uitgaande stapovergang als de CSS-variabele ontbreekt. */
export const STEP_EXIT_FALLBACK_MS = 250;

// --- UI ---

/** Standaard aantal rijen voor textarea-velden. */
export const DEFAULT_TEXTAREA_ROWS = 4;

// --- Succes-scherm (confetti) ---

export const CONFETTI_COUNT = 30;

export const CONFETTI_COLORS: readonly string[] = [
  "#8b5cf6",
  "#d946ef",
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#f43f5e",
];

/** Maximale startvertraging van een confetti-stukje (s). */
export const CONFETTI_MAX_DELAY = 3;

/** Minimale valduur (s). */
export const CONFETTI_MIN_DURATION = 3.5;

/** Spreiding van de valduur (s). */
export const CONFETTI_DURATION_SPREAD = 3;

/** Minimale grootte van een confetti-stukje (px). */
export const CONFETTI_MIN_SIZE = 6;

/** Spreiding van de grootte (px). */
export const CONFETTI_SIZE_SPREAD = 8;

/** Verhouding hoogte/breedte van een confetti-stukje. */
export const CONFETTI_HEIGHT_RATIO = 1.6;

/** Elke N-de confetti is rond. */
export const CONFETTI_ROUND_EVERY = 3;

/** Hoelang de confetti zichtbaar is op het succes-scherm (ms). */
export const CONFETTI_LIFETIME_MS = 9000;

/** Fade-outduur van de confetti aan het einde (ms). */
export const CONFETTI_FADE_MS = 1000;
