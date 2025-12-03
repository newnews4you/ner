# GitHub Pages Base Path Nustatymas

## Greitas sprendimas

Jei jūsų repository vardas **NĖRA** `username.github.io`, reikia nustatyti base path.

### 1. Sužinokite repository vardą

Jei jūsų repository URL yra:
```
https://github.com/username/korepetitorius-v1
```

Tada repository vardas yra: **`korepetitorius-v1`**

### 2. Atidarykite `vite.config.ts`

### 3. Pridėkite base path

Pakeiskite šią eilutę:
```typescript
// base: '/',
```

Į:
```typescript
base: '/korepetitorius-v1/', // Pakeiskite į savo repository vardą
```

### Pavyzdys:

**Prieš:**
```typescript
export default defineConfig(({ mode }) => ({
  // base: '/',
  server: {
    // ...
  },
}));
```

**Po:**
```typescript
export default defineConfig(({ mode }) => ({
  base: '/korepetitorius-v1/', // Jūsų repository vardas
  server: {
    // ...
  },
}));
```

### 4. Svarbu!

- Base path turi prasidėti su `/` ir baigtis su `/`
- Pavyzdys: `/korepetitorius-v1/` ✅
- Neteisingai: `korepetitorius-v1` ❌ arba `/korepetitorius-v1` ❌

### 5. Jei repository vardas yra `username.github.io`

Tada base path turėtų būti `/` (root):
```typescript
base: '/',
```

Arba palikite komentuotą:
```typescript
// base: '/',
```

---

## Patikrinimas

Po nustatymo, patikrinkite:

```bash
npm run build
npm run preview
```

Jei viskas veikia, galite deploy'inti:

```bash
npm run deploy
```

