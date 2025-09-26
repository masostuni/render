import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import { TranslationProvider } from './hooks/useTranslation';
import { ApiKeyProvider } from './hooks/useApiKey';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <TranslationProvider>
          <ApiKeyProvider>
            <App />
          </ApiKeyProvider>
        </TranslationProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
