# NER - AI Mokymosi Platforma

Moderni mokymosi platforma su AI tutor integracija, skirta moksleiviams efektyviai mokytis.

## 🌟 Funkcijos

- 🤖 **AI Tutor** - Asmeninis AI korepetitorius su OpenAI integracija
- 📚 **Daugiadalykis mokymasis** - Matematika, Fizika, IT, ir kt.
- 📊 **Progreso sekimas** - Vizualus progreso stebėjimas
- ⏱️ **Pomodoro Timer** - Fokusavimo sesijos
- 🎯 **Gamifikacija** - Achievement'ai, streak'ai, tikslai
- 📝 **Notion-style užrašai** - Užrašų valdymas
- 📁 **Medžiagos valdymas** - Failų įkėlimas ir organizavimas
- 🗓️ **Planavimas** - Tvarkaraštis, dienos planuotojas
- 📈 **Statistika** - Detali analitika

## 🚀 Greitas startas

### Reikalavimai

- Node.js 18+
- npm arba yarn
- OpenRouter API raktas (AI funkcijoms) - https://openrouter.ai

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Užpildykite .env failą su savo OpenAI API raktu
npm run migrate
npm run dev
```

Backend paleidžiamas ant `http://localhost:3000`

### 2. Frontend setup

```bash
# Root direktorijoje
npm install
npm run dev
```

Frontend paleidžiamas ant `http://localhost:8080`

### 3. Environment variables

#### Backend (.env):
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:8080
```

#### Frontend (.env):
```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_ENABLED=true
VITE_APP_NAME=NER AI Tutor
```

## 📁 Projekto struktūra

```
ner-main/
├── backend/              # Backend serveris
│   ├── src/
│   │   ├── server.js    # Express serveris
│   │   ├── database/    # DB konfigūracija
│   │   ├── routes/      # API routes
│   │   └── services/    # AI tutor servisas
│   └── package.json
├── src/                 # Frontend
│   ├── components/      # React komponentai
│   ├── pages/          # Puslapiai
│   ├── services/        # API servisai
│   └── contexts/        # React kontekstai
└── package.json
```

## 🛠️ Technologijos

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- React Query

### Backend
- Node.js + Express
- SQLite
- OpenAI API
- JWT autentifikacija

## 📚 API Dokumentacija

### Autentifikacija
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prisijungimas

### Kursai
- `GET /api/subjects` - Visi kursai
- `GET /api/subjects/:id` - Kursas pagal ID
- `POST /api/subjects` - Sukurti kursą

### AI Tutor
- `POST /api/ai/chat` - Chat su AI
- `GET /api/ai/recommendations` - Rekomendacijos
- `POST /api/ai/practice` - Generuoti užduotis
- `POST /api/ai/learning-path` - Mokymosi kelias

Daugiau informacijos: [backend/README.md](backend/README.md)

## 🤖 AI Tutor

Platforma naudoja OpenRouter API AI tutor funkcionalumui. OpenRouter leidžia naudoti įvairius AI modelius per vieną API.

1. **Real-time chat** - Pokalbis su AI tutor bet kuriuo metu
2. **Personalizuotos rekomendacijos** - Remiantis jūsų progresu
3. **Praktikos užduotys** - AI generuojamos užduotys pagal temą
4. **Mokymosi kelias** - Personalizuotas mokymosi planas

### OpenRouter API Raktas

1. Eikite į [OpenRouter.ai](https://openrouter.ai)
2. Sukurkite paskyrą ir gaukite API raktą
3. Pridėkite jį į `backend/.env` failą kaip `OPENROUTER_API_KEY`

### Modeliai

Galite pasirinkti bet kurį modelį iš OpenRouter:
- `openai/gpt-4o-mini` (default, pigiausias)
- `openai/gpt-4o`
- `anthropic/claude-3-haiku`
- `google/gemini-pro`

Pakeiskite `OPENROUTER_MODEL` `.env` faile.

## 🎨 UI/UX

- Modernus synthwave dizainas
- Responsive (mobile, tablet, desktop)
- Glass morphism efektai
- Smooth animacijos
- Dark theme

## 📦 Build

### Frontend
```bash
npm run build
```

### Backend
```bash
cd backend
npm start
```

## 🧪 Testavimas

```bash
# Frontend testai
npm test

# Backend testai (jei yra)
cd backend
npm test
```

## 🐛 Troubleshooting

### Backend neveikia
- Patikrinkite, ar `.env` failas teisingai sukonfigūruotas
- Patikrinkite, ar OpenAI API raktas teisingas
- Patikrinkite, ar portas 3000 laisvas

### Frontend neprisijungia prie backend
- Patikrinkite `VITE_API_URL` frontend `.env` faile
- Patikrinkite CORS nustatymus backend'e
- Patikrinkite, ar backend veikia

### AI neatsako
- Patikrinkite OpenRouter API raktą
- Patikrinkite, ar modelis teisingas (pvz., `openai/gpt-4o-mini`)
- Patikrinkite API limitus OpenRouter
- Patikrinkite console klaidas

## 📝 Licencija

MIT

## 👥 Kūrėjai

Sukurta su ❤️ mokymosi platformai

## 🔗 Nuorodos

- [Backend README](backend/README.md)
- [OpenRouter API](https://openrouter.ai)
- [OpenRouter Models](https://openrouter.ai/models)
