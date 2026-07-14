import React, { useState } from 'react';
import styles from './TranslateSection.module.css';
import { useTranslation } from '../../hooks/useTranslation';

const TranslateSection: React.FC = () => {

    const [inputText, setInputText] = useState('');

    const {
        translation,
        isLoading,
        triggerTranslation
    } = useTranslation();

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setInputText(newText);
        triggerTranslation(newText);
    };

    return (
        <div className={styles.translateContainer}>
            {/* Left Side (German Input) */}
            <div className={styles.languageSection}>
                <div className={styles.languageHeader}>
                    <span>German</span>
                </div>
                <textarea
                    className={styles.textArea}
                    placeholder="Text eingeben..."
                    value={inputText}
                    onChange={handleInputChange}
                />
            </div>

            {/* Right Side (Bulgarian Output) */}
            <div className={styles.languageSection}>
                <div className={styles.languageHeader}>
                    <span>Bulgarian</span>
                    {/* Optional: Add a loading indicator */}
                    {isLoading && <span className={styles.loadingIndicator}>...</span>}
                </div>
                <textarea
                    className={styles.textArea}
                    placeholder="Übersetzung"
                    readOnly
                    value={translation} // 7. Display translation
                />
            </div>
        </div>
    );
};

export default TranslateSection;