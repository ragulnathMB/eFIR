import styles from './NavBar.module.css';
import mainLogo from '../../assets/govt_of_ind_logo.png';
import { useState } from 'react';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';


const NavBar = () => {
    const navigate = useNavigate();
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const {user,logout}=useAuth();

    const goTo = (path) => {
        navigate(path);
        setHamburgerOpen(false); // Close the hamburger menu on navigation
    };

    const [profileModal, setProfileModal] = useState(false);
    const { textSize, colorMode } = useAccessibility();

    // Define styles based on the context values
    const fontSize = `${textSize}px`;

    return (
        <>
            <div className={styles.main} style={{ backgroundColor: colorMode === 'dark' ? 'black' : 'white' }}>
                <div>
                    <img src={mainLogo} className={styles.lImg} alt="Govt Logo" />
                </div>

                {/* Nav Content for larger screens */}
                <div className={`${styles.navContent} ${styles.hideOnSmall}`} style={{ fontSize: fontSize, color: colorMode === 'dark' ? 'yellow' : 'black' }}>
                    <div className={styles.navItem} onClick={() => goTo('/')}><p>Home</p></div>
                    <div className={styles.navItem} onClick={() => goTo('/FileFIR')}><p>File FIR</p></div>
                    <div className={styles.navItem} onClick={() => goTo('/UserDashboard')}><p>Dashboard</p></div>
                    <div className={styles.navItem} onClick={() => goTo('/FAQs')}><p>FAQs</p></div>
                    <div className={styles.navItem} onClick={() => goTo('/contact')}><p>Contact Us</p></div>
                </div>

                {/* Hamburger Menu */}
                

                {/* Profile Icon */}
                <div onClick={() => setProfileModal(!profileModal)} className={styles.profileImg}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill={colorMode === 'dark' ? 'yellow' : 'black'}>
                        <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
                    </svg>
                </div>
                <div className={`${styles.hamburger} ${styles.showOnSmall}`} onClick={() => setHamburgerOpen(!hamburgerOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill={colorMode === 'dark' ? 'yellow' : 'black'}>
                        <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
                    </svg>
                </div>
            </div>

            {/* Hamburger Menu Modal */}
            {hamburgerOpen && (
                <div className={styles.hamburgerModal}>
                    <button className={styles.closeButton} onClick={() => setHamburgerOpen(false)}>X</button>
                    <div className={styles.modalNavItem} onClick={() => goTo('/')}><p>Home</p></div>
                    <div className={styles.modalNavItem} onClick={() => goTo('/FileFIR')}><p>File FIR</p></div>
                    <div className={styles.modalNavItem} onClick={() => goTo('/UserDashboard')}><p>Dashboard</p></div>
                    <div className={styles.modalNavItem} onClick={() => goTo('/FAQs')}><p>FAQs</p></div>
                    <div className={styles.modalNavItem} onClick={() => goTo('/contact')}><p>Contact Us</p></div>
                </div>
            )}

            {/* Profile Modal */}
            {profileModal && (
                <div className={styles.pModal}>
                    {user ? (
                        <div className={styles.modalContent}>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>UserID:</strong> {user.userId}</p>
                            <div className={styles.modalItem} onClick={logout}><p>Logout</p></div>
                        </div>
                    ) : (
                        <div className={styles.modalCont}>
                            <div className={styles.modalItem} onClick={() => goTo('/register')}><p>Register</p></div>
                            <div className={styles.modalItem} onClick={() => goTo('/login')}><p>Login</p></div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default NavBar;
