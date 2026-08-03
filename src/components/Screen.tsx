import React from "react";
import FloatingBackground from "./FloatingBackground";

type ScreenVariant = "playful" | "celebration";

interface ScreenProps {
  variant?: ScreenVariant;
  children: React.ReactNode;
}

const SCREEN_BG: Record<ScreenVariant, string> = {
  playful: "from-amber-100 via-rose-100 to-violet-200",
  celebration: "from-emerald-100 via-teal-100 to-sky-100",
};

const Screen: React.FC<ScreenProps> = ({ variant = "playful", children }) => (
  <div
    className={`relative min-h-dvh overflow-hidden bg-linear-to-br ${SCREEN_BG[variant]}`}
  >
    <FloatingBackground variant={variant} />
    {children}
  </div>
);

export default Screen;
