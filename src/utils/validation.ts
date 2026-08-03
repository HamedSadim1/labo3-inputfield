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

export const FORM_FIELDS: readonly string[] = [
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
  return 4;
};

export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
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
  { label: "minstens 6 tekens", met: password.length >= 6 },
  { label: "een hoofdletter", met: hasUppercase(password) },
  { label: "een cijfer", met: hasDigit(password) },
  { label: "een symbool", met: hasSymbol(password) },
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
