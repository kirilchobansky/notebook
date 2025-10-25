import React from 'react';
import { VerbWord } from '../../../types/words';
import styles from './VerbRow.module.css'; // We'll create this

interface VerbRowProps {
    word: VerbWord;
}

const VerbRow: React.FC<VerbRowProps> = ({ word }) => {
    return (
        <>
            <td><strong>{word.infinitiv}</strong></td>
            <td>{word.translation}</td>
            <td>
                <div className={styles.verbForms}>
                    <span>{word.praeteritum || '—'}</span>
                    <span>{word.perfekt || '—'}</span>
                </div>
            </td>
            <td>Verb</td>
        </>
    );
};

export default VerbRow;