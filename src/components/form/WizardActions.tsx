import React from "react";
import Button from "@/components/ui/Button";

interface WizardActionsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

const WizardActions: React.FC<WizardActionsProps> = ({
  currentStep,
  totalSteps,
  onBack,
}) => (
  <div className="flex gap-3 pt-2">
    {currentStep > 0 && (
      <Button variant="secondary" size="md" onClick={onBack}>
        ← Vorige
      </Button>
    )}

    <Button
      type="submit"
      variant="primary"
      className="group flex flex-1 items-center justify-center gap-2"
    >
      {currentStep === totalSteps - 1 ? (
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
);

export default WizardActions;
