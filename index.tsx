import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- DEBUG & COMPATIBILITY FIXES ---

// 1. Polyfill 'process' to prevent crashes from libraries expecting Node.js environment
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

// 2. Global error handler to alert critical startup errors (Debugging Black Screen)
window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return false;
}

// -----------------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);