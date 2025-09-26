import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from '../hooks/useTranslation';
import { UploadIcon } from './icons';

const galleryItems = [
  { id: 1, src: 'https://storage.googleapis.com/gemini-ui-params/demo/img/gallery/modern_1.jpeg', alt: 'Modern living room' },
  { id: 2, src: 'https://storage.googleapis.com/gemini-ui-params/demo/img/gallery/minimalist_1.jpeg', alt: 'Minimalist bedroom' },
  { id: 3, src: 'https://storage.googleapis.com/gemini-ui-params/demo/img/gallery/bohemian_1.jpeg', alt: 'Bohemian dining area' },
  { id: 4, src: 'https://storage.googleapis.com/gemini-ui-params/demo/img/gallery/industrial_1.jpeg', alt: 'Industrial kitchen' },
  { id: 5, src: 'https://storage.googleapis.com/gemini-ui-params/demo/img/gallery/coastal_1.jpeg', alt: 'Coastal bathroom' },
  { id: 6, src: 'https://storage.googleapis.com/gemini-ui-params/demo/img/gallery/farmhouse_1.jpeg', alt: 'Farmhouse living room' },
];

interface ImageSelectorProps {
  onImageSelected: (image: File | string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected }) => {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelected(acceptedFiles[0]);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    multiple: false,
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-slate-200 w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{t('image_selector_title')}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-slate-700 text-center">{t('image_selector_upload_title')}</h3>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer transition-colors h-full flex flex-col justify-center items-center hover:border-cyan-500 ${
                isDragActive ? 'bg-slate-100 border-cyan-500' : 'bg-slate-50'
                }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                    <UploadIcon className="w-10 h-10 mb-2" />
                    <p className="font-semibold">{t('upload_image_placeholder')}</p>
                </div>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-slate-700 text-center">{t('image_selector_gallery_title')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {galleryItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="aspect-square bg-slate-100 rounded-md overflow-hidden shadow-sm cursor-pointer group"
                        onClick={() => onImageSelected(item.src)}
                    >
                        <img 
                            src={item.src} 
                            alt={item.alt} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;
