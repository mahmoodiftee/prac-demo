import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- Console & Error Suppression (Third-party noise cleanup) ---
const suppressedKeywords = [
  'locize', 'Cal.com', 'zustand', 'i18next', 'markdownToSafeHTML',
  'createIframe', 'WebSocket', 'favicon.ico', 'QuickAvailabilityCheck',
  'UNAUTHORIZED', 'calendars', 'Existing embed CSS Vars', 'trpc',
  'the server responded with a status of 401', 'TRPCClientError',
  'react-i18next:: You will need to pass in an i18next instance',
  '[DEPRECATED] Use createWithEqualityFn', 'viewer.calendars',
  'SecurityError', "failed to read a named property 'document' from 'Window'",
  'connectedCalendars', 'markdownToSafeHTML'
];

const filterLogs = (originalFn: any) => {
  return (...args: any[]) => {
    const isSuppressed = args.some(arg => {
      if (!arg) return false;
      const str = String(arg).toLowerCase();
      return suppressedKeywords.some(keyword => str.includes(keyword.toLowerCase()));
    });
    if (isSuppressed) return;
    originalFn(...args);
  };
};

// Also suppress vite-related logs if needed, but keeping for now as they are "system"
// console.log = filterLogs(console.log); 
console.warn = filterLogs(console.warn);
console.error = filterLogs(console.error);
console.info = filterLogs(console.info);
console.debug = filterLogs(console.debug);

// Global Error Listeners
window.addEventListener('error', (event) => {
  const msg = event.message || '';
  const url = event.filename || '';
  if (suppressedKeywords.some(k => msg.toLowerCase().includes(k.toLowerCase()) || url.toLowerCase().includes(k.toLowerCase()))) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event.reason || '');
  if (suppressedKeywords.some(k => msg.toLowerCase().includes(k.toLowerCase()))) {
    event.preventDefault();
  }
});
// ---------------------------------------------------------------

i18n.use(initReactI18next).init({
  resources: {},
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
