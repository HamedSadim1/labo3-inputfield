import React from "react";
import CheckIcon from "@/components/ui/CheckIcon";
import { cn } from "@/utils/cn";

interface StepIndicatorStep {
  title: string;
  emoji: string;
}

interface StepIndicatorProps {
  steps: ReadonlyArray<StepIndicatorStep>;
  currentStep: number;
  onStepClick: (index: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => (
  <nav aria-label="Formuliervoortgang" className="mb-6">
    <ol className="flex">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;
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
                    "block h-full rounded-full bg-linear-to-r from-emerald-600 to-teal-600 transition-all duration-500",
                    isDone ? "w-full" : "w-0"
                  )}
                />
              </span>
            )}

            <button
              type="button"
              onClick={() => onStepClick(index)}
              disabled={index > currentStep}
              aria-label={isDone ? `${step.title} (voltooid)` : step.title}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 disabled:cursor-not-allowed",
                isDone
                  ? "bg-linear-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-300/60"
                  : isCurrent
                    ? "scale-110 bg-linear-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-400/60 ring-4 ring-fuchsia-200"
                    : "border-2 border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-600"
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
                    ? "text-emerald-700"
                    : "text-slate-500"
              )}
            >
              {step.title}
            </span>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default StepIndicator;
