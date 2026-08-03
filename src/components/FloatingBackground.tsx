import React from "react";
import { cn } from "../utils/cn";

interface FloatingBackgroundProps {
  variant?: "playful" | "celebration";
}

interface Sticker {
  emoji: string;
  className: string;
  delay: string;
}

const STICKERS: Sticker[] = [
  { emoji: "🎈", className: "left-[6%] top-[16%] text-4xl", delay: "0s" },
  { emoji: "⭐", className: "right-[7%] top-[12%] text-3xl", delay: "1.2s" },
  { emoji: "🌈", className: "bottom-[14%] left-[9%] text-4xl", delay: "2.4s" },
  {
    emoji: "🎉",
    className: "bottom-[20%] right-[11%] text-4xl",
    delay: "0.8s",
  },
  { emoji: "✨", className: "left-[47%] top-[6%] text-2xl", delay: "1.8s" },
  { emoji: "💜", className: "bottom-[5%] right-[45%] text-2xl", delay: "3s" },
];

const FloatingBackground: React.FC<FloatingBackgroundProps> = ({
  variant = "playful",
}) => {
  const isCelebration = variant === "celebration";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-blob rounded-full bg-violet-300/40 blur-3xl" />
      <div
        className="absolute -right-28 top-1/3 h-80 w-80 animate-blob rounded-full bg-amber-300/40 blur-3xl"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="absolute -bottom-28 left-1/4 h-96 w-96 animate-blob rounded-full bg-rose-300/40 blur-3xl"
        style={{ animationDelay: "-8s" }}
      />
      {isCelebration && (
        <div
          className="absolute -left-20 bottom-1/4 h-72 w-72 animate-blob rounded-full bg-emerald-300/40 blur-3xl"
          style={{ animationDelay: "-2s" }}
        />
      )}

      {STICKERS.map((sticker) => (
        <span
          key={sticker.emoji}
          className={cn(
            "absolute hidden animate-float select-none drop-shadow-lg sm:block",
            sticker.className
          )}
          style={{ animationDelay: sticker.delay }}
        >
          {sticker.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingBackground;
