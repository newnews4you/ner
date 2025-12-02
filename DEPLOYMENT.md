# Deployment Instrukcijos

Šis projektas yra Vite + React aplikacija, kurią galima deploy'inti į įvairius hosting'us.

## 1. Vercel (Rekomenduojama - Labiausiai lengva)

### Automatinis deployment per GitHub:

1. **Prisijunkite prie Vercel:**
   - Eikite į https://vercel.com
   - Prisijunkite su GitHub account

2. **Importuokite projektą:**
   - Spauskite "Add New Project"
   - Pasirinkite savo GitHub repository
   - Vercel automatiškai aptiks Vite projektą

3. **Build nustatymai:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Deploy:**
   - Spauskite "Deploy"
   - Vercel automatiškai sukurs URL

### Rankinis deployment:

```bash
# Instaliuokite Vercel CLI
npm i -g vercel

# Prisijunkite
vercel login

# Deploy'inkite
vercel

# Production deployment
vercel --prod
```

---

## 2. Netlify

### Automatinis deployment per GitHub:

1. **Prisijunkite prie Netlify:**
   - Eikite į https://netlify.com
   - Prisijunkite su GitHub account

2. **Importuokite projektą:**
   - Spauskite "Add new site" > "Import an existing project"
   - Pasirinkite savo GitHub repository

3. **Build nustatymai:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

4. **Deploy:**
   - Spauskite "Deploy site"

### Rankinis deployment:

```bash
# Instaliuokite Netlify CLI
npm i -g netlify-cli

# Prisijunkite
netlify login

# Deploy'inkite
netlify deploy

# Production deployment
netlify deploy --prod
```

---

## 3. GitHub Pages (JAU KONFIGŪRUOTA! ✅)

### Automatinis deployment su GitHub Actions (Rekomenduojama):

1. **Push'inkite kodą į GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Įjunkite GitHub Pages:**
   - Eikite į repository Settings
   - Eikite į "Pages" sekciją
   - Under "Source", pasirinkite "GitHub Actions"
   - Išsaugokite

3. **Automatinis deployment:**
   - Kiekvieną kartą, kai push'insite į `main` branch, automatiškai deploy'ins
   - URL: `https://your-username.github.io/repository-name`

### Rankinis deployment:

1. **Deploy'inkite:**
   ```bash
   npm run deploy
   ```

2. **Įjunkite GitHub Pages:**
   - Settings > Pages
   - Source: `gh-pages` branch

### Base Path:

Jei repository vardas nėra `username.github.io`, reikia nustatyti base path `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/repository-name/', // Pakeiskite į savo repository vardą
  // ... kiti nustatymai
})
```

**Detalios instrukcijos:** Žiūrėkite [GITHUB_PAGES.md](./GITHUB_PAGES.md)

---

## 4. Render

1. **Eikite į https://render.com**
2. **Sukurkite naują Static Site:**
   - Connect GitHub repository
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. **Deploy'inkite**

---

## 5. Railway

1. **Eikite į https://railway.app**
2. **New Project > Deploy from GitHub repo**
3. **Nustatymai:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npx serve dist`
4. **Deploy'inkite**

---

## Build komandos

Prieš deploy'inant, patikrinkite, kad build veikia:

```bash
# Instaliuokite dependencies
npm install

# Sukurkite production build
npm run build

# Peržiūrėkite build lokaliai
npm run preview
```

Build failai bus sukurti `dist/` direktorijoje.

---

## Svarbu!

1. **Environment Variables:**
   - Jei naudojate API keys ar kitus environment variables, pridėkite juos hosting platformoje

2. **Routing:**
   - React Router naudoja client-side routing
   - Dauguma hosting'ų automatiškai tai tvarko
   - Jei kyla problemų, pridėkite `_redirects` arba `vercel.json` failą

3. **Base Path:**
   - Jei deploy'inate į subdirectory (pvz., GitHub Pages), nustatykite `base` vite.config.ts

---

## Rekomendacija

**Vercel** yra labiausiai rekomenduojamas, nes:
- ✅ Nemokamas
- ✅ Automatinis deployment iš GitHub
- ✅ Greitas
- ✅ Lengvas setup
- ✅ Automatiškai tvarko React Router

