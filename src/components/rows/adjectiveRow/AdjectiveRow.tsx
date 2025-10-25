import React from 'react';
import { AdjectiveWord } from '../../../types/words';

interface AdjectiveRowProps {
    word: AdjectiveWord;
}

const AdjectiveRow: React.FC<AdjectiveRowProps> = ({ word }) => {
    return (
        <>
            <td><strong>{word.word}</strong></td>
            <td>{word.translation}</td>
            <td>—</td>
            <td>Adjektiv</td>
        </>
    );
};

export default AdjectiveRow;