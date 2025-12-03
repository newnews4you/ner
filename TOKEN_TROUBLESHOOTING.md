# Token Problema - Sprendimai

## Problema
Token'as negali push'inti į `newnews4you/ner` repository.

## Galimos priežastys:

### 1. Token neturi pakankamų teisių

Patikrinkite token'ą:
- Eikite į: https://github.com/settings/tokens
- Raskite token'ą ir patikrinkite scopes
- **Būtina:** `repo` scope (visas repository access)

### 2. Organizacijos repository reikalauja specialių teisių

Jei `newnews4you` yra organizacija:
- Token'as turi turėti organizacijos teises
- Eikite į: https://github.com/organizations/newnews4you/settings/personal-access-tokens
- Patikrinkite ar token'as turi teises

### 3. Bandykite su GitHub CLI

```bash
# Instaliuokite GitHub CLI
# Tada:
gh auth login --with-token < token.txt
gh repo set-default newnews4you/ner
git push -u origin main
```

### 4. Rankinis sprendimas - Web Interface

1. Eikite į: https://github.com/newnews4you/ner
2. Spauskite "uploading an existing file"
3. Drag & drop visus failus iš `dist/` (po build)
4. Commit'inkite

### 5. Sukurkite naują token'ą su teisingomis teisėmis

1. Eikite į: https://github.com/settings/tokens
2. Generate new token (classic)
3. **Scopes:**
   - ✅ `repo` (visas repository access)
   - ✅ `workflow` (jei naudojate GitHub Actions)
4. **Organization access:** Patikrinkite ar token'as turi prieigą prie `newnews4you`

### 6. Patikrinkite ar esate organizacijos narys

- Eikite į: https://github.com/orgs/newnews4you/people
- Patikrinkite ar jūsų account'as yra narys

## Greitas testas

Bandykite su curl:

```bash
curl -H "Authorization: token YOUR_TOKEN_HERE" https://api.github.com/repos/newnews4you/ner
```

Jei grąžina repository info - token'as veikia.
Jei 403/404 - token'as neturi teisių.

