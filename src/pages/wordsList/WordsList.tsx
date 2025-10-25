import React, { useState, useEffect } from 'react';
import styles from './WordsList.module.css';
import { LazyStore } from '@tauri-apps/plugin-store';
import { Word, NounWord, VerbWord } from '../../types/words'; // <-- 1. Import types

const store = new LazyStore('wortliste.dat');

/**
 * Helper component to render Noun details
 */
const NounCard: React.FC<{ word: NounWord }> = ({ word }) => (
    <>
        <span className={styles.article}>{word.article}</span>
        <span className={styles.word}>
            {word.singular}
            {word.plural ? ` / ${word.plural}` : ''}
        </span>
        <span className={styles.translation}>{word.translation}</span>
        <span className={styles.wordType}>{word.type}</span>
    </>
);

/**
 * Helper component to render Verb details
 */
const VerbCard: React.FC<{ word: VerbWord }> = ({ word }) => (
    <>
        {/* You may want to add new CSS styles for verbs */}
        <span className={styles.word}>{word.infinitiv}</span>
        <span className={styles.verbForms}>
            {word.praeteritum && <span>Prät: {word.praeteritum}</span>}
            {word.perfekt && <span>Perf: {word.perfekt}</span>}
        </span>
        <span className={styles.translation}>{word.translation}</span>
        <span className={styles.wordType}>{word.type}</span>
    </>
);

const WordListPage: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]); // <-- 2. Use base "Word" type
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWords = async () => {
            try {
                const storedWords = await store.get<Word[]>('words') || [];
                setWords(storedWords);
            } catch (error) {
                console.error("Failed to load words:", error);
            } finally {
                setLoading(false);
            }
        };
        loadWords();
    }, []);

    const handleDelete = async (idToDelete: string) => {
        const updatedWords = words.filter(word => word.id !== idToDelete);
        try {
            await store.set('words', updatedWords);
            await store.save();
            setWords(updatedWords);
        } catch (error) {
            console.error('Failed to delete word:', error);
            alert('Fehler beim Löschen des Wortes.');
        }
    };

    if (loading) {
        return <h1>Lade Wörter...</h1>;
    }

    return (
        <div className={styles.container}>
            <h1>Deine Wortliste</h1>
            <div className={styles.listContainer}>
                {words.length === 0 ? (
                    <p>Du hast noch keine Wörter gespeichert.</p>
                ) : (
                    words.map((word) => (
                        <div key={word.id} className={styles.wordCard}>
                            <div className={styles.wordDetails}>
                                {/* --- 3. Render based on word type --- */}
                                {word.type === 'noun' && <NounCard word={word} />}
                                {word.type === 'verb' && <VerbCard word={word} />}
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(word.id)}
                            >
                                Löschen
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WordListPage;