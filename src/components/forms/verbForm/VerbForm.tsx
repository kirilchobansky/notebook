import React, { useState, useRef, KeyboardEvent, FocusEvent } from 'react';
import styles from './verbForm.module.css';
import { invoke } from '@tauri-apps/api/core';
import { LazyStore } from '@tauri-apps/plugin-store';
import { Word, VerbWord } from '../../../types/words';

const store = new LazyStore('wortliste.dat');

const VerbForm: React.FC = () => {
    const [infinitiv, setInfinitiv] = useState('');
    const [praeteritum, setPraeteritum] = useState('');
    const [perfekt, setPerfekt] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for navigation
    const infinitivRef = useRef<HTMLInputElement>(null);
    const praeteritumRef = useRef<HTMLInputElement>(null);
    const perfektRef = useRef<HTMLInputElement>(null);
    const translationRef = useRef<HTMLInputElement>(null);

    const inputRefs = [infinitivRef, praeteritumRef, perfektRef, translationRef];

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
                text: wordToTranslate, from: 'de', to: 'bg'
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

        // 1. VALIDATION
        const finalInfinitiv = infinitiv.trim().toLowerCase(); // Verbs are lowercase
        if (!finalInfinitiv) {
            setError('Infinitiv darf nicht leer sein.');
            infinitivRef.current?.focus();
            return;
        }

        // 2. FORMATTING
        const finalPraeteritum = praeteritum.trim() || null;
        const finalPerfekt = perfekt.trim() || null;

        // 3. DUPLICATE CHECK
        let existingWords: Word[] = [];
        try {
            existingWords = await store.get<Word[]>('words') || [];
        } catch (err) {
            setError(`Fehler beim Laden der Wörter: ${err}`);
            return;
        }

        const isDuplicate = existingWords.some(
            word => word.type === 'verb' && word.infinitiv === finalInfinitiv
        );

        if (isDuplicate) {
            setError(`Das Verb "${finalInfinitiv}" ist bereits vorhanden.`);
            infinitivRef.current?.focus();
            return;
        }

        // 4. SAVE
        const newVerb: VerbWord = {
            id: crypto.randomUUID(),
            type: 'verb',
            infinitiv: finalInfinitiv,
            praeteritum: finalPraeteritum,
            perfekt: finalPerfekt,
            translation: translation.replace('Fehler:', ''),
        };

        try {
            const updatedWords = [...existingWords, newVerb];
            await store.set('words', updatedWords);
            await store.save();

            console.log('Word saved!', newVerb);

            // Clear form
            setInfinitiv('');
            setPraeteritum('');
            setPerfekt('');
            setTranslation('');
            infinitivRef.current?.focus();

        } catch (error) {
            console.error("Failed to save word:", error);
            setError(`Wort konnte nicht gespeichert werden! Fehler: ${error}`);
        }
    };

    return (
        <form className={styles.wordForm} onSubmit={handleSubmit}>

            {/* --- Infinitiv --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="infinitiv">Infinitiv</label>
                <input
                    type="text"
                    id="infinitiv"
                    ref={infinitivRef}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    onBlur={handleTranslate} // Translate on blur
                    value={infinitiv}
                    onChange={(e) => setInfinitiv(e.target.value)}
                    placeholder="z.B. gehen"
                    required
                    autoComplete="off"
                />
            </div>

            {/* --- Präteritum --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="praeteritum">Präteritum</label>
                <input
                    type="text"
                    id="praeteritum"
                    ref={praeteritumRef}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    value={praeteritum}
                    onChange={(e) => setPraeteritum(e.target.value)}
                    placeholder="z.B. ging (leer lassen, wenn nicht vorhanden)"
                    autoComplete="off"
                />
            </div>

            {/* --- Perfekt --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="perfekt">Perfekt</label>
                <input
                    type="text"
                    id="perfekt"
                    ref={perfektRef}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    value={perfekt}
                    onChange={(e) => setPerfekt(e.target.value)}
                    placeholder="z.B. gegangen (leer lassen, wenn nicht vorhanden)"
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

            {/* --- Error Message Area --- */}
            <div className={styles.errorContainer}>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            {/* --- Submit Button --- */}
            <button type="submit" className={styles.submitButton}>
                Verb hinzufügen
            </button>

        </form>
    );
};

export default VerbForm;