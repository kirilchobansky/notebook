import React from 'react';
import { AdjectiveWord } from '../../../types/words';
import MarkSearch from '../../../utils/MarkSearch';

interface AdjectiveRowProps {
    word: AdjectiveWord;
    searchTerm: string;
}

const AdjectiveRow: React.FC<AdjectiveRowProps> = ({ word, searchTerm }) => {
    return (
        <>
            <td><strong>{MarkSearch(word.word, searchTerm)}</strong></td>
            <td>{MarkSearch(word.translation, searchTerm)}</td>
            <td>—</td>
            <td>Adjektiv</td>
        </>
    );
};

export default AdjectiveRow;