import React from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "success";
type ButtonSize = "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "animate-gradient-x bg-linear-to-r from-violet-600 via-fuchsia-600 to-fuchsia-600 text-white shadow-lg shadow-fuchsia-300/50 hover:shadow-xl hover:shadow-fuchsia-400/50 focus-visible:ring-fuchsia-300",
  secondary:
    "border-2 border-violet-200 bg-white text-violet-600 hover:border-violet-300 hover:shadow-lg focus-visible:ring-violet-200",
  // from-teal-700 to-emerald-700: witte tekst haalt hiermee AA (5.47:1),
  // waar de eerdere 500/600-niveaus op 2.5-3.8:1 bleven steken.
  success:
    "bg-linear-to-r from-teal-700 to-emerald-700 text-white shadow-lg shadow-emerald-300/50 hover:shadow-xl hover:shadow-emerald-400/50 focus-visible:ring-emerald-300",
};

// De grootte verschilt bewust in hoogte én lettergrootte, zodat een
// secundaire actie (md) duidelijk ondergeschikt is aan de primaire (lg).
const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "lg",
  className = "",
  style,
  type = "button",
  ...props
}) => {
  const isGradient = variant !== "secondary";
  return (
    <button
      {...props}
      type={type}
      style={{
        ...(isGradient ? { backgroundSize: "200% auto" } : null),
        ...style,
      }}
      className={cn(
        "rounded-2xl font-display font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
    />
  );
};

export default Button;
