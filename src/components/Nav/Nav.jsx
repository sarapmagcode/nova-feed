import { useState } from 'react';
import styles from './Nav.module.css';
import { Link } from 'react-router-dom';

const Nav = () => {
    const [isNavShown, setIsNavShown] = useState(false);

    const handleMobileToggle = () => {
        setIsNavShown(prevIsNavShown => !prevIsNavShown);
    };

    const hideNavLinks = () => {
        setIsNavShown(false);
    };
    
    return (
        <div className={styles.navContainer}>
            <nav>
                <Link to="/" className={styles.logo}>
                    <span>🌌</span>
                    <h1>NovaFeed</h1>
                </Link>

                <div className={`${styles.navLinks} ${isNavShown ? styles.active : ''}`}>
                    <Link to="/" className={`${styles.active} ${styles.navLinkItem}`} onClick={hideNavLinks}>Home</Link>
                    <Link to="/explore" className={styles.navLinkItem} onClick={hideNavLinks}>Explore</Link>
                    <Link to="/mars-rover" className={styles.navLinkItem} onClick={hideNavLinks}>Mars Rover Gallery</Link>
                    <Link to="/about" className={styles.navLinkItem} onClick={hideNavLinks}>About</Link>
                </div>

                <button onClick={handleMobileToggle} className={styles.mobileToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(255,255,255,1)">
                        <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                    </svg>
                </button>
            </nav>
        </div>
    );
};

export default Nav;