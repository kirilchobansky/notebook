import { useParams } from 'react-router-dom';
import styles from './AddWord.module.css';
import NounForm from '../../components/forms/nounForm/NounForm';

const AddWordPage: React.FC = () => {
    const { wordType } = useParams();

    const renderForm = () => {
        switch (wordType) {
            case 'noun':
                return <NounForm />;
            case 'adjective':
                // return <AdjectiveForm />;
                return <p>Adjektiv-Formular kommt hier hin...</p>;
            case 'adverb':
                // return <AdverbForm />;
                return <p>Adverb-Formular kommt hier hin...</p>;
            case 'verb':
                // return <VerbForm />;
                return <p>Verb-Formular kommt hier hin...</p>;
            default:
                return <p>Bitte eine Wortart auswählen.</p>;
        }
    };

    const title = wordType ? wordType.charAt(0).toUpperCase() + wordType.slice(1) : '';

    return (
        <div className={styles.container}>
            <h1>Neues {title} hinzufügen</h1>

            {renderForm()}

        </div>
    );
};

export default AddWordPage;