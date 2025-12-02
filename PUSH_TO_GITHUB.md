# Kaip Push'inti Projektą į GitHub

## 1. Sukurkite GitHub Repository

1. Eikite į https://github.com
2. Spauskite "+" (viršuje dešinėje) > "New repository"
3. Įveskite repository vardą (pvz., `korepetitorius-v1`)
4. **NEPRIDĖKITE** README, .gitignore ar license (jau turime)
5. Spauskite "Create repository"

## 2. Pridėkite Remote ir Push'inkite

### Variantas A: HTTPS (Rekomenduojama, jei pirmą kartą)

```bash
# Pridėkite remote (pakeiskite USERNAME ir REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Pakeiskite branch vardą į main (jei reikia)
git branch -M main

# Push'inkite
git push -u origin main
```

### Variantas B: SSH (Jei turite SSH key)

```bash
# Pridėkite remote (pakeiskite USERNAME ir REPO_NAME)
git remote add origin git@github.com:USERNAME/REPO_NAME.git

# Pakeiskite branch vardą į main (jei reikia)
git branch -M main

# Push'inkite
git push -u origin main
```

## 3. Jei GitHub prašo autentifikacijos

Jei naudojate HTTPS ir prašo username/password:
- **Username:** Jūsų GitHub username
- **Password:** Naudokite **Personal Access Token** (ne slaptažodį!)

### Kaip sukurti Personal Access Token:

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Pasirinkite scopes: `repo` (visas access)
4. Copy token ir naudokite kaip password

## 4. Patikrinimas

Po push'inimo, patikrinkite:
```bash
git remote -v
```

Turėtumėte matyti:
```
origin  https://github.com/USERNAME/REPO_NAME.git (fetch)
origin  https://github.com/USERNAME/REPO_NAME.git (push)
```

## 5. Ateityje - Paprastas Push

Kai remote jau pridėtas, tiesiog:
```bash
git add .
git commit -m "Jūsų commit žinutė"
git push
```

