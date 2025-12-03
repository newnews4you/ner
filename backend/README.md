# NER Backend API

Backend serveris su AI tutor integracija mokymosi platformai.

## Funkcijos

- ✅ RESTful API su Express.js
- ✅ SQLite duomenų bazė
- ✅ OpenRouter API integracija (AI tutor)
- ✅ Autentifikacija (JWT)
- ✅ Failų įkėlimas
- ✅ Progreso sekimas

## Reikalavimai

- Node.js 18+ 
- npm arba yarn
- OpenRouter API raktas (https://openrouter.ai)

## Instaliacija

1. Įdiekite priklausomybes:
```bash
npm install
```

2. Sukurkite `.env` failą iš `.env.example`:
```bash
cp .env.example .env
```

3. Užpildykite `.env` failą:
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:8080
```

4. Inicializuokite duomenų bazę:
```bash
npm run migrate
```

## Paleidimas

### Development režimas:
```bash
npm run dev
```

### Production režimas:
```bash
npm start
```

Serveris paleidžiamas ant `http://localhost:3000`

## API Endpoints

### Autentifikacija
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prisijungimas
- `GET /api/auth/me` - Gauti dabartinį vartotoją

### Kursai (Subjects)
- `GET /api/subjects` - Gauti visus kursus
- `GET /api/subjects/:id` - Gauti kursą pagal ID
- `POST /api/subjects` - Sukurti naują kursą
- `PUT /api/subjects/:id` - Atnaujinti kursą
- `DELETE /api/subjects/:id` - Ištrinti kursą

### Medžiaga (Materials)
- `GET /api/materials` - Gauti medžiagą
- `POST /api/materials/upload` - Įkelti failą
- `DELETE /api/materials/:id` - Ištrinti medžiagą

### AI Tutor
- `POST /api/ai/chat` - Chat su AI tutor
- `GET /api/ai/recommendations` - Gauti AI rekomendacijas
- `POST /api/ai/practice` - Generuoti praktikos užduotis
- `POST /api/ai/learning-path` - Generuoti mokymosi kelią

### Progresas
- `GET /api/progress` - Gauti progresą
- `PUT /api/progress/:subjectId` - Atnaujinti progresą
- `POST /api/progress/session` - Įrašyti mokymosi sesiją

## AI Tutor Integracija

Backend naudoja OpenRouter API AI tutor funkcionalumui. OpenRouter leidžia naudoti įvairius AI modelius (OpenAI, Anthropic, ir kt.) per vieną API.

1. **Chat** - Real-time pokalbis su AI tutor
2. **Rekomendacijos** - Personalizuotos mokymosi rekomendacijos
3. **Praktikos užduotys** - AI generuojamos užduotys
4. **Mokymosi kelias** - Personalizuotas mokymosi planas

### OpenRouter API Raktas

1. Eikite į [OpenRouter.ai](https://openrouter.ai)
2. Sukurkite paskyrą ir gaukite API raktą
3. Pridėkite jį į `.env` failą kaip `OPENROUTER_API_KEY`

### Modeliai

Galite pasirinkti bet kurį modelį iš OpenRouter. Pavyzdžiai:
- `openai/gpt-4o-mini` (default, pigiausias)
- `openai/gpt-4o`
- `anthropic/claude-3-haiku`
- `google/gemini-pro`

Pakeiskite `OPENROUTER_MODEL` `.env` faile.

## Duomenų bazė

Naudojama SQLite duomenų bazė. Duomenų bazės failas bus sukurtas automatiškai pirmą kartą paleidus serverį.

### Lentelės:
- `users` - Vartotojai
- `subjects` - Kursai
- `topics` - Temos
- `materials` - Medžiaga
- `progress` - Progresas
- `chat_messages` - AI chat istorija
- `study_sessions` - Mokymosi sesijos

## Klaidos valdymas

API grąžina standartinius HTTP status kodus:
- `200` - Sėkmė
- `201` - Sukurta
- `400` - Blogas užklausa
- `401` - Neautorizuota
- `404` - Nerasta
- `500` - Serverio klaida

## Saugumas

- Slaptažodžiai hash'inami su bcrypt
- CORS apsauga
- Failų dydžio limitai (10MB)
- Input validacija

## Development

### Struktūra:
```
backend/
├── src/
│   ├── server.js          # Pagrindinis serveris
│   ├── database/
│   │   ├── db.js          # DB konfigūracija
│   │   └── migrate.js     # Migracijos
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── subjects.js
│   │   ├── materials.js
│   │   ├── ai.js
│   │   └── progress.js
│   └── services/
│       └── aiTutor.js     # AI tutor servisas
├── uploads/               # Įkelti failai
├── .env                   # Environment variables
└── package.json
```

## Troubleshooting

### Klaida: "OPENROUTER_API_KEY is not defined"
- Patikrinkite, ar `.env` faile yra `OPENROUTER_API_KEY`
- Patikrinkite, ar API raktas teisingas
- Patikrinkite, ar modelis teisingas (pvz., `openai/gpt-4o-mini`)

### Klaida: "Database locked"
- Uždarykite kitas duomenų bazės jungtis
- Perkraukite serverį

### Klaida: "CORS error"
- Patikrinkite `FRONTEND_URL` `.env` faile
- Įsitikinkite, kad frontend URL teisingas

## Licencija

MIT

