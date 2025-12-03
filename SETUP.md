# 🚀 Greitas Paleidimas - NER AI Tutor

## 1️⃣ Backend Setup

### A. Įdiekite priklausomybes

```bash
cd backend
npm install
```

### B. Sukonfigūruokite .env failą

```bash
# Nukopijuokite example failą
cp .env.example .env
```

Tada atidarykite `backend/.env` ir užpildykite:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite

# OpenRouter API (svarbu!)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini

# Optional
OPENROUTER_HTTP_REFERER=http://localhost:3000
OPENROUTER_APP_NAME=NER AI Tutor

JWT_SECRET=your_random_secret_key_here
FRONTEND_URL=http://localhost:8080
```

**Svarbu:** Pakeiskite `OPENROUTER_API_KEY` į savo tikrą raktą iš https://openrouter.ai

### C. Inicializuokite duomenų bazę

```bash
npm run migrate
```

Turėtumėte matyti: `✅ Database tables initialized`

### D. Paleiskite backend serverį

```bash
npm run dev
```

Turėtumėte matyti:
```
✅ Connected to SQLite database
✅ Database tables initialized
🚀 Server running on http://localhost:3000
📚 API available at http://localhost:3000/api
🤖 AI Tutor endpoint: http://localhost:3000/api/ai
```

**Palikite šį terminalą atidarytą!**

---

## 2️⃣ Frontend Setup

### A. Atidarykite naują terminalą

Backend turi veikti atskirai, todėl atidarykite naują terminalo langą.

### B. Įdiekite priklausomybes (jei dar neįdiegta)

```bash
# Jei esate root direktorijoje
npm install
```

### C. Sukonfigūruokite frontend .env

```bash
# Nukopijuokite example failą
cp .env.example .env
```

Atidarykite `.env` ir patikrinkite:

```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_ENABLED=true
VITE_APP_NAME=NER AI Tutor
```

### D. Paleiskite frontend

```bash
npm run dev
```

Turėtumėte matyti:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

---

## 3️⃣ Atidarykite naršyklę

Eikite į: **http://localhost:8080**

Turėtumėte matyti landing page su "Pradėti" mygtuku.

---

## ✅ Patikrinimas

### Backend veikia?
Atidarykite: http://localhost:3000/api/health

Turėtumėte matyti:
```json
{
  "status": "ok",
  "message": "NER Backend API is running"
}
```

### Frontend prisijungia prie backend?
1. Atidarykite Developer Tools (F12)
2. Eikite į Console
3. Turėtų būti matyti API užklausos

### AI Tutor veikia?
1. Prisijunkite prie dashboard
2. Atidarykite AI chat sidebar
3. Parašykite žinutę
4. Turėtumėte gauti AI atsakymą

---

## 🐛 Troubleshooting

### Backend klaidos

**Klaida: "OPENROUTER_API_KEY is not defined"**
- Patikrinkite, ar `.env` faile yra `OPENROUTER_API_KEY`
- Patikrinkite, ar failas yra `backend/.env` (ne `.env.example`)

**Klaida: "Database locked"**
- Uždarykite kitas duomenų bazės jungtis
- Perkraukite backend serverį

**Klaida: "Port 3000 already in use"**
- Pakeiskite `PORT=3001` `.env` faile
- Arba uždarykite kitą procesą, kuris naudoja portą 3000

### Frontend klaidos

**Klaida: "Failed to fetch"**
- Patikrinkite, ar backend veikia (http://localhost:3000/api/health)
- Patikrinkite `VITE_API_URL` `.env` faile
- Patikrinkite CORS nustatymus backend'e

**Klaida: "Network Error"**
- Patikrinkite, ar backend serveris veikia
- Patikrinkite firewall nustatymus

### AI neveikia

**AI neatsako arba klaida**
- Patikrinkite OpenRouter API raktą
- Patikrinkite, ar modelis teisingas (pvz., `openai/gpt-4o-mini`)
- Patikrinkite OpenRouter dashboard, ar yra pakankamai kredito
- Patikrinkite console klaidas backend terminale

---

## 📝 Greitas Checklist

- [ ] Backend priklausomybės įdiegtos (`cd backend && npm install`)
- [ ] Backend `.env` failas sukonfigūruotas su OpenRouter API raktu
- [ ] Duomenų bazė inicializuota (`npm run migrate`)
- [ ] Backend serveris veikia (`npm run dev`)
- [ ] Frontend priklausomybės įdiegtos (`npm install`)
- [ ] Frontend `.env` failas sukonfigūruotas
- [ ] Frontend veikia (`npm run dev`)
- [ ] Naršyklėje atidarytas http://localhost:8080
- [ ] AI chat veikia

---

## 🎉 Sėkmė!

Jei viskas veikia, turėtumėte matyti:
- ✅ Landing page
- ✅ Galimybė prisijungti/registruotis
- ✅ Dashboard su kursais
- ✅ AI chat sidebar veikia
- ✅ AI rekomendacijos veikia

**Sveikiname! Jūsų AI tutor platforma veikia! 🚀**

