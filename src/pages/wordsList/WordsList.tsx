import React, { useState, useEffect, useMemo } from 'react';
import styles from './WordsList.module.css';
import { LazyStore } from '@tauri-apps/plugin-store';
import { Word } from '../../types/words';

const store = new LazyStore('wortliste.dat');

const WordListPage: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredWords = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();

        if (!lowerSearch) {
            return [...words].reverse();
        }

        return [...words].reverse().filter(word => {
            if (word.type === 'noun') {
                return (
                    word.singular.toLowerCase().includes(lowerSearch) ||
                    word.plural?.toLowerCase().includes(lowerSearch) ||
                    word.article.toLowerCase().includes(lowerSearch) ||
                    word.translation.toLowerCase().includes(lowerSearch)
                );
            }
            if (word.type === 'verb') {
                return (
                    word.infinitiv.toLowerCase().includes(lowerSearch) ||
                    word.praeteritum?.toLowerCase().includes(lowerSearch) ||
                    word.perfekt?.toLowerCase().includes(lowerSearch) ||
                    word.translation.toLowerCase().includes(lowerSearch)
                );
            }
            return false;
        });
    }, [words, searchTerm]);

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
            <div className={styles.header}>
                <h1>Deine Wortliste</h1>
                <input
                    type="text"
                    placeholder="Suchen..."
                    className={styles.searchBar}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.wordTable}>
                    <thead>
                        <tr>
                            <th>Wort</th>
                            <th>Übersetzung</th>
                            <th>Formen</th>
                            <th>Typ</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWords.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    {searchTerm
                                        ? 'Keine Wörter gefunden.'
                                        : 'Du hast noch keine Wörter gespeichert.'
                                    }
                                </td>
                            </tr>
                        ) : (
                            filteredWords.map((word) => (
                                <tr key={word.id}>
                                    {word.type === 'noun' && (
                                        <>
                                            <td><strong>{word.article} {word.singular}</strong></td>
                                            <td>{word.translation}</td>
                                            <td>{word.plural || '—'}</td>
                                            <td>Nomen</td>
                                        </>
                                    )}
                                    {word.type === 'verb' && (
                                        <>
                                            <td><strong>{word.infinitiv}</strong></td>
                                            <td>{word.translation}</td>
                                            <td>
                                                <div className={styles.verbForms}>
                                                    <span>{word.praeteritum || '—'}</span>
                                                    <span>{word.perfekt || '—'}</span>
                                                </div>
                                            </td>
                                            <td>Verb</td>
                                        </>
                                    )}
                                    <td>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(word.id)}
                                        >
                                            Löschen
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WordListPage;