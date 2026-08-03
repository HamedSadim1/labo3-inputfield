import {
  CONFETTI_COLORS,
  CONFETTI_DURATION_SPREAD,
  CONFETTI_MAX_DELAY,
  CONFETTI_MIN_DURATION,
  CONFETTI_MIN_SIZE,
  CONFETTI_ROUND_EVERY,
  CONFETTI_SIZE_SPREAD,
} from "@/constants";

export interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  round: boolean;
}

/** Genereert een willekeurige confetti-regen voor het succes-scherm. */
export const createConfettiPieces = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * CONFETTI_MAX_DELAY,
    duration: CONFETTI_MIN_DURATION + Math.random() * CONFETTI_DURATION_SPREAD,
    color: CONFETTI_COLORS[id % CONFETTI_COLORS.length] ?? "#8b5cf6",
    size: CONFETTI_MIN_SIZE + Math.random() * CONFETTI_SIZE_SPREAD,
    round: id % CONFETTI_ROUND_EVERY === 0,
  }));
