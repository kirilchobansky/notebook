import React from 'react';
import styles from './WordsList.module.css';
import { useWordList } from '../../hooks/useWordList';
import NounRow from '../../components/rows/nounRow/NounRow';
import VerbRow from '../../components/rows/verbRow/VerbRow';
import AdverbRow from '../../components/rows/adverbRow/AdverbRow';
import AdjectiveRow from '../../components/rows/adjectiveRow/AdjectiveRow';

const WordListPage: React.FC = () => {
    const {
        loading,
        searchTerm,
        setSearchTerm,
        filteredWords,
        handleDelete,
        words
    } = useWordList();

    if (loading) {
        return <h1>Lade Wörter...</h1>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Deine Wortliste</h1>
                <span>({words.length})</span>
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
                                    {word.type === 'noun' && <NounRow word={word} />}
                                    {word.type === 'verb' && <VerbRow word={word} />}
                                    {word.type === 'adverb' && <AdverbRow word={word} />}
                                    {word.type === 'adjective' && <AdjectiveRow word={word} />}

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