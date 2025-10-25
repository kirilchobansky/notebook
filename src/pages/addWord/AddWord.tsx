import { useParams } from 'react-router-dom';
import styles from './AddWord.module.css';

const AddWordPage: React.FC = () => {
    const { wordType } = useParams();

    const title = wordType ? wordType.charAt(0).toUpperCase() + wordType.slice(1) : '';

    return (
        <div className={styles.container}>
            <h1>Neues Wort hinzufügen: {title}</h1>

            {/* Here you can show different forms based on the wordType
        
        {wordType === 'noun' && ( <NounForm /> )}
        {wordType === 'verb' && ( <VerbForm /> )}
        ...etc
      */}

            <p>Dein Formular für "{wordType}" kommt hier hin...</p>

            {/* Example of a dynamic field */}
            {wordType === 'noun' && (
                <div>
                    <label>Artikel (der, die, das):</label>
                    <input type="text" />
                </div>
            )}

        </div>
    );
};

export default AddWordPage;