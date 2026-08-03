import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CONFETTI_COUNT,
  CONFETTI_FADE_MS,
  CONFETTI_HEIGHT_RATIO,
  CONFETTI_LIFETIME_MS,
} from "@/constants";
import { createConfettiPieces } from "@/utils/confetti";
import Button from "@/components/ui/Button";
import CheckIcon from "@/components/ui/CheckIcon";
import Screen from "@/components/layout/Screen";
import { cn } from "@/utils/cn";
import type { FormData } from "@/utils/validation";

interface SuccessScreenProps {
  formData: FormData;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData, onReset }) => {
  const confetti = useMemo(() => createConfettiPieces(CONFETTI_COUNT), []);

  // Na verzenden valt de focus terug naar <body>; verplaats hem naar de
  // succes-kop, zodat screenreaders en toetsenbordgebruikers weten dat de
  // flow is voltooid. tabIndex={-1} maakt de h1 programmeerbaar focuseerbaar.
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // De confetti valt niet oneindig: na een tijd een korte fade-out en dan
  // unmount (rustiger voor de gebruiker én de batterij).
  const [confettiPhase, setConfettiPhase] = useState<
    "active" | "fading" | "done"
  >("active");

  useEffect(() => {
    const fadeTimer = window.setTimeout(
      () => setConfettiPhase("fading"),
      CONFETTI_LIFETIME_MS
    );
    const doneTimer = window.setTimeout(
      () => setConfettiPhase("done"),
      CONFETTI_LIFETIME_MS + CONFETTI_FADE_MS
    );
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  const summary: Array<[string, string]> = [
    ["Naam", formData.name],
    ["E-mail", formData.email],
    ["Leeftijd", formData.age],
    ["Bericht", formData.message || "—"],
  ];

  return (
    <Screen variant="celebration">
      {confettiPhase !== "done" && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden transition-opacity",
            confettiPhase === "fading" && "opacity-0"
          )}
          style={{ transitionDuration: `${CONFETTI_FADE_MS}ms` }}
        >
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="absolute -top-5 block animate-confetti"
              style={{
                left: `${piece.left}%`,
                width: piece.size,
                height: piece.size * CONFETTI_HEIGHT_RATIO,
                backgroundColor: piece.color,
                borderRadius: piece.round ? "9999px" : "3px",
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-12">
        <div className="animate-bounce-in w-full max-w-lg overflow-hidden rounded-4xl border border-white/70 bg-white/90 p-8 text-center shadow-2xl shadow-teal-300/50 backdrop-blur-xl sm:p-10">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-300/40" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-300/60">
              <CheckIcon className="h-12 w-12 text-white" animated />
            </div>
          </div>

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-3xl font-bold text-slate-800"
          >
            Verzonden! 🎉
          </h1>
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
                <dt className="shrink-0 text-sm font-bold uppercase tracking-wide text-slate-500">
                  {label}
                </dt>
                <dd className="whitespace-pre-line wrap-break-word text-right text-sm font-semibold text-slate-700">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <Button variant="success" onClick={onReset} className="mt-8 w-full">
            ✏️ Nieuw formulier
          </Button>
        </div>
      </main>
    </Screen>
  );
};

export default SuccessScreen;
