import React, { useEffect, useMemo, useState } from "react";
import { STEP_CONFIG } from "@/constants";
import InputField from "@/components/form/InputField";
import StepIndicator from "@/components/form/StepIndicator";
import WizardActions from "@/components/form/WizardActions";
import WizardHero from "@/components/form/WizardHero";
import { useWizardSteps } from "@/components/form/useWizardSteps";
import Screen from "@/components/layout/Screen";
import SuccessScreen from "@/components/form/SuccessScreen";
import { clearFormDraft, loadFormDraft, saveFormDraft } from "@/utils/storage";
import { focusElementAfterRender } from "@/utils/dom";
import {
  createEmptyFormData,
  filterErrorsByFields,
  updateFieldError,
} from "@/utils/form";
import { clamp } from "@/utils/number";
import type {
  FieldConfig,
  FormData,
  FormFieldName,
  ValidationErrors,
} from "@/utils/validation";
import {
  FIELDS,
  FORM_FIELDS,
  getFormFieldName,
  LINKED_FIELDS,
  validateForm,
} from "@/utils/validation";
import { cn } from "@/utils/cn";

interface Step {
  title: string;
  emoji: string;
  fields: FormFieldName[];
}

// Velden per stap afgeleid uit de veldconfig, zodat de stapindeling en de
// velden nooit uit elkaar kunnen lopen.
const STEPS: Step[] = STEP_CONFIG.map(({ title, emoji, step }) => ({
  title,
  emoji,
  fields: FIELDS.filter((field) => field.step === step).map(
    (field) => field.name
  ),
}));

// Dev-tijd-invariant: een veld met een stap die niet in STEP_CONFIG zit,
// zou stilzwijgend nooit worden gerenderd — dat willen we vroeg zien.
if (import.meta.env.DEV) {
  const fieldsWithoutStep = FIELDS.filter(
    (field) => !STEP_CONFIG.some((config) => config.step === field.step)
  );
  if (fieldsWithoutStep.length > 0) {
    console.error(
      `Veld(er) zonder bijbehorende stap in STEP_CONFIG: ${fieldsWithoutStep
        .map((field) => field.name)
        .join(", ")}`
    );
  }
}

// Afgeleid uit de veldconfig: nieuwe velden hoeven hier niet te worden
// bijgehouden. De {} as FormData-cast is nodig als startwaarde en wordt
// direct daarna volledig gevuld.
const initialFormData = createEmptyFormData(FORM_FIELDS);

const InputFields: React.FC = () => {
  const savedDraft = useMemo(loadFormDraft, []);
  const wizard = useWizardSteps(
    STEPS.length,
    clamp(savedDraft?.currentStep ?? 0, 0, STEPS.length - 1)
  );
  const { currentStep, displayedStep, transitionClass, resetTo } = wizard;

  const [formData, setFormData] = useState<FormData>(
    () => savedDraft?.formData ?? initialFormData
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Bewaar de formuliergegevens en huidige stap, zodat de wizard een
  // paginaverversing overleeft.
  useEffect(() => {
    saveFormDraft({ formData, currentStep });
  }, [formData, currentStep]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const field = getFormFieldName(name);
    if (!field) {
      return;
    }
    const next = { ...formData, [field]: value };
    setFormData(next);

    // Zodra een (gekoppeld) veld een fout heeft, live hervalideren zodat
    // de fout meteen verdwijnt wanneer de gebruiker het corrigeert.
    setErrors((prev) => {
      const relatedFields: readonly FormFieldName[] = LINKED_FIELDS[field] ?? [
        field,
      ];
      if (!relatedFields.some((relatedField) => prev[relatedField])) {
        return prev;
      }
      const nextErrors = validateForm(next);
      return relatedFields.reduce(
        (acc, relatedField) =>
          updateFieldError(acc, relatedField, nextErrors[relatedField]),
        prev
      );
    });
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const field = getFormFieldName(e.target.name);
    if (!field) {
      return;
    }
    setErrors((prev) =>
      updateFieldError(prev, field, validateForm(formData)[field])
    );
  };

  const goToStep = (
    nextStep: number,
    options: { clearErrors?: boolean; focusField?: FormFieldName } = {}
  ) => {
    const { clearErrors = true, focusField } = options;
    const started = wizard.goToStep(nextStep, {
      onSwapped: (step) => {
        const firstField = focusField ?? STEPS[step]?.fields[0];
        if (firstField) {
          focusElementAfterRender(firstField);
        }
      },
    });
    // Wis fouten alleen bij een echte navigatie (niet bij klik op de
    // huidige stap), zodat het gedrag identiek blijft aan voorheen.
    if (started && clearErrors) {
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valideer de huidige stap; de laatste stap verzendt het formulier.
    if (currentStep < STEPS.length - 1) {
      const stepErrors = filterErrorsByFields(
        validateForm(formData),
        STEPS[currentStep]?.fields ?? []
      );
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        const firstError = getFormFieldName(Object.keys(stepErrors)[0]);
        if (firstError) {
          focusElementAfterRender(firstError);
        }
        return;
      }
      goToStep(currentStep + 1);
      return;
    }

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      clearFormDraft();
      setSubmitted(true);
      return;
    }
    setErrors(validationErrors);
    const firstField = getFormFieldName(Object.keys(validationErrors)[0]);
    if (!firstField) {
      return;
    }
    const errorStep = STEPS.findIndex((step) =>
      step.fields.includes(firstField)
    );
    if (errorStep >= 0 && errorStep !== currentStep) {
      goToStep(errorStep, { clearErrors: false, focusField: firstField });
      return;
    }
    focusElementAfterRender(firstField);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
    resetTo(0);
    // Na het opnieuw starten de focus naar het eerste veld verplaatsen,
    // zodat toetsenbordgebruikers niet terugvallen naar <body>.
    const firstField = STEPS[0]?.fields[0];
    if (firstField) {
      focusElementAfterRender(firstField);
    }
  };

  if (submitted) {
    return <SuccessScreen formData={formData} onReset={resetForm} />;
  }

  return (
    <Screen variant="playful">
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 py-12 lg:flex-row lg:gap-20">
        <WizardHero />

        <section className="w-full max-w-lg">
          <div className="animate-rise rounded-4xl border border-white/70 bg-white/85 p-6 shadow-2xl shadow-violet-300/40 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-800 sm:text-3xl">
                  Contactformulier 📝
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Velden met een * zijn verplicht
                </p>
              </div>
              {/* displayedStep i.p.v. currentStep: tijdens de exit-animatie
                  toont de badge nog de stap die zichtbaar is. */}
              <span className="shrink-0 whitespace-nowrap rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Stap {displayedStep + 1}/{STEPS.length}
              </span>
            </div>

            <StepIndicator
              steps={STEP_CONFIG}
              currentStep={currentStep}
              onStepClick={goToStep}
            />

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div
                key={displayedStep}
                className={cn(transitionClass, "space-y-5")}
              >
                {FIELDS.filter((field) => field.step === displayedStep).map(
                  (field) => {
                    // Verbreed naar FieldConfig, zodat de optionele velden
                    // (autoComplete, hint, ...) zonder cast toegankelijk zijn.
                    const config: FieldConfig = field;
                    return (
                      <InputField
                        key={config.name}
                        label={config.label}
                        type={config.type}
                        id={config.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors[field.name]}
                        placeholder={config.placeholder}
                        icon={config.icon}
                        required={config.required}
                        autoComplete={config.autoComplete}
                        min={
                          config.min !== undefined
                            ? String(config.min)
                            : undefined
                        }
                        max={
                          config.max !== undefined
                            ? String(config.max)
                            : undefined
                        }
                        maxLength={config.maxLength}
                        hint={config.hint}
                        showPasswordFeedback={config.showPasswordFeedback}
                      />
                    );
                  }
                )}
              </div>

              <WizardActions
                currentStep={currentStep}
                totalSteps={STEPS.length}
                onBack={() => goToStep(currentStep - 1)}
              />
            </form>
          </div>
        </section>
      </main>
    </Screen>
  );
};

export default InputFields;
