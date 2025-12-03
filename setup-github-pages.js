#!/usr/bin/env node

/**
 * Script to help set up base path for GitHub Pages
 * Run: node setup-github-pages.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n📦 GitHub Pages Base Path Setup\n');

// Read vite.config.ts
const configPath = join(__dirname, 'vite.config.ts');
let config = readFileSync(configPath, 'utf-8');

// Check if base is already set
if (config.includes("base: '/")) {
  console.log('⚠️  Base path jau nustatytas vite.config.ts faile.');
  console.log('Jei norite pakeisti, redaguokite vite.config.ts rankiniu būdu.\n');
  process.exit(0);
}

// Ask for repository name
console.log('Įveskite savo GitHub repository vardą:');
console.log('Pavyzdžiai:');
console.log('  - Jei repository: github.com/username/korepetitorius-v1');
console.log('    Įveskite: korepetitorius-v1');
console.log('  - Jei repository: github.com/username/username.github.io');
console.log('    Įveskite: username.github.io (arba palikite tuščią)\n');

// For now, we'll use a default or environment variable
const repoName = process.env.REPO_NAME || process.argv[2];

if (!repoName) {
  console.log('💡 Naudojimas:');
  console.log('   node setup-github-pages.js <repository-name>');
  console.log('   arba');
  console.log('   REPO_NAME=korepetitorius-v1 node setup-github-pages.js\n');
  console.log('📝 Arba redaguokite vite.config.ts rankiniu būdu:\n');
  console.log('   base: \'/repository-name/\',\n');
  process.exit(0);
}

// Determine base path
let basePath;
if (repoName.endsWith('.github.io')) {
  basePath = '/';
  console.log('✅ Nustatytas base path: "/" (root)\n');
} else {
  basePath = `/${repoName}/`;
  console.log(`✅ Nustatytas base path: "${basePath}"\n`);
}

// Update vite.config.ts
const baseConfig = `  // Base path for GitHub Pages
  base: '${basePath}',`;
const updatedConfig = config.replace(
  /\/\/ Base path for GitHub Pages.*?\n\s*\/\/ base: '\/',/s,
  baseConfig
);

writeFileSync(configPath, updatedConfig, 'utf-8');

console.log('✅ vite.config.ts atnaujintas!');
console.log(`📦 Base path: ${basePath}`);
console.log('\n🚀 Dabar galite deploy\'inti:\n');
console.log('   npm run deploy\n');
console.log('   arba naudokite GitHub Actions (automatinis deployment)\n');

