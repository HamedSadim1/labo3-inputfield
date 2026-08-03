import React from "react";

const FEATURES: Array<[string, string]> = [
  ["⚡", "Realtime validatie en feedback"],
  ["🔒", "Je gegevens blijven veilig en privé"],
  ["🌈", "Kleurrijk, maar altijd toegankelijk"],
];

const WizardHero: React.FC = () => (
  <section className="w-full max-w-md text-center lg:w-auto lg:text-left">
    <span className="inline-flex animate-pop items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-sm font-bold text-violet-600 shadow-sm">
      🎉 Nieuwe look, zelfde formulier
    </span>

    <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
      Hé, laten we{" "}
      <span className="bg-linear-to-r from-violet-600 via-fuchsia-500 to-fuchsia-600 bg-clip-text text-transparent">
        kennismaken
      </span>
      !
    </h1>

    <p className="mt-4 text-base font-medium text-slate-600 sm:text-lg">
      Vul het formulier hiernaast in en we nemen snel contact met je op. 💌
    </p>

    <ul className="mt-6 flex flex-col items-center gap-3 text-left lg:items-start">
      {FEATURES.map(([emoji, text]) => (
        <li
          key={text}
          className="flex items-center gap-3 text-sm font-semibold text-slate-700"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm">
            {emoji}
          </span>
          {text}
        </li>
      ))}
    </ul>
  </section>
);

export default WizardHero;
