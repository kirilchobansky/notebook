import React, { useState, useRef, KeyboardEvent } from 'react';
import styles from './verbForm.module.css';
import { VerbWord } from '../../../types/words';
import { addWord } from '../../../services/wordServices';
import { useTranslation } from '../../../hooks/useTranslation'; // <-- 1. Import hook

const VerbForm: React.FC = () => {
    const [infinitiv, setInfinitiv] = useState('');
    const [praeteritum, setPraeteritum] = useState('');
    const [perfekt, setPerfekt] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        translation,
        setTranslation,
        isLoading,
        triggerTranslation
    } = useTranslation();

    const infinitivRef = useRef<HTMLInputElement>(null);
    const praeteritumRef = useRef<HTMLInputElement>(null);
    const perfektRef = useRef<HTMLInputElement>(null);
    const translationRef = useRef<HTMLInputElement>(null);

    const inputRefs = [infinitivRef, praeteritumRef, perfektRef, translationRef];

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

        const finalInfinitiv = infinitiv.trim().toLowerCase();
        if (!finalInfinitiv) {
            setError('Infinitiv darf nicht leer sein.');
            infinitivRef.current?.focus();
            return;
        }

        const finalPraeteritum = praeteritum.trim() || null;
        const finalPerfekt = perfekt.trim() || null;

        const newVerb: VerbWord = {
            id: crypto.randomUUID(),
            type: 'verb',
            infinitiv: finalInfinitiv,
            praeteritum: finalPraeteritum,
            perfekt: finalPerfekt,
            translation: translation.replace('Fehler:', ''),
        };

        try {
            await addWord(newVerb);
            setInfinitiv('');
            setPraeteritum('');
            setPerfekt('');
            setTranslation('');
            infinitivRef.current?.focus();

        } catch (error) {
            console.error("Failed to save word:", error);
            setError((error as Error).message);
        }
    };

    return (
        <form className={styles.wordForm} onSubmit={handleSubmit}>

            {/* --- Infinitiv --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="infinitiv">Infinitiv</label>
                <input
                    type="text" id="infinitiv" ref={infinitivRef}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    onBlur={(e) => triggerTranslation(e.target.value)} // <-- 4. Call hook
                    value={infinitiv} onChange={(e) => setInfinitiv(e.target.value)}
                    placeholder="z.B. gehen" required autoComplete="off"
                />
            </div>

            {/* --- Präteritum --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="praeteritum">Präteritum</label>
                <input
                    type="text" id="praeteritum" ref={praeteritumRef}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    value={praeteritum} onChange={(e) => setPraeteritum(e.target.value)}
                    placeholder="z.B. ging (leer lassen, wenn nicht vorhanden)" autoComplete="off"
                />
            </div>

            {/* --- Perfekt --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="perfekt">Perfekt</label>
                <input
                    type="text" id="perfekt" ref={perfektRef}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    value={perfekt} onChange={(e) => setPerfekt(e.target.value)}
                    placeholder="z.B. gegangen (leer lassen, wenn nicht vorhanden)" autoComplete="off"
                />
            </div>

            {/* --- Translation Field --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="translation">Übersetzung (Bulgarisch)</label>
                <input
                    type="text" id="translation" ref={translationRef}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    placeholder={isLoading ? '...' : 'Wird automatisch ausgefüllt'}
                    disabled={isLoading}
                    autoComplete="off"
                />
            </div>

            <div className={styles.errorContainer}>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            <button type="submit" className={styles.submitButton}>
                Verb hinzufügen
            </button>

        </form>
    );
};

export default VerbForm;