import React from 'react';
import { NounWord } from '../../../types/words';

interface NounRowProps {
    word: NounWord;
}

const NounRow: React.FC<NounRowProps> = ({ word }) => {
    return (
        <>
            <td><strong>{word.article} {word.singular}</strong></td>
            <td>{word.translation}</td>
            <td>{word.plural || '—'}</td>
            <td>Nomen</td>
        </>
    );
};

export default NounRow;