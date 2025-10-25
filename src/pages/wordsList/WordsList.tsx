import React, { useState, useEffect } from 'react';
import styles from './WordsList.module.css';
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

const WordListPage: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
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
            console.log('Word deleted');

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
            <div className={styles.header}>
                <h1>Deine Wortliste</h1>
                <span>({words.length})</span>
            </div>
            <div className={styles.listContainer}>
                {words.length === 0 ? (
                    <p>Du hast noch keine Wörter gespeichert.</p>
                ) : (
                    words.map((word) => (
                        <div key={word.id} className={styles.wordCard}>
                            <div className={styles.wordDetails}>
                                <span className={styles.article}>{word.article}</span>
                                <span className={styles.word}>
                                    {word.singular}, {word.plural ? word.plural : '–'}
                                </span>
                                <span className={styles.translation}>{word.translation}</span>
                                <span className={styles.wordType}>{word.type}</span>
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