# GitHub Pages - Informacija

## Ar aplikacija visada bus gyva?

**Taip!** Aplikacija bus gyva tol, kol:

### ✅ Kas užtikrina, kad veiktų:

1. **Repository egzistuoja**
   - Tol, kol repository yra GitHub'e, aplikacija veiks
   - Net jei neaktyvus, aplikacija vis tiek bus prieinama

2. **GitHub Pages įjungtas**
   - Settings > Pages > Source: "GitHub Actions"
   - Vieną kartą nustatę, veiks automatiškai

3. **Automatinis deployment**
   - Kiekvieną kartą, kai push'insite į `main` branch, automatiškai:
     - Sukurs naują build
     - Deploy'ins į GitHub Pages
     - Atnaujins live aplikaciją

4. **Nemokamas hosting**
   - GitHub Pages yra nemokamas
   - Nereikia mokėti už hosting'ą

### ⚠️ Apribojimai (nemokamam planui):

1. **Bandwidth:**
   - 100 GB per mėnesį (dažniausiai pakanka)
   - Jei viršysite, GitHub praneš

2. **Storage:**
   - 1 GB repository dydis (build failai)
   - Dažniausiai pakanka

3. **Build laikas:**
   - 10 minučių per workflow run
   - 20 workflow runs per valandą

### 🔄 Kaip užtikrinti, kad visada veiktų:

1. **Nepanaikinkite repository**
   - Jei ištrinsite repository, aplikacija nustos veikti

2. **Nepakeiskite Pages nustatymų**
   - Palikite Source: "GitHub Actions"

3. **Nepakeiskite branch vardo**
   - Jei pakeisite `main` į kitą branch, reikės atnaujinti workflow

4. **Patikrinkite workflow status**
   - Periodiškai patikrinkite: https://github.com/newnews4you/ner/actions
   - Jei workflow nepavyksta, patikrinkite klaidas

### 📊 Monitoring:

**Patikrinkite status:**
- Repository: https://github.com/newnews4you/ner
- Actions: https://github.com/newnews4you/ner/actions
- Pages: https://github.com/newnews4you/ner/settings/pages
- Live site: https://newnews4you.github.io/ner/

### 🚀 Automatinis atnaujinimas:

Kiekvieną kartą, kai:
```bash
git add .
git commit -m "Update"
git push
```

GitHub Actions automatiškai:
1. Sukurs naują build
2. Deploy'ins į GitHub Pages
3. Atnaujins live aplikaciją (per ~2-5 minutes)

### 💡 Išvada:

**Taip, aplikacija bus gyva tol, kol:**
- ✅ Repository egzistuoja
- ✅ GitHub Pages įjungtas
- ✅ Nenurodysite bandwidth limitų
- ✅ Nenurodysite storage limitų

**Tai yra nemokamas, patikimas hosting'as!** 🎉


