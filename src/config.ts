// Always use Render backend for AI features
const isProduction = window.location.hostname.includes('github.io');

const config = {
    // Always use Render backend (has valid API key)
    apiUrl: import.meta.env.VITE_API_URL || 'https://ner-nu07.onrender.com',
    authEnabled: import.meta.env.VITE_AUTH_ENABLED === 'true',
    appName: import.meta.env.VITE_APP_NAME || 'AI Tutor',
};

export default config;
