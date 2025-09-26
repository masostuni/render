import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface ImageComparisonProps {
  originalImage: string | null;
  generatedImage: string | null;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({ originalImage, generatedImage }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original Image */}
      <div className="flex flex-col gap-2">
        <h3 className="text-center font-semibold text-slate-600">{t('original_image_label')}</h3>
        <div className="flex-1 bg-slate-100 rounded-lg p-2 flex items-center justify-center min-h-64 border border-slate-200">
          {originalImage ? (
            <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="text-slate-500">{t('no_original_image')}</div>
          )}
        </div>
      </div>
      
      {/* Generated Image */}
      <div className="flex flex-col gap-2">
        <h3 className="text-center font-semibold text-slate-600">{t('generated_image_label')}</h3>
        <div className="flex-1 bg-slate-100 rounded-lg p-2 flex items-center justify-center min-h-64 border border-slate-200">
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-md" />
          ) : (
            <div className="text-slate-500">{t('generated_image_placeholder')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
