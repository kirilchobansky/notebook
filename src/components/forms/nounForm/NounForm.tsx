import React, { useState, useRef, KeyboardEvent, FocusEvent } from 'react';
import styles from './NounForm.module.css';
import { invoke } from '@tauri-apps/api/core';
import { LazyStore } from '@tauri-apps/plugin-store';

interface Word {
    id: string;
    type: string;
    article?: string;
    singular?: string;
    plural?: string;
    translation: string;
}

const store = new LazyStore('wortliste.dat');

const capitalize = (s: string) => {
    if (s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const NounForm: React.FC = () => {
    const [article, setArticle] = useState('');
    const [singular, setSingular] = useState('');
    const [plural, setPlural] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const articleRef = useRef<HTMLInputElement>(null);
    const singularRef = useRef<HTMLInputElement>(null);
    const pluralRef = useRef<HTMLInputElement>(null);
    const translationRef = useRef<HTMLInputElement>(null);

    const inputRefs = [articleRef, singularRef, pluralRef, translationRef];

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
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

    const handleTranslate = async (e: FocusEvent<HTMLInputElement>) => {
        const wordToTranslate = e.target.value;
        if (!wordToTranslate) return;

        setIsLoading(true);
        setTranslation('Übersetze...');

        try {
            const translatedText = await invoke<string>('translate', {
                text: wordToTranslate,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);


        // Format and validate article
        const formattedArticle = article.trim().toLowerCase();
        if (!['der', 'die', 'das'].includes(formattedArticle)) {
            setError('Artikel muss "der", "die" oder "das" sein.');
            articleRef.current?.focus();
            return;
        }

        // Validate singular
        const formattedSingular = singular.trim();
        if (!formattedSingular) {
            setError('Singular darf nicht leer sein.');
            singularRef.current?.focus();
            return;
        }

        // --- 2. FORMATTING ---

        const finalArticle = formattedArticle;
        const finalSingular = capitalize(formattedSingular);

        // Capitalize plural if it exists, otherwise create default
        const finalPlural = capitalize(plural.trim()) || finalSingular + 'e';

        // --- 3. DUPLICATE CHECK (Async) ---
        let existingWords: Word[] = [];
        try {
            existingWords = await store.get<Word[]>('words') || [];
        } catch (err) {
            setError(`Fehler beim Laden der Wörter: ${err}`);
            return;
        }

        const isDuplicate = existingWords.some(
            word => word.singular === finalSingular && word.article === finalArticle
        );

        if (isDuplicate) {
            setError(`Das Wort "${finalArticle} ${finalSingular}" ist bereits vorhanden.`);
            singularRef.current?.focus();
            return;
        }

        // --- 4. SAVE ---

        const newNoun: Word = {
            id: crypto.randomUUID(),
            type: 'noun',
            article: finalArticle,
            singular: finalSingular,
            plural: finalPlural,
            translation: translation.replace('Fehler:', ''), // Don't save error text
        };

        try {
            const updatedWords = [...existingWords, newNoun];
            await store.set('words', updatedWords);
            await store.save();

            console.log('Word saved!', newNoun);

            // Clear form
            setArticle('');
            setSingular('');
            setPlural('');
            setTranslation('');
            articleRef.current?.focus();

        } catch (error) {
            console.error("Failed to save word:", error);
            setError(`Wort konnte nicht gespeichert werden! Fehler: ${error}`);
        }
    };

    return (
        <form className={styles.wordForm} onSubmit={handleSubmit}>

            {/* --- Artikel (Article) --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="article">Artikel</label>
                <input
                    type="text"
                    id="article"
                    ref={articleRef}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    placeholder="der, die, das..."
                    required
                    autoComplete="off"
                />
            </div>

            {/* --- Singular (The Word) --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="singular">Singular</label>
                <input
                    type="text"
                    id="singular"
                    ref={singularRef}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    onBlur={handleTranslate}
                    value={singular}
                    onChange={(e) => setSingular(e.target.value)}
                    placeholder="z.B. Tisch"
                    required
                    autoComplete="off"
                />
            </div>

            {/* --- Plural --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="plural">Plural</label>
                <input
                    type="text"
                    id="plural"
                    ref={pluralRef}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    value={plural}
                    onChange={(e) => setPlural(e.target.value)}
                    placeholder="z.B. Tische (Standard: Singular + 'e')"
                    autoComplete="off"
                />
            </div>

            {/* --- Translation Field --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="translation">Übersetzung (Bulgarisch)</label>
                <input
                    type="text"
                    id="translation"
                    ref={translationRef}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    placeholder={isLoading ? '...' : 'Wird automatisch ausgefüllt'}
                    disabled={isLoading}
                    autoComplete="off"
                />
            </div>

            {/* --- NEW: Error Message Area --- */}
            <div className={styles.errorContainer}>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            {/* --- Submit Button --- */}
            <button type="submit" className={styles.submitButton}>
                Nomen hinzufügen
            </button>

        </form>
    );
};

export default NounForm;