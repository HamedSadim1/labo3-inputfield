import React, { useMemo } from "react";
import FloatingBackground from "./FloatingBackground";
import type { FormData } from "../utils/validation";

interface SuccessScreenProps {
  formData: FormData;
  onReset: () => void;
}

const CONFETTI_COLORS = [
  "#8b5cf6",
  "#d946ef",
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#f43f5e",
];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  round: boolean;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData, onReset }) => {
  const confetti = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 30 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3.5 + Math.random() * 3,
        color: CONFETTI_COLORS[id % CONFETTI_COLORS.length] ?? "#8b5cf6",
        size: 6 + Math.random() * 8,
        round: id % 3 === 0,
      })),
    []
  );

  const summary: Array<[string, string]> = [
    ["Naam", formData.name],
    ["E-mail", formData.email],
    ["Leeftijd", formData.age],
    ["Bericht", formData.message || "—"],
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-linear-to-br from-emerald-100 via-teal-100 to-sky-100">
      <FloatingBackground variant="celebration" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="absolute top-[-20px] block animate-confetti"
            style={{
              left: `${piece.left}%`,
              width: piece.size,
              height: piece.size * 1.6,
              backgroundColor: piece.color,
              borderRadius: piece.round ? "9999px" : "3px",
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-12">
        <div className="animate-bounce-in w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-2xl shadow-teal-300/50 backdrop-blur-xl sm:p-10">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-300/40" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-300/60">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-12 w-12 text-white"
              >
                <path
                  pathLength={1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  className="animate-check"
                  style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                />
              </svg>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-slate-800">
            Verzonden! 🎉
          </h2>
          <p className="mt-2 text-base font-medium text-slate-600">
            Super,{" "}
            <span className="font-bold text-violet-600">
              {formData.name || "daar"}
            </span>
            ! We hebben je bericht ontvangen en nemen snel contact op. ✨
          </p>

          <dl className="mt-7 space-y-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-left">
            {summary.map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4"
              >
                <dt className="shrink-0 text-sm font-bold uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd className="whitespace-pre-line break-words text-right text-sm font-semibold text-slate-700">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <button
            onClick={onReset}
            className="mt-8 w-full rounded-2xl bg-linear-to-r from-teal-500 to-emerald-500 px-6 py-4 font-display text-lg font-bold text-white shadow-lg shadow-emerald-300/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-400/50 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            ✏️ Nieuw formulier
          </button>
        </div>
      </main>
    </div>
  );
};

export default SuccessScreen;
