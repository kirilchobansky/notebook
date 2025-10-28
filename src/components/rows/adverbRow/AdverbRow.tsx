import React from 'react';
import { AdverbWord } from '../../../types/words';
import MarkSearch from '../../../utils/MarkSearch';

interface AdverbRowProps {
    word: AdverbWord;
    searchTerm: string;
}

const AdverbRow: React.FC<AdverbRowProps> = ({ word, searchTerm }) => {
    return (
        <>
            <td><strong>{MarkSearch(word.word, searchTerm)}</strong></td>
            <td>{MarkSearch(word.translation, searchTerm)}</td>
            <td>—</td>
            <td>Adverb</td>
        </>
    );
};

export default AdverbRow;