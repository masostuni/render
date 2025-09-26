import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const switchLanguage = (lang: 'it' | 'en') => {
    setLanguage(lang);
    document.documentElement.lang = lang;
  };

  return (
    <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-md">
      <button
        onClick={() => switchLanguage('it')}
        className={`px-2 py-0.5 text-sm font-semibold rounded-md transition-colors ${
          language === 'it' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-slate-300'
        }`}
      >
        IT
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2 py-0.5 text-sm font-semibold rounded-md transition-colors ${
          language === 'en' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-slate-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;