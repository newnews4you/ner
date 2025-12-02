# GitHub Autentifikacijos Sprendimas

## Problema
```
remote: Permission to newnews4you/ner.git denied to domas-cloud.
```

Tai reiškia, kad esate prisijungę su `domas-cloud` account'u, bet repository priklauso `newnews4you` organizacijai.

## Sprendimas

### Variantas 1: Prisijunkite su teisingu account'u

1. **Windows Credential Manager:**
   ```bash
   # Išvalykite senus credentials
   git credential-manager-core erase
   ```
   
   Arba per Windows:
   - Windows Settings > Accounts > Access work or school
   - Pašalinkite GitHub credentials

2. **Kai push'insite, GitHub prašys prisijungti:**
   - Naudokite `newnews4you` account'ą
   - Arba Personal Access Token

### Variantas 2: Naudokite Personal Access Token (Rekomenduojama)

1. **Sukurkite Personal Access Token:**
   - Eikite į: https://github.com/settings/tokens
   - Spauskite "Generate new token" > "Generate new token (classic)"
   - Token name: `ner-repo-access`
   - Expiration: Pasirinkite (pvz., 90 days)
   - Scopes: Pasirinkite `repo` (visas access)
   - Spauskite "Generate token"
   - **SVARBU:** Nukopijuokite token dabar (jo daugiau nematysite!)

2. **Naudokite token kaip password:**
   ```bash
   git push -u origin main
   ```
   
   Kai prašys:
   - **Username:** `newnews4you` (arba jūsų GitHub username)
   - **Password:** Įklijuokite Personal Access Token (ne slaptažodį!)

### Variantas 3: SSH Key (Ilgalaikis sprendimas)

1. **Sukurkite SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Pridėkite SSH key į GitHub:**
   - Nukopijuokite public key: `cat ~/.ssh/id_ed25519.pub`
   - GitHub > Settings > SSH and GPG keys > New SSH key
   - Įklijuokite key

3. **Pakeiskite remote į SSH:**
   ```bash
   git remote set-url origin git@github.com:newnews4you/ner.git
   git push -u origin main
   ```

### Variantas 4: GitHub CLI

```bash
# Instaliuokite GitHub CLI
# Tada:
gh auth login
gh repo set-default newnews4you/ner
git push -u origin main
```

## Greitas Sprendimas (Dabar)

Jei turite Personal Access Token:

```bash
# Pakeiskite remote su token
git remote set-url origin https://TOKEN@github.com/newnews4you/ner.git

# Arba tiesiog push'inkite ir įveskite token kaip password
git push -u origin main
```

Kai prašys credentials:
- Username: `newnews4you`
- Password: Jūsų Personal Access Token

