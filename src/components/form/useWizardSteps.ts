import { useEffect, useRef, useState } from "react";

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

interface GoToStepOptions {
  /** Wordt aangeroepen ná de wissel, zodra de nieuwe stap zichtbaar is. */
  onSwapped?: (step: number) => void;
}

export interface UseWizardStepsResult {
  /** De doel-stap (stuurt stepper, validatie en label aan). */
  currentStep: number;
  /** De stap die momenteel écht getoond wordt (tijdens exit nog de oude). */
  displayedStep: number;
  /** De animatieklasse voor de stapovergang (exit of enter). */
  transitionClass: string;
  /**
   * Start een overgang naar nextStep. Geeft `false` terug als dat een
   * no-op is (zelfde stap), zodat de aanroeper foutmeldingen alleen
   * wist bij een echte navigatie.
   */
  goToStep: (nextStep: number, options?: GoToStepOptions) => boolean;
  /** Springt direct naar een stap zonder overgang (o.a. bij reset). */
  resetTo: (step: number) => void;
}

export const useWizardSteps = (
  stepCount: number,
  initialStep: number
): UseWizardStepsResult => {
  const clamp = (step: number) => Math.min(Math.max(step, 0), stepCount - 1);

  const [currentStep, setCurrentStep] = useState(() => clamp(initialStep));
  const [displayedStep, setDisplayedStep] = useState(() => clamp(initialStep));
  const [direction, setDirection] = useState<StepDirection>("forward");
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const stepTimeoutRef = useRef<number | null>(null);

  // Ruim een lopende stapovergang op als de wizard wordt afgebroken.
  useEffect(() => {
    return () => {
      if (stepTimeoutRef.current !== null) {
        window.clearTimeout(stepTimeoutRef.current);
      }
    };
  }, []);

  const goToStep = (
    nextStep: number,
    options: GoToStepOptions = {}
  ): boolean => {
    if (nextStep === currentStep) {
      return false;
    }
    setDirection(nextStep > currentStep ? "forward" : "backward");
    setPhase("exit");
    setCurrentStep(nextStep);
    if (stepTimeoutRef.current !== null) {
      window.clearTimeout(stepTimeoutRef.current);
    }
    stepTimeoutRef.current = window.setTimeout(
      () => {
        setDisplayedStep(nextStep);
        setPhase("enter");
        options.onSwapped?.(nextStep);
        stepTimeoutRef.current = null;
      },
      // Bij prefers-reduced-motion zijn de CSS-animaties uitgeschakeld;
      // wissel dan direct zonder de exit-vertraging.
      prefersReducedMotion() ? 0 : getStepExitMs()
    );
    return true;
  };

  const resetTo = (step: number): void => {
    if (stepTimeoutRef.current !== null) {
      window.clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    setCurrentStep(clamp(step));
    setDisplayedStep(clamp(step));
    setPhase("enter");
  };

  return {
    currentStep,
    displayedStep,
    transitionClass:
      phase === "exit" ? STEP_EXIT[direction] : STEP_ENTER[direction],
    goToStep,
    resetTo,
  };
};
