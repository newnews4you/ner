const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    authEnabled: import.meta.env.VITE_AUTH_ENABLED === 'true',
    appName: import.meta.env.VITE_APP_NAME || 'AI Tutor',
};

export default config;
