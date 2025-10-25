import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WordType.module.css";

interface WordTypeButtonProps {
    type: "noun" | "verb" | "adjective" | "adverb";
}

const WordTypeButton: React.FC<WordTypeButtonProps> = ({ type }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/add/${type}`);
    };

    return (
        <button className={styles.wordTypeButton} onClick={handleClick} >
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </button >
    );
};

export default WordTypeButton;