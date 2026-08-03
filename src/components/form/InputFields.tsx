import React, { useEffect, useMemo, useRef, useState } from "react";
import InputField from "@/components/form/InputField";
import SuccessScreen from "@/components/form/SuccessScreen";
import Screen from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import CheckIcon from "@/components/ui/CheckIcon";
import { clearFormDraft, loadFormDraft, saveFormDraft } from "@/utils/storage";
import type { FormDraft } from "@/utils/storage";
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

const FEATURES: Array<[string, string]> = [
  ["⚡", "Realtime validatie en feedback"],
  ["🔒", "Je gegevens blijven veilig en privé"],
  ["🌈", "Kleurrijk, maar altijd toegankelijk"],
];

interface Step {
  title: string;
  emoji: string;
  fields: FormFieldName[];
}

const STEP_CONFIG: Array<{ title: string; emoji: string; step: number }> = [
  { title: "Gegevens", emoji: "👤", step: 0 },
  { title: "Veiligheid", emoji: "🔒", step: 1 },
  { title: "Bericht", emoji: "💬", step: 2 },
];

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
const initialFormData: FormData = FORM_FIELDS.reduce(
  (acc, field) => ({ ...acc, [field]: "" }),
  {} as FormData
);

type StepDirection = "forward" | "backward";

const STEP_ENTER: Record<StepDirection, string> = {
  forward: "animate-slide-in-right",
  backward: "animate-slide-in-left",
};

const STEP_EXIT: Record<StepDirection, string> = {
  forward: "animate-slide-out-left",
  backward: "animate-slide-out-right",
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Leest de uitgaande animatieduur uit de CSS-variabele, zodat JS en CSS
// één bron delen (geen handmatig gespiegelde waarde meer). De minifier
// normaliseert "250ms" soms naar ".25s", dus de eenheid telt mee.
const getStepExitMs = (): number => {
  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--step-exit-duration")
    .trim();
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 250;
  }
  return raw.endsWith("ms") ? parsed : parsed * 1000;
};

const getInitialStep = (draft: FormDraft | null): number =>
  Math.min(draft?.currentStep ?? 0, STEPS.length - 1);

const updateFieldError = (
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

const InputFields: React.FC = () => {
  const savedDraft = useMemo(loadFormDraft, []);

  const [formData, setFormData] = useState<FormData>(
    () => savedDraft?.formData ?? initialFormData
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(() =>
    getInitialStep(savedDraft)
  );
  const [displayedStep, setDisplayedStep] = useState(() =>
    getInitialStep(savedDraft)
  );
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const stepTimeoutRef = useRef<number | null>(null);

  // Bewaar de formuliergegevens en huidige stap, zodat de wizard een
  // paginaverversing overleeft.
  useEffect(() => {
    saveFormDraft({ formData, currentStep });
  }, [formData, currentStep]);

  // Ruim een lopende stapovergang op als de wizard wordt afgebroken.
  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current !== null) {
        window.clearTimeout(stepTimeoutRef.current);
      }
    };
  }, []);

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

  const getStepErrors = (step: number): ValidationErrors => {
    const allErrors = validateForm(formData);
    const stepErrors: ValidationErrors = {};
    STEPS[step]?.fields.forEach((field) => {
      const fieldError = allErrors[field];
      if (fieldError) {
        stepErrors[field] = fieldError;
      }
    });
    return stepErrors;
  };

  const focusFieldAfterRender = (field: FormFieldName) => {
    window.setTimeout(() => {
      document.getElementById(field)?.focus();
    }, 0);
  };

  const goToStep = (
    nextStep: number,
    options: { clearErrors?: boolean; focusField?: FormFieldName } = {}
  ) => {
    const { clearErrors = true, focusField } = options;
    if (nextStep === currentStep) {
      return;
    }
    setDirection(nextStep > currentStep ? "forward" : "backward");
    setPhase("exit");
    setCurrentStep(nextStep);
    if (clearErrors) {
      setErrors({});
    }
    if (stepTimeoutRef.current !== null) {
      window.clearTimeout(stepTimeoutRef.current);
    }
    stepTimeoutRef.current = window.setTimeout(
      () => {
        setDisplayedStep(nextStep);
        setPhase("enter");
        const firstField = focusField ?? STEPS[nextStep]?.fields[0];
        if (firstField) {
          focusFieldAfterRender(firstField);
        }
        stepTimeoutRef.current = null;
      },
      // Bij prefers-reduced-motion zijn de CSS-animaties uitgeschakeld;
      // wissel dan direct zonder de exit-vertraging.
      prefersReducedMotion() ? 0 : getStepExitMs()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valideer de huidige stap; de laatste stap verzendt het formulier.
    if (currentStep < STEPS.length - 1) {
      const stepErrors = getStepErrors(currentStep);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        const firstError = getFormFieldName(Object.keys(stepErrors)[0]);
        if (firstError) {
          focusFieldAfterRender(firstError);
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
    focusFieldAfterRender(firstField);
  };

  const resetForm = () => {
    if (stepTimeoutRef.current !== null) {
      window.clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
    setCurrentStep(0);
    setDisplayedStep(0);
    setPhase("enter");
  };

  if (submitted) {
    return <SuccessScreen formData={formData} onReset={resetForm} />;
  }

  return (
    <Screen variant="playful">
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 py-12 lg:flex-row lg:gap-20">
        <section className="w-full max-w-md text-center lg:w-auto lg:max-w-sm lg:text-left">
          <span className="inline-flex animate-pop items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-sm font-bold text-violet-600 shadow-sm">
            🎉 Nieuwe look, zelfde formulier
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
            Hé, laten we{" "}
            <span className="bg-linear-to-r from-violet-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
              kennismaken
            </span>
            !
          </h1>

          <p className="mt-4 text-base font-medium text-slate-600 sm:text-lg">
            Vul het formulier hiernaast in en we nemen snel contact met je op.
            💌
          </p>

          <ul className="mt-6 space-y-3 text-left">
            {FEATURES.map(([emoji, text]) => (
              <li
                key={text}
                className="flex items-center gap-3 text-sm font-semibold text-slate-700"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm">
                  {emoji}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className="w-full max-w-lg">
          <div className="animate-rise rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-violet-300/40 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-800">
                  Contactformulier 📝
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Velden met een * zijn verplicht
                </p>
              </div>
              <span className="rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                Stap {currentStep + 1}/{STEPS.length}
              </span>
            </div>

            {/* Progress-indicator */}
            <nav aria-label="Formuliervoortgang" className="mb-8">
              <ol className="flex">
                {STEPS.map((step, index) => {
                  const isDone = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isLast = index === STEPS.length - 1;
                  return (
                    <li
                      key={step.title}
                      className="relative flex flex-1 flex-col items-center"
                    >
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 top-6 h-1 w-full -translate-y-1/2 overflow-hidden rounded-full bg-slate-200"
                        >
                          <span
                            className={cn(
                              "block h-full rounded-full bg-linear-to-r from-emerald-400 to-teal-500 transition-all duration-500",
                              isDone ? "w-full" : "w-0"
                            )}
                          />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => goToStep(index)}
                        disabled={index > currentStep}
                        aria-label={
                          isDone ? `${step.title} (voltooid)` : step.title
                        }
                        aria-current={isCurrent ? "step" : undefined}
                        className={cn(
                          "relative flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 disabled:cursor-not-allowed",
                          isDone
                            ? "bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-300/60"
                            : isCurrent
                              ? "scale-110 bg-linear-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-400/60 ring-4 ring-fuchsia-200"
                              : "border-2 border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-500"
                        )}
                      >
                        {isDone ? (
                          <CheckIcon />
                        ) : (
                          <span aria-hidden="true">{step.emoji}</span>
                        )}
                      </button>

                      <span
                        className={cn(
                          "mt-2 text-xs font-bold transition-colors duration-300",
                          isCurrent
                            ? "text-violet-600"
                            : isDone
                              ? "text-emerald-600"
                              : "text-slate-400"
                        )}
                      >
                        {step.title}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div
                key={displayedStep}
                className={cn(
                  phase === "exit"
                    ? STEP_EXIT[direction]
                    : STEP_ENTER[direction],
                  "space-y-5"
                )}
              >
                {" "}
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

              <div className="flex gap-3 pt-2">
                {currentStep > 0 && (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => goToStep(currentStep - 1)}
                  >
                    ← Vorige
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="group flex flex-1 items-center justify-center gap-2"
                >
                  {currentStep === STEPS.length - 1 ? (
                    <>
                      <span
                        className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                        aria-hidden="true"
                      >
                        🚀
                      </span>
                      Verzenden
                    </>
                  ) : (
                    <>
                      Volgende
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </Screen>
  );
};

export default InputFields;
