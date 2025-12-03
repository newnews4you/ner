# Testavimo vadovas

## Greitas startas

### 1. Įdiekite dependencies

```sh
npm install
```

### 2. Paleiskite testus

```sh
# Watch mode (automatiškai paleidžia testus kai keičiate failus)
npm test

# Vieną kartą
npm test -- --run

# Su UI
npm run test:ui

# Su coverage report
npm run test:coverage
```

## Testavimo komandos

| Komanda | Aprašymas |
|---------|-----------|
| `npm test` | Paleidžia testus watch mode |
| `npm run test:ui` | Paleidžia testus su gražiu UI |
| `npm run test:coverage` | Generuoja coverage report |

## Testų struktūra

```
src/
├── components/
│   └── __tests__/
│       ├── SubjectCard.test.tsx
│       └── Header.test.tsx
├── pages/
│   └── __tests__/
│       └── Index.test.tsx
└── test/
    └── setup.ts
```

## Rašymo testų pavyzdžiai

### Komponento testas

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<MyComponent onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Puslapio testas su Router

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../Index';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Index Page', () => {
  it('should render welcome message', () => {
    renderWithRouter(<Index />);
    expect(screen.getByText(/Sveiki/i)).toBeInTheDocument();
  });
});
```

## Naudingi matchers

### @testing-library/jest-dom

```typescript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveClass('my-class');
expect(element).toHaveTextContent('Hello');
expect(element).toHaveAttribute('href', '/link');
```

### Vitest

```typescript
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
```

## Testavimo strategija

### 1. Unit testai (komponentai)
- Testuokite atskirus komponentus
- Mock'inkite dependencies
- Testuokite props ir state changes

### 2. Integration testai (puslapiai)
- Testuokite komponentų sąveiką
- Testuokite routing
- Testuokite formų submit

### 3. E2E testai (rekomenduojama su Playwright/Cypress)
- Testuokite pilną user flow
- Testuokite real browser environment

## Best practices

1. **Testuokite vartotojo elgesį, ne implementaciją**
   ```typescript
   // ❌ Blogai
   expect(component.state.count).toBe(1);
   
   // ✅ Gerai
   expect(screen.getByText('Count: 1')).toBeInTheDocument();
   ```

2. **Naudokite accessible queries**
   ```typescript
   // ✅ Gerai
   screen.getByRole('button', { name: 'Submit' });
   screen.getByLabelText('Email');
   screen.getByText('Welcome');
   ```

3. **Išvalykite po kiekvieno testo**
   ```typescript
   // Automatiškai daroma su cleanup() setup.ts
   ```

4. **Mock'inkite external dependencies**
   ```typescript
   vi.mock('../api', () => ({
     fetchData: vi.fn(() => Promise.resolve({ data: 'test' }))
   }));
   ```

## Troubleshooting

### Testai neveikia

1. Patikrinkite ar įdiegtos dependencies:
   ```sh
   npm install
   ```

2. Patikrinkite ar Vitest konfigūracija teisinga:
   ```sh
   cat vitest.config.ts
   ```

3. Išvalykite cache:
   ```sh
   rm -rf node_modules/.vite
   ```

### Coverage nėra 100%

Tai normalu! Fokusuokitės į:
- Kritinius komponentus
- Business logic
- User interactions

## Papildomi ištekliai

- [Vitest dokumentacija](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

