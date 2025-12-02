# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0ac48105-9a74-42b5-98d0-393921998599

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0ac48105-9a74-42b5-98d0-393921998599) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Vitest (testing)
- React Testing Library (testing)

## How can I deploy this project?

### Greitas deployment (Rekomenduojama)

**Vercel (Nemokamas, greitas):**
1. Eikite į https://vercel.com
2. Prisijunkite su GitHub
3. Importuokite šį repository
4. Vercel automatiškai aptiks Vite projektą
5. Spauskite "Deploy"

**Netlify (Nemokamas, lengvas):**
1. Eikite į https://netlify.com
2. Prisijunkite su GitHub
3. Importuokite šį repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Spauskite "Deploy"

**GitHub Pages (Nemokamas, automatinis):**
1. Nustatykite base path (jei repository nėra `username.github.io`):
   ```bash
   node setup-github-pages.js repository-name
   ```
2. Push'inkite kodą į GitHub
3. Settings > Pages > Source: "GitHub Actions"
4. Automatiškai deploy'ins kiekvieną kartą, kai push'insite

### Kiti hosting'ai

Detalios instrukcijos žiūrėkite:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Visi hosting'ai
- [GITHUB_PAGES.md](./GITHUB_PAGES.md) - GitHub Pages detalės

### Lokalus build testavimas

```bash
# Sukurkite production build
npm run build

# Peržiūrėkite build lokaliai
npm run preview
```

Build failai bus sukurti `dist/` direktorijoje.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Testing

This project uses **Vitest** and **React Testing Library** for testing.

### Running Tests

```sh
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are located in:
- `src/components/__tests__/` - Component tests
- `src/pages/__tests__/` - Page tests
- `src/utils/__tests__/` - Utility tests

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Test Coverage

To generate coverage report:

```sh
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory.
