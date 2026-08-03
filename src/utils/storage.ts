import type { FormData } from "@/utils/validation";
import { FORM_FIELDS, isFormFieldName } from "@/utils/validation";

const STORAGE_KEY = "contact-form-draft";

export interface FormDraft {
  formData: FormData;
  currentStep: number;
}

export const loadFormDraft = (): FormDraft | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isFormDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveFormDraft = (draft: FormDraft): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
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

const isFormDraft = (value: unknown): value is FormDraft => {
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
  const hasValidFields =
    fieldNames.length === FORM_FIELDS.length &&
    fieldNames.every(
      (name) => isFormFieldName(name) && typeof formData[name] === "string"
    );

  return hasValidFields && currentStep >= 0;
};
