import { LazyStore } from '@tauri-apps/plugin-store';
import { Word } from '../types/words'; 


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
        if (word.type === 'adverb' && newWord.type === 'adverb') {
            return word.word === newWord.word;
        }
        if (word.type === 'adjective' && newWord.type === 'adjective') {
            return word.word === newWord.word;
        }
        return false;
    });

    if (isDuplicate) {
        let wordName = '';
        if (newWord.type === 'noun') wordName = newWord.singular;
        if (newWord.type === 'verb') wordName = newWord.infinitiv;
        if (newWord.type === 'adverb') wordName = newWord.word;
        if (newWord.type === 'adjective') wordName = newWord.word;

        throw new Error(`Das Wort "${wordName}" ist bereits vorhanden.`);
    }

    const updatedWords = [...existingWords, newWord];
    await saveWords(updatedWords);
};