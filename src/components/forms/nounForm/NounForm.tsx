import React, { useState, useRef, KeyboardEvent } from 'react';
import styles from './nounForm.module.css';
import { NounWord } from '../../../types/words';
import { addWord } from '../../../services/wordServices';
import { useTranslation } from '../../../hooks/useTranslation';

const capitalize = (s: string) => {
    if (s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const NounForm: React.FC = () => {
    const [article, setArticle] = useState('');
    const [singular, setSingular] = useState('');
    const [plural, setPlural] = useState('');
    const [error, setError] = useState<string | null>(null);

    const {
        translation,
        setTranslation,
        isLoading,
        triggerTranslation
    } = useTranslation();

    const articleRef = useRef<HTMLInputElement>(null);
    const singularRef = useRef<HTMLInputElement>(null);
    const pluralRef = useRef<HTMLInputElement>(null);
    const translationRef = useRef<HTMLInputElement>(null);

    const inputRefs = [articleRef, singularRef, pluralRef, translationRef];

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

        // 1. Validation
        const formattedArticle = article.trim().toLowerCase();
        if (!['der', 'die', 'das'].includes(formattedArticle)) {
            setError('Artikel muss "der", "die" oder "das" sein.');
            articleRef.current?.focus();
            return;
        }
        const formattedSingular = singular.trim();
        if (!formattedSingular) {
            setError('Singular darf nicht leer sein.');
            singularRef.current?.focus();
            return;
        }

        // 2. Formatting
        const finalArticle = formattedArticle;
        const finalSingular = capitalize(formattedSingular);
        const finalPlural = capitalize(plural.trim()) || null;

        // 3. Create Word Object
        const newNoun: NounWord = {
            id: crypto.randomUUID(),
            type: 'noun',
            article: finalArticle,
            singular: finalSingular,
            plural: finalPlural,
            translation: translation.replace('Fehler:', ''),
        };

        // 4. SAVE
        try {
            await addWord(newNoun);
            // Clear form
            setArticle('');
            setSingular('');
            setPlural('');
            setTranslation(''); // <-- 3. Use setter from hook
            articleRef.current?.focus();

        } catch (error) {
            console.error("Failed to save word:", error);
            setError((error as Error).message);
        }
    };

    return (
        <form className={styles.wordForm} onSubmit={handleSubmit}>
            {/* --- Artikel (Article) --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="article">Artikel</label>
                <input
                    type="text" id="article" ref={articleRef}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    value={article} onChange={(e) => setArticle(e.target.value)}
                    placeholder="der, die, das..." required autoComplete="off"
                />
            </div>

            {/* --- Singular (The Word) --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="singular">Singular</label>
                <input
                    type="text" id="singular" ref={singularRef}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    onBlur={(e) => triggerTranslation(e.target.value)} // <-- 4. Call hook
                    value={singular} onChange={(e) => setSingular(e.target.value)}
                    placeholder="z.B. Tisch" required autoComplete="off"
                />
            </div>

            {/* --- Plural --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="plural">Plural</label>
                <input
                    type="text" id="plural" ref={pluralRef}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    value={plural} onChange={(e) => setPlural(e.target.value)}
                    placeholder="z.B. Tische (leer lassen, wenn nicht vorhanden)" autoComplete="off"
                />
            </div>

            {/* --- Translation Field --- */}
            <div className={styles.fieldGroup}>
                <label htmlFor="translation">Übersetzung (Bulgarisch)</label>
                <input
                    type="text" id="translation" ref={translationRef}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    value={translation} // <-- 5. State from hook
                    onChange={(e) => setTranslation(e.target.value)} // <-- 5. State from hook
                    placeholder={isLoading ? '...' : 'Wird automatisch ausgefüllt'} // <-- 5. State from hook
                    disabled={isLoading} // <-- 5. State from hook
                    autoComplete="off"
                />
            </div>

            {/* --- Error Message Area --- */}
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