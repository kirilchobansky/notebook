interface BaseWord {
    id: string;
    translation: string;
}

export interface NounWord extends BaseWord {
    type: 'noun';
    article: string;
    singular: string;
    plural: string | null;
}

export interface VerbWord extends BaseWord {
    type: 'verb';
    infinitiv: string;
    praeteritum: string | null;
    perfekt: string | null;
}

export interface AdverbWord extends BaseWord {
    type: 'adverb';
    word: string;
}

export interface AdjectiveWord extends BaseWord {
    type: 'adjective';
    word: string;
}

export type Word = NounWord | VerbWord | AdverbWord | AdjectiveWord; 