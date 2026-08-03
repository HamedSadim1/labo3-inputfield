import { STEP_EXIT_FALLBACK_MS } from "@/constants";
import { prefersReducedMotion, readCssDurationMs } from "@/utils/dom";
import { clamp } from "@/utils/number";
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
  const [currentStep, setCurrentStep] = useState(() =>
    clamp(initialStep, 0, stepCount - 1)
  );
  const [displayedStep, setDisplayedStep] = useState(() =>
    clamp(initialStep, 0, stepCount - 1)
  );
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
      prefersReducedMotion()
        ? 0
        : readCssDurationMs("--step-exit-duration", STEP_EXIT_FALLBACK_MS)
    );
    return true;
  };

  const resetTo = (step: number): void => {
    if (stepTimeoutRef.current !== null) {
      window.clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }
    setCurrentStep(clamp(step, 0, stepCount - 1));
    setDisplayedStep(clamp(step, 0, stepCount - 1));
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
