import React, { useState } from 'react';
import { useApiKey } from '../hooks/useApiKey';
import { useTranslation } from '../hooks/useTranslation';

const ApiKeyManager: React.FC = () => {
  const { setApiKey } = useApiKey();
  const [localKey, setLocalKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSave = () => {
    if (localKey.trim() === '') {
      setError(t('api_key_modal_error'));
      return;
    }
    setApiKey(localKey);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-800">{t('api_key_modal_title')}</h2>
        <p className="text-sm text-slate-600">{t('api_key_modal_description')}</p>
        <div>
          <input
            type="password"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder={t('api_key_modal_placeholder')}
            className="w-full bg-slate-100 border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors"
          />
          {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
        </div>
        <button
          onClick={handleSave}
          className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors hover:bg-cyan-600"
        >
          {t('api_key_modal_save_button')}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyManager;
