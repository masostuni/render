import React, { useState, useCallback } from 'react';
import { Part } from '@google/genai';
import { useApiKey } from './hooks/useApiKey';
import { useTranslation } from './hooks/useTranslation';
import ApiKeyManager from './components/ApiKeyManager';
import ImageSelector from './components/GalleryPanel';
import InputPanel from './components/InputPanel';
import ImageComparison from './components/ArchitectureDiagram';
import { generateImage } from './services/geminiService';
import { Logo } from './components/icons';
import LanguageSwitcher from './components/LanguageSwitcher';
import UserMenu from './components/UserMenu';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { apiKey } = useApiKey();
    const { t } = useTranslation();

    const handleImageSelected = useCallback(async (image: File | string) => {
        setError(null);
        setGeneratedImage(null);

        if (typeof image === 'string') { // Gallery image URL
            setOriginalImage(image);
        } else { // Uploaded file
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setOriginalImage(url);
            };
            reader.readAsDataURL(image);
        }
    }, []);

    const handleGenerate = useCallback(async (prompt: string, image: { data: string; mimeType: string }) => {
        if (!apiKey) {
            setError("API key is not configured.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imagePart: Part = {
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType,
                },
            };
            const resultBase64 = await generateImage(apiKey, prompt, imagePart);
            if (resultBase64) {
                setGeneratedImage(`data:image/png;base64,${resultBase64}`);
            } else {
                setError("The model did not return an image. Please try a different prompt.");
            }
        } catch (e: any) {
            setError(e.message || "An unknown error occurred during image generation.");
        } finally {
            setIsLoading(false);
        }
    }, [apiKey]);

    if (!apiKey) {
        return <ApiKeyManager />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Logo className="h-8 w-auto text-cyan-600" />
                            <h1 className="text-lg font-bold text-slate-700 hidden sm:block">{t('app_title')}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                {!originalImage ? (
                    <div className="flex items-center justify-center h-full">
                        <ImageSelector onImageSelected={handleImageSelected} />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                        <InputPanel 
                            onGenerate={handleGenerate} 
                            onImageSelect={handleImageSelected}
                            isLoading={isLoading} 
                            originalImage={originalImage}
                        />
                        <ImageComparison 
                            originalImage={originalImage} 
                            generatedImage={generatedImage}
                        />
                    </div>
                )}
                {error && (
                    <div 
                        className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm"
                        role="alert"
                    >
                        <strong className="font-bold">{t('error_title')}</strong>
                        <p className="block sm:inline ml-2">{error}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
