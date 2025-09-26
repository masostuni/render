import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Language = 'en' | 'it';

interface Translations {
  [key: string]: {
    en: string;
    it: string;
  };
}

const translations: Translations = {
  // Header & General
  app_title: { en: 'Virtual Architect Studio', it: 'Virtual Architect Studio' },
  change_api_key: { en: 'Change API Key', it: 'Cambia Chiave API' },
  error_title: { en: 'An error occurred', it: 'Si è verificato un errore' },

  // API Key Manager
  api_key_modal_title: { en: 'Enter your Gemini API Key', it: 'Inserisci la tua Chiave API Gemini' },
  api_key_modal_description: { en: 'To use this application, you need a Google Gemini API key. Get your key from Google AI Studio and paste it below.', it: 'Per usare questa applicazione, hai bisogno di una chiave API di Google Gemini. Ottieni la tua chiave da Google AI Studio e incollala qui sotto.' },
  api_key_modal_placeholder: { en: 'Paste your API key here', it: 'Incolla qui la tua chiave API' },
  api_key_modal_save_button: { en: 'Save and Continue', it: 'Salva e Continua' },
  api_key_modal_error: { en: 'Please enter a valid API key.', it: 'Per favore, inserisci una chiave API valida.' },
  
  // Image Selector (Splash Screen)
  image_selector_title: { en: 'Start by selecting an image', it: 'Inizia selezionando un\'immagine'},
  image_selector_upload_title: { en: 'Upload your own photo', it: 'Carica la tua foto'},
  image_selector_gallery_title: { en: 'Or choose from our gallery', it: 'Oppure scegli dalla nostra galleria'},

  // InputPanel
  upload_image_label: { en: 'Your selected photo', it: 'La tua foto selezionata' },
  upload_image_placeholder: { en: 'Drag & drop or click to upload', it: 'Trascina e rilascia o fai clic per caricare' },
  style_label: { en: 'Choose a style (optional)', it: 'Scegli uno stile (opzionale)' },
  style_modern: { en: 'Modern', it: 'Moderno' },
  style_minimalist: { en: 'Minimalist', it: 'Minimalista' },
  style_bohemian: { en: 'Bohemian', it: 'Boemo' },
  style_industrial: { en: 'Industrial', it: 'Industriale' },
  style_coastal: { en: 'Coastal', it: 'Costiero' },
  style_farmhouse: { en: 'Farmhouse', it: 'Rustico' },
  prompt_label: { en: 'Describe your desired changes', it: 'Descrivi le modifiche desiderate' },
  prompt_placeholder: { en: 'e.g., add a green sofa, change the wall color to beige, more natural light', it: 'es. aggiungi un divano verde, cambia il colore del muro in beige, più luce naturale' },
  generate_button: { en: 'Generate New Design', it: 'Genera Nuovo Design' },
  generating_button: { en: 'Generating...', it: 'Generazione in corso...' },
  select_image_error: { en: 'Please select an image first.', it: 'Seleziona prima un\'immagine.' },

  // ImageComparison
  comparison_placeholder: { en: 'Upload an image and describe the changes to see the magic happen!', it: 'Carica un\'immagine e descrivi le modifiche per vedere la magia!' },
  original_image_label: { en: 'Original', it: 'Originale' },
  generated_image_label: { en: 'Generated', it: 'Generato' },
  no_original_image: { en: 'No original image uploaded.', it: 'Nessuna immagine originale caricata.' },
  generated_image_placeholder: { en: 'Your generated image will appear here.', it: 'La tua immagine generata apparirà qui.' },
};

type TranslationKey = keyof typeof translations;

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = useCallback((key: TranslationKey): string => {
    return translations[key] ? translations[key][language] : key;
  }, [language]);

  const value = { language, setLanguage, t };
  
  React.useEffect(() => {
    // FIX: The language state is typed as 'en' | 'it', which is assignable to string.
    // The explicit cast is not needed.
    document.documentElement.lang = language;
  }, [language]);


  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
