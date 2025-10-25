import React from 'react';
import { AdverbWord } from '../../../types/words';

interface AdverbRowProps {
    word: AdverbWord;
}

const AdverbRow: React.FC<AdverbRowProps> = ({ word }) => {
    return (
        <>
            <td><strong>{word.word}</strong></td>
            <td>{word.translation}</td>
            <td>—</td>
            <td>Adverb</td>
        </>
    );
};

export default AdverbRow;