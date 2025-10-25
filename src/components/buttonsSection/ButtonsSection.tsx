import React from "react";
import styles from "./ButtonsSection.module.css";
import WordTypeButton from "../buttons/wordType/WordType";

const ButtonsSection: React.FC = () => {
    return (
        <div className={styles.buttonsContainer}>
            <WordTypeButton type="noun" />
            <WordTypeButton type="verb" />
            <WordTypeButton type="adjective" />
            <WordTypeButton type="adverb" />
        </div>
    );
};

export default ButtonsSection;
