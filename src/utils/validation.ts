export type InputType = "text" | "email" | "password" | "number" | "textarea";

// --- Grenzen en maxima: één bron van waarheid voor UI én validatie ---

export const MIN_PASSWORD_LENGTH = 6;
export const PASSWORD_STRONG_LENGTH = 10;
export const MIN_AGE = 0;
export const MAX_AGE = 120;
export const MAX_PASSWORD_STRENGTH = 4;
export const MAX_NAME_LENGTH = 50;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 500;

// --- Veldconfiguratie: één bron van waarheid voor UI én validatie ---

export interface FieldConfig {
  name: string;
  label: string;
  type: InputType;
  icon: string;
  placeholder: string;
  required: boolean;
  autoComplete?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  hint?: string;
  step: number;
  showPasswordFeedback?: boolean;
}

export const FIELDS = [
  {
    name: "name",
    label: "Naam",
    type: "text",
    icon: "👤",
    placeholder: "Je voornaam",
    required: true,
    autoComplete: "name",
    maxLength: MAX_NAME_LENGTH,
    step: 0,
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    icon: "📧",
    placeholder: "jij@voorbeeld.nl",
    required: true,
    autoComplete: "email",
    maxLength: MAX_EMAIL_LENGTH,
    hint: "We delen je e-mailadres nooit met anderen 🤫",
    step: 0,
  },
  {
    name: "age",
    label: "Leeftijd",
    type: "number",
    icon: "🎂",
    placeholder: "18",
    required: true,
    autoComplete: "bday",
    min: MIN_AGE,
    max: MAX_AGE,
    hint: `Tussen ${MIN_AGE} en ${MAX_AGE} jaar`,
    step: 0,
  },
  {
    name: "password",
    label: "Wachtwoord",
    type: "password",
    icon: "🔒",
    placeholder: `Minstens ${MIN_PASSWORD_LENGTH} tekens`,
    required: true,
    autoComplete: "new-password",
    hint: `Minstens ${MIN_PASSWORD_LENGTH} tekens, hoofdletter, cijfer en symbool 💪`,
    showPasswordFeedback: true,
    step: 1,
  },
  {
    name: "confirmPassword",
    label: "Bevestig wachtwoord",
    type: "password",
    icon: "🔑",
    placeholder: "Herhaal je wachtwoord",
    required: true,
    autoComplete: "new-password",
    step: 1,
  },
  {
    name: "message",
    label: "Bericht",
    type: "textarea",
    icon: "💬",
    placeholder: "Vertel ons waar je hulp bij nodig hebt...",
    required: false,
    maxLength: MAX_MESSAGE_LENGTH,
    hint: "Optioneel — alles mag, niets moet",
    step: 2,
  },
] as const satisfies readonly FieldConfig[];

export type FormFieldName = (typeof FIELDS)[number]["name"];

export type FormData = { [K in FormFieldName]: string };

export type ValidationErrors = Partial<Record<FormFieldName, string>>;

export const FORM_FIELDS: readonly FormFieldName[] = FIELDS.map(
  (field) => field.name
);

export const isFormFieldName = (
  value: string | undefined
): value is FormFieldName =>
  typeof value === "string" && FIELDS.some((field) => field.name === value);

export const getFormFieldName = (
  value: string | undefined
): FormFieldName | undefined => (isFormFieldName(value) ? value : undefined);

// Velden die samen hervalideren (wachtwoord + bevestiging).
export const LINKED_FIELDS: Partial<
  Record<FormFieldName, readonly FormFieldName[]>
> = {
  password: ["password", "confirmPassword"],
  confirmPassword: ["password", "confirmPassword"],
};

const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasDigit = (value: string) => /\d/.test(value);
const hasSymbol = (value: string) => /[^a-zA-Z0-9]/.test(value);

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

const toPasswordStrength = (score: number): PasswordStrength => {
  if (score <= 0) return 0;
  if (score === 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return MAX_PASSWORD_STRENGTH;
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (password.length >= PASSWORD_STRONG_LENGTH) score += 1;
  if (hasLowercase(password) && hasUppercase(password)) score += 1;
  if (hasDigit(password) && hasSymbol(password)) score += 1;
  return toPasswordStrength(score);
};

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const getPasswordRequirements = (
  password: string
): PasswordRequirement[] => [
  {
    label: `minstens ${MIN_PASSWORD_LENGTH} tekens`,
    met: password.length >= MIN_PASSWORD_LENGTH,
  },
  { label: "een hoofdletter", met: hasUppercase(password) },
  { label: "een cijfer", met: hasDigit(password) },
  { label: "een symbool", met: hasSymbol(password) },
];

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Naam is verplicht";
  } else if (formData.name.trim().length > MAX_NAME_LENGTH) {
    errors.name = `Naam mag maximaal ${MAX_NAME_LENGTH} tekens bevatten`;
  }

  if (!formData.email.trim()) {
    errors.email = "E-mailadres is verplicht";
  } else if (formData.email.trim().length > MAX_EMAIL_LENGTH) {
    errors.email = `E-mailadres mag maximaal ${MAX_EMAIL_LENGTH} tekens bevatten`;
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Vul een geldig e-mailadres in (bijv. jij@voorbeeld.nl)";
  }

  if (!formData.password) {
    errors.password = "Wachtwoord is verplicht";
  } else {
    const missingRequirements = getPasswordRequirements(formData.password)
      .filter((requirement) => !requirement.met)
      .map((requirement) => requirement.label);
    if (missingRequirements.length > 0) {
      errors.password = `Wachtwoord mist: ${missingRequirements.join(", ")}`;
    }
  }

  if (formData.password && formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Wachtwoorden komen niet overeen";
  }

  if (!formData.age.trim()) {
    errors.age = "Leeftijd is verplicht";
  } else if (!isValidAge(formData.age)) {
    errors.age = `Vul een geldige leeftijd in (${MIN_AGE}-${MAX_AGE})`;
  }

  if (formData.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Bericht mag maximaal ${MAX_MESSAGE_LENGTH} tekens bevatten`;
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidAge = (age: string): boolean => {
  const num = Number(age);
  return Number.isInteger(num) && num >= MIN_AGE && num <= MAX_AGE;
};
