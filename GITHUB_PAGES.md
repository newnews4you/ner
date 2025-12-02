# GitHub Pages Deployment

## Automatinis deployment su GitHub Actions (Rekomenduojama)

Projektas jau sukonfigūruotas su GitHub Actions workflow, kuris automatiškai deploy'ina aplikaciją į GitHub Pages.

### Kaip naudoti:

1. **Push'inkite kodą į GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Įjunkite GitHub Pages:**
   - Eikite į repository Settings
   - Eikite į "Pages" sekciją (kairėje pusėje)
   - Under "Source", pasirinkite "GitHub Actions"
   - Išsaugokite

3. **Automatinis deployment:**
   - Kiekvieną kartą, kai push'insite į `main` arba `master` branch, workflow automatiškai:
     - Sukurs build
     - Deploy'ins į GitHub Pages
   - URL bus: `https://your-username.github.io/repository-name`

### Peržiūrėti deployment status:

- Eikite į repository "Actions" tab
- Matysite deployment workflow status

---

## Rankinis deployment su gh-pages

Jei norite deploy'inti rankiniu būdu:

### 1. Instaliuokite gh-pages:

```bash
npm install --save-dev gh-pages
```

### 2. Deploy'inkite:

```bash
npm run deploy
```

Tai automatiškai:
- Sukurs production build
- Deploy'ins į `gh-pages` branch
- Sukurs GitHub Pages URL

### 3. Įjunkite GitHub Pages:

- Eikite į repository Settings > Pages
- Under "Source", pasirinkite `gh-pages` branch
- Išsaugokite

---

## Base Path konfigūracija

Jei jūsų repository nėra root level (pvz., `username.github.io`), reikia nustatyti base path.

### Automatinis nustatymas (Rekomenduojama):

```bash
# Nustatykite repository vardą
node setup-github-pages.js korepetitorius-v1

# Arba su environment variable
REPO_NAME=korepetitorius-v1 node setup-github-pages.js
```

### Rankinis nustatymas:

1. **Patikrinkite repository vardą:**
   - Jei repository: `github.com/username/korepetitorius-v1`
   - Tada base path: `/korepetitorius-v1/`

2. **Atnaujinkite vite.config.ts:**

```typescript
export default defineConfig({
  base: '/korepetitorius-v1/', // Pakeiskite į savo repository vardą
  // ... kiti nustatymai
})
```

3. **Jei repository vardas yra `username.github.io`:**
   - Tada base path: `/` (root)
   - Arba palikite komentuotą: `// base: '/',`

### Kaip sužinoti repository vardą:

```bash
# Jei jau yra git repository
git remote get-url origin

# Arba pažiūrėkite GitHub repository URL
# github.com/username/REPOSITORY-NAME
```

---

## Troubleshooting

### Problem: 404 klaidos kai naviguojate

**Sprendimas:** GitHub Pages reikalauja `404.html` failo arba redirect'ų. 

Patikrinkite, ar `vite.config.ts` turi teisingą `base` path.

### Problem: Assets nerandami

**Sprendimas:** Įsitikinkite, kad `base` path yra teisingas ir prasideda bei baigiasi su `/`.

### Problem: Build nepavyksta

**Sprendimas:**
```bash
# Išvalykite cache
rm -rf node_modules dist
npm install
npm run build
```

---

## URL format'ai

- **Custom domain:** `https://yourdomain.com`
- **User/Org pages:** `https://username.github.io`
- **Project pages:** `https://username.github.io/repository-name`

---

## Svarbu!

1. **Base path** turi atitikti repository vardą (jei ne `username.github.io`)
2. **GitHub Actions** automatiškai tvarko deployment
3. **gh-pages** branch automatiškai sukuriamas ir atnaujinamas
4. **Build** failai yra `dist/` direktorijoje

