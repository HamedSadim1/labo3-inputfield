import React from "react";

type ButtonVariant = "primary" | "secondary" | "success";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "animate-gradient-x bg-linear-to-r from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-300/50 hover:shadow-xl hover:shadow-fuchsia-400/50 focus-visible:ring-fuchsia-300",
  secondary:
    "border-2 border-violet-200 bg-white text-violet-600 hover:border-violet-300 hover:shadow-lg focus-visible:ring-violet-200",
  success:
    "bg-linear-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-300/50 hover:shadow-xl hover:shadow-emerald-400/50 focus-visible:ring-emerald-300",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
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
      className={`rounded-2xl px-6 py-4 font-display text-lg font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${VARIANT_CLASSES[variant]} ${className}`}
    />
  );
};

export default Button;
