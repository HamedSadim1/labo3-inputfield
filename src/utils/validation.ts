export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  message: string;
}

export type FormFieldName = keyof FormData;

export type ValidationErrors = Partial<Record<FormFieldName, string>>;

const FORM_FIELDS: readonly string[] = [
  "name",
  "email",
  "password",
  "confirmPassword",
  "age",
  "message",
];

export const isFormFieldName = (
  value: string | undefined
): value is FormFieldName =>
  typeof value === "string" && FORM_FIELDS.includes(value);

const MAX_AGE = 120;

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1;
  return score as PasswordStrength;
};

export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export const getPasswordRequirements = (
  password: string
): PasswordRequirement[] => [
  { label: "Minstens 6 tekens", met: password.length >= 6 },
  { label: "Hoofdletter", met: /[A-Z]/.test(password) },
  { label: "Cijfer", met: /\d/.test(password) },
  { label: "Symbool", met: /[^a-zA-Z0-9]/.test(password) },
];

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Naam is verplicht";
  }

  if (!formData.email.trim()) {
    errors.email = "E-mailadres is verplicht";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Vul een geldig e-mailadres in (bijv. jij@voorbeeld.nl)";
  }

  if (!formData.password) {
    errors.password = "Wachtwoord is verplicht";
  } else if (formData.password.length < 6) {
    errors.password = "Wachtwoord moet minstens 6 tekens bevatten";
  }

  if (formData.password && formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Wachtwoorden komen niet overeen";
  }

  if (!formData.age.trim()) {
    errors.age = "Leeftijd is verplicht";
  } else if (!isValidAge(formData.age)) {
    errors.age = `Vul een geldige leeftijd in (0-${MAX_AGE})`;
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidAge = (age: string): boolean => {
  const num = Number(age);
  return Number.isInteger(num) && num >= 0 && num <= MAX_AGE;
};
