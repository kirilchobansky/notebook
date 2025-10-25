import { useState, useEffect, useMemo } from 'react';
import { Word } from '../types/words';
import { getWords, saveWords } from '../services/wordServices';

export const useWordList = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadWords = async () => {
            setLoading(true);
            try {
                const storedWords = await getWords();
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
            await saveWords(updatedWords);
            setWords(updatedWords);
        } catch (error) {
            console.error('Failed to delete word:', error);
            alert('Fehler beim Löschen des Wortes.');
        }
    };

    const filteredWords = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        if (!lowerSearch) return [...words].reverse();

        return [...words].reverse().filter(word => {
            if (word.type === 'noun') {
                return word.singular.toLowerCase().includes(lowerSearch) ||
                    word.plural?.toLowerCase().includes(lowerSearch) ||
                    word.article.toLowerCase().includes(lowerSearch) ||
                    word.translation.toLowerCase().includes(lowerSearch);
            }
            if (word.type === 'verb') {
                return word.infinitiv.toLowerCase().includes(lowerSearch) ||
                    word.praeteritum?.toLowerCase().includes(lowerSearch) ||
                    word.perfekt?.toLowerCase().includes(lowerSearch) ||
                    word.translation.toLowerCase().includes(lowerSearch);
            }
            if (word.type === 'adverb') {
                return (
                    word.word.toLowerCase().includes(lowerSearch) ||
                    word.translation.toLowerCase().includes(lowerSearch)
                );
            }
            return false;
        });
    }, [words, searchTerm]);

    return {
        loading,
        searchTerm,
        setSearchTerm,
        filteredWords,
        handleDelete
    };
};