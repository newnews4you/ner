// Detect if running on GitHub Pages or locally
const isProduction = window.location.hostname.includes('github.io');

const config = {
    apiUrl: import.meta.env.VITE_API_URL || (isProduction 
        ? 'https://ner-nu07.onrender.com' 
        : 'http://localhost:3000'),
    authEnabled: import.meta.env.VITE_AUTH_ENABLED === 'true',
    appName: import.meta.env.VITE_APP_NAME || 'AI Tutor',
};

export default config;
