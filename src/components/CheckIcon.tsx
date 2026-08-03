import React from "react";

interface CheckIconProps {
  className?: string;
  animated?: boolean;
}

const CheckIcon: React.FC<CheckIconProps> = ({
  className = "h-5 w-5",
  animated = false,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 13l4 4L19 7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      className={animated ? "animate-check" : undefined}
      style={animated ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined}
    />
  </svg>
);

export default CheckIcon;
