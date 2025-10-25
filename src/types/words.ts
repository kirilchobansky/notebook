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

export type Word = NounWord | VerbWord; 