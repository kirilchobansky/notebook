import styles from './AddWord.module.css';
import TranslateSection from '../../components/translateSection/TranslateSection';

const AddWordPage: React.FC = () => {

    return (
        <div className={styles.container}>
            <TranslateSection />
        </div>
    );
};

export default AddWordPage;