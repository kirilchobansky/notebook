import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const useTranslation = (debounceDelay = 500) => { 
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerTranslation = async (word: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!word) {
      setTranslation('');
      setIsError(false);
      setIsLoading(false);
      return;
    }

    word = word.trim().toLowerCase();
    setIsLoading(true);
    setTranslation('...');
    setIsError(false);

    debounceTimeoutRef.current = setTimeout(async () => {
      setTranslation('Übersetze...');
      try {
        const translatedText = await invoke<string>('translate', {
          text: word,
          from: 'de',
          to: 'bg'
        });
        setTranslation(translatedText.toLowerCase());
        setIsError(false); 
      } catch (error) {
        console.error("Translation error from Rust:", error);
        setTranslation(`Fehler: ${error}`);
        setIsError(true); 
      } finally {
        setIsLoading(false);
      }
    }, debounceDelay); 
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    translation,
    setTranslation,
    isLoading,
    isError, 
    triggerTranslation
  };
};