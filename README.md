# ✨ Contact Formulier - Labo 3

Een kleurrijk en speels contactformulier gebouwd met React, TypeScript en Tailwind CSS. De app demonstreert moderne UI/UX-principes: een playful design met micro-interacties, realtime validatie en uitgebreide toegankelijkheid.

![React](https://img.shields.io/badge/React-19.2.8-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC.svg)

## 🌟 Features

### 🎨 Kleurrijk & Playful Design

- **Speelse typografie** met Baloo 2 (koppen) en Nunito (body) via Google Fonts
- **Geanimeerde achtergrond** met zwevende stickers, blur-blobs en zachte gradienten (herbruikbaar `FloatingBackground`-component)
- **Responsive split-layout**: hero sectie links, formulierkaart rechts, gestapeld op mobiel
- **Micro-interacties** overal: hover-states, geanimeerde gradient-knop, shake-animatie bij fouten, confetti en een geanimeerd vinkje op het succescherm

### 📝 Geavanceerde Formulier Functionaliteit

- **Meerstappen-wizard** in 3 stappen (Gegevens → Veiligheid → Bericht) met een speelse progress-indicator, per-stap validatie, klikbare stappen en richtingsbewuste overgangen: de huidige stap schuift subtiel weg (naar links bij Volgende, naar rechts bij Vorige) voordat de nieuwe binnenkomt
- **Realtime validatie**: fouten verschijnen bij blur en verdwijnen live zodra de gebruiker corrigeert
- **Wachtwoord-sterktemeter** (score 0-4) met gekleurde segmenten, label en een live checklist van vereisten (lengte, hoofdletter, cijfer, symbool)
- **Wachtwoord-toggle** (👁️) om ingevoerde tekst te tonen of verbergen
- **Velden met iconen**, hints en een tekenteller voor het berichtveld
- **Focusmanagement**: bij een mislukte submit springt de focus naar het eerste foutveld
- **Auto-opslaan**: formuliergegevens en de huidige stap worden in `localStorage` bewaard, zodat de wizard een paginaverversing overleeft (en wordt opgeruimd na verzenden)

### ♿ Toegankelijkheid

- `aria-invalid`, `aria-describedby`, `role="alert"` en `role="meter"` voor screenreaders
- Duidelijke focus-ringen (`:focus-visible`) en ondersteuning voor `prefers-reduced-motion`
- Goede kleurcontrasten en labels voor alle velden

## 🚀 Technologieën

- **Frontend Framework**: React 19.2.8
- **Programmeertaal**: TypeScript 5.9.3
- **Build Tool**: Vite 8.2.0
- **Styling**: Tailwind CSS 4.3.3
- **Fonts**: Google Fonts (Baloo 2, Nunito)
- **Development**: @vitejs/plugin-react

## 📦 Installatie

1. **Clone de repository**

   ```bash
   git clone https://github.com/HamedSadim1/labo3-inputfield.git
   cd labo3-inputfield
   ```

2. **Installeer dependencies**

   ```bash
   npm install
   ```

3. **Start de development server**

   ```bash
   npm run dev
   ```

4. **Open je browser**

   ```text
   http://localhost:5173
   ```

## 🎯 Gebruik

### Formulier Velden

- **Naam**: Verplicht tekstveld (max. 50 tekens)
- **Email**: Verplicht email veld met validatie (max. 254 tekens)
- **Leeftijd**: Verplicht numeriek veld (0-120)
- **Wachtwoord** (stap 2): Verplicht veld (minimaal 6 tekens, met hoofdletter, cijfer en symbool) met sterktemeter en live vereisten-checklist
- **Bevestig wachtwoord**: Moet overeenkomen met het wachtwoord
- **Bericht**: Optioneel tekstgebied (max. 500 tekens) met tekenteller

### Validatie Regels

- Alle verplichte velden moeten ingevuld zijn
- Email moet een geldig formaat hebben
- Wachtwoorden moeten overeenkomen
- Wachtwoord moet minstens 6 tekens bevatten, waaronder een hoofdletter, een cijfer en een symbool
- Leeftijd moet een geheel getal tussen 0 en 120 zijn

## 🏗️ Project Structuur

```text
src/
├── components/
│   ├── Button.tsx              # Herbruikbare button (varianten + maten: md/lg)
│   ├── CheckIcon.tsx           # Herbruikbaar checkmark-icoon (stepper + succesvinkje)
│   ├── FloatingBackground.tsx  # Herbruikbare geanimeerde achtergrond
│   ├── InputField.tsx          # Herbruikbare input component (iconen, hints, toggle, sterktemeter + checklist)
│   ├── InputFields.tsx         # Hoofdformulier component met validatie
│   ├── Screen.tsx              # Pagina-shell (gradient + achtergrond + main)
│   └── SuccessScreen.tsx       # Succes scherm met confetti en geanimeerd vinkje
├── utils/
│   ├── storage.ts              # localStorage-draft: formuliergegevens bewaren/herstellen
│   └── validation.ts           # Types, validatie logica en wachtwoord-hulpfuncties (sterkte + checklist)
├── index.css                   # Globale styling en design tokens (Tailwind v4 @theme)
├── index.tsx                   # Applicatie entry point
└── App.tsx                     # Root component
```

## 📜 Scripts

| Command             | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Start development server                                   |
| `npm run build`     | Build voor productie                                       |
| `npm run preview`   | Preview productie build                                    |
| `npm run lint`      | Lint met ESLint                                            |
| `npm run typecheck` | Typecheck met TypeScript                                   |
| `npm run format`    | Formatteer code met Prettier                               |
| `npm run validate`  | Volledige kwaliteitscheck (format, lint, typecheck, build) |

## 🔧 Technische Kwaliteit

- **Strikte TypeScript-config**: `strict`, `noUncheckedIndexedAccess` en `verbatimModuleSyntax`
- **Type-veilige code**: type-guards (`isFormFieldName`, `isRecord`) in plaats van casts; geen `any` of onnodige type-assertions
- **ESLint als poortwachter**: `no-explicit-any`, `no-unnecessary-type-assertion` en `consistent-type-imports` als harde fouten
- **Conventionele commits** met commitlint, Prettier en lint-staged via husky

## 🎨 Design Systeem

### Kleurenpalet

- **Achtergrond**: zachte gradient van amber → roos → violet (pastel)
- **Accent kleuren**: violet/fuchsia/amber voor knoppen en focus-ringen, emerald/teal voor succes states, rose voor fouten
- **Kaarten**: witte, sterk afgeronde kaarten met blur en zachte kleurige schaduwen

### Typografie

- **Koppen**: Baloo 2 (speels en rond)
- **Body**: Nunito (leesbaar en vriendelijk)

### Animaties

- Alle animaties zijn gedefinieerd als design tokens in `index.css` (`@theme` + keyframes) en gerespecteerd bij `prefers-reduced-motion`

### Componenten

- **Buttons**: gradient met lift- en schaduweffect bij hover, speelse emoji's
- **Inputs**: witte velden met afgeronde hoeken en kleurrijke focus-ringen
- **Containers**: afgeronde witte kaarten met backdrop-blur

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je veranderingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicentieerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🙏 Erkenningen

- **React** - Voor het geweldige framework
- **Vite** - Voor de snelle build tool
- **Tailwind CSS** - Voor het utility-first CSS framework
- **TypeScript** - Voor type veiligheid

---

Gemaakt met ❤️ voor Labo 3 - Webframeworks
