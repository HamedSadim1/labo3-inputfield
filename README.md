# ✨ Contact Formulier - Labo 3

Een moderne, professionele contact formulier applicatie gebouwd met React, TypeScript en Tailwind CSS. Deze app demonstreert geavanceerde UI/UX principes met glasmorfisme design en uitgebreide formulier validatie.

![React](https://img.shields.io/badge/React-19.2.8-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC.svg)

## 🌟 Features

### 🎨 **Moderne UI/UX Design**

- **Glasmorfisme effecten** met transparante elementen en blur achtergronden
- **Responsive design** dat werkt op alle apparaten
- **Smooth animaties** en overgangseffecten
- **Levensechte schaduwen** en diepte-effecten

### 📝 **Geavanceerde Formulier Functionaliteit**

- **Real-time validatie** met duidelijke foutmeldingen
- **TypeScript ondersteuning** voor type veiligheid
- **Gecontroleerde componenten** voor optimale state management
- **Formulier reset** functionaliteit

### 🔧 **Technische Features**

- **Modulaire component architectuur**
- **Helper functies** voor validatie logica
- **Error handling** voor gebruikersfeedback
- **Accessibility** met proper labeling en focus states

## 🚀 Technologieën

- **Frontend Framework**: React 19.2.8
- **Programmeertaal**: TypeScript 7.0.2
- **Build Tool**: Vite 8.2.0
- **Styling**: Tailwind CSS 4.3.3
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

- **Naam**: Verplicht tekstveld
- **Email**: Verplicht email veld met validatie
- **Leeftijd**: Verplicht numeriek veld (minimum 0)
- **Wachtwoord**: Verplicht wachtwoord veld (minimaal 6 karakters)
- **Bevestig wachtwoord**: Moet overeenkomen met wachtwoord
- **Bericht**: Optioneel tekstgebied

### Validatie Regels

- Alle verplichte velden moeten ingevuld zijn
- Email moet een geldig formaat hebben
- Wachtwoorden moeten overeenkomen
- Leeftijd moet een positief getal zijn

## 🏗️ Project Structuur

```text
src/
├── components/
│   ├── InputField.tsx      # Herbruikbare input component
│   ├── InputFields.tsx     # Hoofdformulier component
│   └── SuccessScreen.tsx   # Succes scherm component
├── utils/
│   └── validation.ts       # Validatie logica en types
├── index.css               # Globale styling
├── index.tsx               # Applicatie entry point
└── App.tsx                 # Root component
```

## 📜 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build voor productie     |
| `npm run preview` | Preview productie build  |

## 🎨 Design Systeem

### Kleurenpalet

- **Primaire achtergrond**: Gradient van blauw naar paars naar roze
- **Glas effecten**: Transparante witte overlays met blur
- **Accent kleuren**: Groen voor succes states, rood voor errors

### Typografie

- **Hoofdingen**: Bold, witte tekst met drop shadows
- **Body tekst**: Semi-transparante witte tekst
- **Labels**: Compacte, duidelijke labeling

### Componenten

- **Buttons**: Glazen styling met hover effecten
- **Inputs**: Transparante velden met focus states
- **Containers**: Rounded corners met schaduwen

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
