// API configuration for different environments
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = isLocalhost ? 'http://localhost:3001/' : '/';
