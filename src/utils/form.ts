import type {
  FormData,
  FormFieldName,
  ValidationErrors,
} from "@/utils/validation";

/** Bouwt een lege FormData met alle velden als lege string. */
export const createEmptyFormData = (
  fields: readonly FormFieldName[]
): FormData =>
  fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {} as FormData);

/** Zet of wist één veldfout in de errors-state (immutable). */
export const updateFieldError = (
  prev: ValidationErrors,
  field: FormFieldName,
  fieldError: string | undefined
): ValidationErrors => {
  const next = { ...prev };
  if (fieldError) {
    next[field] = fieldError;
  } else {
    delete next[field];
  }
  return next;
};

/** Houdt alleen de fouten over van de gegeven velden (per wizard-stap). */
export const filterErrorsByFields = (
  allErrors: ValidationErrors,
  fields: readonly FormFieldName[]
): ValidationErrors => {
  const stepErrors: ValidationErrors = {};
  fields.forEach((field) => {
    const fieldError = allErrors[field];
    if (fieldError) {
      stepErrors[field] = fieldError;
    }
  });
  return stepErrors;
};
