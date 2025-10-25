import { LazyStore } from '@tauri-apps/plugin-store';
import { Word } from '../types/words'; // Use our shared types


const store = new LazyStore('wortliste.dat');

export const getWords = async (): Promise<Word[]> => {
    const words = await store.get<Word[]>('words') || [];
    return words;
};


export const saveWords = async (words: Word[]): Promise<void> => {
    await store.set('words', words);
    await store.save();
};

export const addWord = async (newWord: Word): Promise<void> => {
    const existingWords = await getWords();

    const isDuplicate = existingWords.some(word => {
        if (word.type === 'noun' && newWord.type === 'noun') {
            return word.singular === newWord.singular && word.article === newWord.article;
        }
        if (word.type === 'verb' && newWord.type === 'verb') {
            return word.infinitiv === newWord.infinitiv;
        }
        return false;
    });

    if (isDuplicate) {
        const wordName = newWord.type === 'noun' ? newWord.singular : newWord.infinitiv;
        throw new Error(`Das Wort "${wordName}" ist bereits vorhanden.`);
    }

    const updatedWords = [...existingWords, newWord];
    await saveWords(updatedWords);
};