import styles from './home.module.css';
import WordTypeButton from '../../components/buttons/noun/Noun';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1>Dein neues Wort ist</h1>
            <WordTypeButton type="noun" />
        </div>
    );
}

export default Home;