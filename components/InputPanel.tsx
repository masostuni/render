import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon, SpinnerIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface InputPanelProps {
  onGenerate: (prompt: string, image: { data: string; mimeType: string }) => void;
  onImageSelect: (file: File) => void;
  isLoading: boolean;
  originalImage: string | null;
}

const stylePresets = ['Modern', 'Minimalist', 'Bohemian', 'Industrial', 'Coastal', 'Farmhouse'];
type StyleKey = 'style_modern' | 'style_minimalist' | 'style_bohemian' | 'style_industrial' | 'style_coastal' | 'style_farmhouse';


const InputPanel: React.FC<InputPanelProps> = ({ onGenerate, onImageSelect, isLoading, originalImage }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      onImageSelect(file);
      setError(null);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    multiple: false,
  });
  
  const handleGenerateClick = () => {
    if (!imageFile) {
        setError(t('select_image_error'));
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        const finalPrompt = selectedStyle ? `${selectedStyle} style: ${prompt}` : prompt;
        onGenerate(finalPrompt, { data: base64Data, mimeType: imageFile.type });
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="w-full md:w-96 bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-6">
      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-slate-700">{t('upload_image_label')}</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-cyan-500 ${
            isDragActive ? 'bg-slate-100 border-cyan-500' : 'bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          {originalImage ? (
            <img src={originalImage} alt="Preview" className="max-h-32 mx-auto rounded-md" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <UploadIcon className="w-8 h-8" />
              <p>{t('upload_image_placeholder')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Style Presets */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-slate-700">{t('style_label')}</label>
        <div className="flex flex-wrap gap-2">
          {stylePresets.map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                selectedStyle === style
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {t(`style_${style.toLowerCase()}` as StyleKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="font-semibold text-slate-700">
          {t('prompt_label')}
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t('prompt_placeholder')}
          rows={4}
          className="bg-slate-50 border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-slate-800"
        />
      </div>
      
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Generate Button */}
      <button
        onClick={handleGenerateClick}
        disabled={isLoading || !prompt || !originalImage}
        className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out hover:bg-cyan-600 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            {t('generating_button')}
          </>
        ) : (
          t('generate_button')
        )}
      </button>
    </div>
  );
};

export default InputPanel;