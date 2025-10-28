import React from 'react';
import { VerbWord } from '../../../types/words';
import styles from './VerbRow.module.css'; 
import MarkSearch from '../../../utils/MarkSearch';

interface VerbRowProps {
    word: VerbWord;
    searchTerm: string;
}

const VerbRow: React.FC<VerbRowProps> = ({ word, searchTerm }) => {
    return (
        <>
            <td><strong>{MarkSearch(word.infinitiv, searchTerm)}</strong></td>
            <td>{MarkSearch(word.translation, searchTerm)}</td>
            <td>
                <div className={styles.verbForms}>
                    <span>{MarkSearch(word.praeteritum || '—', searchTerm)}</span>
                    <span>{MarkSearch(word.perfekt || '—', searchTerm)}</span>
                </div>
            </td>
            <td>Verb</td>
        </>
    );
};

export default VerbRow;