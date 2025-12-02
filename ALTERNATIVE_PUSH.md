# Alternatyvūs Būdai Push'inti

## Problema
Token'as negali push'inti dėl teisių problemų.

## Sprendimai:

### 1. Patikrinkite Token'ą

Eikite į: https://github.com/settings/tokens

Patikrinkite:
- ✅ Token'as turi `repo` scope
- ✅ Token'as turi prieigą prie `newnews4you` organizacijos
- ✅ Token'as nėra expir'avęs

### 2. Sukurkite Naują Token'ą

1. Eikite į: https://github.com/settings/tokens
2. Generate new token (classic)
3. **Name:** `ner-repo-full-access`
4. **Expiration:** Pasirinkite (pvz., 90 days)
5. **Scopes:**
   - ✅ **repo** (visas repository access)
   - ✅ **workflow** (jei naudojate GitHub Actions)
6. **Organization access:**
   - Pasirinkite `newnews4you`
   - Pasirinkite "Full control" arba "Read and write"
7. Generate token
8. Nukopijuokite naują token'ą

### 3. Naudokite GitHub Desktop

1. Instaliuokite GitHub Desktop
2. File > Clone repository
3. Pasirinkite `newnews4you/ner`
4. Push'inkite per GUI

### 4. Naudokite GitHub CLI

```bash
# Instaliuokite gh CLI
# Windows: winget install GitHub.cli

# Prisijunkite
gh auth login

# Nustatykite repository
gh repo set-default newnews4you/ner

# Push'inkite
git push -u origin main
```

### 5. Rankinis Upload (Greitas Sprendimas)

Jei push'inimas neveikia, galite upload'inti failus per web:

1. Eikite į: https://github.com/newnews4you/ner/upload
2. Drag & drop visus failus (išskyrus `node_modules`, `.git`)
3. Commit message: "Initial commit"
4. Commit directly to the main branch
5. Commit changes

### 6. Patikrinkite Organizacijos Narystę

Eikite į: https://github.com/orgs/newnews4you/people

Patikrinkite ar jūsų account'as yra narys ir turi write teises.

## Rekomendacija

1. Sukurkite naują token'ą su visomis teisėmis
2. Arba naudokite GitHub Desktop (lengviausias būdas)
3. Arba rankiniu būdu upload'inkite per web interface

