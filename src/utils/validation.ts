export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  message: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
  message?: string;
}

export const validateForm = (formData: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Naam is verplicht";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is verplicht";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Ongeldig email adres";
  }

  if (!formData.password) {
    errors.password = "Wachtwoord is verplicht";
  } else if (formData.password.length < 6) {
    errors.password = "Wachtwoord moet minstens 6 karakters zijn";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Wachtwoorden komen niet overeen";
  }

  if (!formData.age) {
    errors.age = "Leeftijd is verplicht";
  } else if (!isValidAge(formData.age)) {
    errors.age = "Ongeldige leeftijd";
  }

  return errors;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

const isValidAge = (age: string): boolean => {
  const num = Number(age);
  return !isNaN(num) && num >= 0 && Number.isInteger(num);
};
