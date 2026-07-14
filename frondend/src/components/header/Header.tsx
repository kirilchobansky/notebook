import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
        return isActive ? `${styles.navButton} ${styles.active}` : styles.navButton;
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navLinks}>
                <NavLink to="/translate" className={getNavLinkClass}>
                    Translate
                </NavLink>
            </nav>

            <div className={styles.rightSection}>
                <NavLink to="/list" className={getNavLinkClass}>
                    Wortliste (List)
                </NavLink>
            </div>
        </header>
    );
};

export default Header;