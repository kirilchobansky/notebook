import React, { useState, useRef, KeyboardEvent } from 'react';
import styles from './AdverbForm.module.css';
import { AdverbWord } from '../../../types/words';
import { addWord } from '../../../services/wordServices';
import { useTranslation } from '../../../hooks/useTranslation';

const AdverbForm: React.FC = () => {
    const [word, setWord] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        translation,
        setTranslation,
        isLoading,
        isError,
        triggerTranslation
    } = useTranslation();

    const wordRef = useRef<HTMLInputElement>(null);
    const translationRef = useRef<HTMLInputElement>(null);
    const inputRefs = [wordRef, translationRef];

    const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWord = e.target.value;
        setWord(newWord);
        triggerTranslation(newWord);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = index + 1;
            if (nextIndex < inputRefs.length) {
                inputRefs[nextIndex].current?.focus();
            } else if (e.key === 'Enter') {
                handleSubmit(e);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                inputRefs[prevIndex].current?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const finalWord = word.trim().toLowerCase();

        if (!translation || translation.startsWith('Fehler:') || isError || isLoading) {
            setError('Übersetzung darf nicht leer sein.');
            translationRef.current?.focus();
            return;
        }

        const newAdverb: AdverbWord = {
            id: crypto.randomUUID(),
            type: 'adverb',
            word: finalWord,
            translation: translation,
        };

        try {
            await addWord(newAdverb);
            setWord('');
            setTranslation('');
            wordRef.current?.focus();
        } catch (error) {
            console.error("Failed to save word:", error);
            setError((error as Error).message);
        }
    };

    return (
        <form className={styles.wordForm} onSubmit={handleSubmit}>

            <div className={styles.fieldGroup}>
                <label htmlFor="adverb">Adverb</label>
                <input
                    type="text" id="adverb" ref={wordRef}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    value={word} onChange={(e) => handleWordChange(e)}
                    placeholder="z.B. schnell"
                    required autoComplete="off"
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="translation">Übersetzung (Bulgarisch)</label>
                <input
                    type="text" id="translation" ref={translationRef}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    placeholder={isLoading ? '...' : 'Wird automatisch ausgefüllt'}
                    disabled={isLoading}
                    required autoComplete="off"
                />
            </div>

            <div className={styles.errorContainer}>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            <button type="submit" className={styles.submitButton}>
                Adverb hinzufügen
            </button>

        </form>
    );
};

export default AdverbForm;