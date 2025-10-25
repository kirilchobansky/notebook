import styles from './WordsList.module.css';

const WordsListPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1>Deine Wortliste</h1>
            {/* TODO: 
        - Fetch your saved words from the Tauri store here
        - Map over them and display them
      */}
            <p>Alle gespeicherten Wörter werden hier angezeigt...</p>
        </div>
    );
};

export default WordsListPage;