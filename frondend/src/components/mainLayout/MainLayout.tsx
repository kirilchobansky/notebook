import { Outlet } from 'react-router-dom';
import Header from '../header/Header';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
    return (
        <div className={styles.layoutContainer}>
            <Header />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;