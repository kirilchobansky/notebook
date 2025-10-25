import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const useTranslation = () => {
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const triggerTranslation = async (word: string) => {
        if (!word) {
            setTranslation('');
            return;
        }

        setIsLoading(true);
        setTranslation('Übersetze...');

        try {
            const translatedText = await invoke<string>('translate', {
                text: word,
                from: 'de',
                to: 'bg'
            });
            setTranslation(translatedText);
        } catch (error) {
            console.error("Translation error from Rust:", error);
            setTranslation(`Fehler: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        translation,
        setTranslation,
        isLoading,
        triggerTranslation
    };
};