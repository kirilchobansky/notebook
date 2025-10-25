import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
        return isActive ? `${styles.navButton} ${styles.active}` : styles.navButton;
    };

    return (
        <header className={styles.header}>
            {/* Left side: Word type navigation */}
            <nav className={styles.navLinks}>
                <NavLink to="/add/noun" className={getNavLinkClass}>
                    Nomen
                </NavLink>
                <NavLink to="/add/adjective" className={getNavLinkClass}>
                    Adjektiv
                </NavLink>
                <NavLink to="/add/adverb" className={getNavLinkClass}>
                    Adverb
                </NavLink>
                <NavLink to="/add/verb" className={getNavLinkClass}>
                    Verb
                </NavLink>
            </nav>

            {/* Right side: App tools (like your list) */}
            <div className={styles.rightSection}>
                <NavLink to="/list" className={getNavLinkClass}>
                    Wortliste (List)
                </NavLink>
            </div>
        </header>
    );
};

export default Header;