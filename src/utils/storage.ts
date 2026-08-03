import { STORAGE_KEY } from "@/constants";
import { createEmptyFormData } from "@/utils/form";
import type { FormData, FormFieldName } from "@/utils/validation";
import {
  FORM_FIELDS,
  isFormFieldName,
  SENSITIVE_FIELDS,
} from "@/utils/validation";

export interface FormDraft {
  formData: FormData;
  currentStep: number;
}

// Wachtwoorden worden bewust NIET opgeslagen (privacy): ze worden als
// lege string bewaard en komen bij het laden ook leeg terug. Oude drafts
// die nog een wachtwoord bevatten worden daarnaast bij het laden gesaneerd.
const sanitizeFormData = (
  input: Partial<Record<FormFieldName, string>>
): FormData => {
  const safe = createEmptyFormData(FORM_FIELDS);
  FORM_FIELDS.forEach((field) => {
    if (SENSITIVE_FIELDS.includes(field)) {
      return;
    }
    const value = input[field];
    if (typeof value === "string") {
      safe[field] = value;
    }
  });
  return safe;
};

export const loadFormDraft = (): FormDraft | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredDraft(parsed)) {
      return null;
    }
    return {
      formData: sanitizeFormData(parsed.formData),
      currentStep: parsed.currentStep,
    };
  } catch {
    return null;
  }
};

export const saveFormDraft = (draft: FormDraft): void => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        formData: sanitizeFormData(draft.formData),
        currentStep: draft.currentStep,
      })
    );
  } catch {
    // localStorage is (tijdelijk) niet beschikbaar of vol — bewust negeren.
  }
};

export const clearFormDraft = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // idem
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

interface StoredDraft {
  formData: Partial<Record<FormFieldName, string>>;
  currentStep: number;
}

const isStoredDraft = (value: unknown): value is StoredDraft => {
  if (!isRecord(value)) {
    return false;
  }
  const formData = value.formData;
  const currentStep = value.currentStep;
  if (!isRecord(formData)) {
    return false;
  }
  if (typeof currentStep !== "number" || !Number.isInteger(currentStep)) {
    return false;
  }

  const fieldNames = Object.keys(formData);
  // SanitizeFormData bewaart altijd álle velden (gevoelige als ""), dus
  // het aantal keys is vast — legacy-drafts uit eerdere versies ook.
  const hasValidFields =
    fieldNames.length === FORM_FIELDS.length &&
    fieldNames.every(
      (name) => isFormFieldName(name) && typeof formData[name] === "string"
    );

  return hasValidFields && currentStep >= 0;
};
