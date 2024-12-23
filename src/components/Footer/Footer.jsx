import React from 'react';
import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate=useNavigate();
    
    const goToHome = () => {
        navigate('/');
        console.log(user);
    };

    const goToContact = () => {
        navigate('/contact');
    };
    const goToFAQs = () => {
        navigate('/FAQs');
    };
    const goToUserDashboard = () => {
        navigate('/UserDashboard');
    };
    const goToFileFIR = () => {
        navigate('/FileFIR');
    };
    const goToSignUp = () => {
        navigate('/register');
    };
    const goToLogin = () => {
        navigate('/login');
    };
    return (
        <footer className={styles.footer}>
            <div className={styles.row}>
                <div className={styles.col}>
                    <p>Your trusted partner for filing FIRs and law enforcement services. We ensure your safety with dedicated police services, 24/7.</p>
                </div>
                <div className={styles.col}>
                    <h3>Police Headquarters <div className={styles.underline}><span></span></div></h3>
                    <p>Police Department Road</p>
                    <p>City, State</p>
                    <p>PIN 12345, India</p>
                    <p className={styles.emailId}>contact@policedepartment.com</p>
                    <h4>+91 12345 67890</h4>
                </div>
                <div className={styles.col}>
                    <h3>Quick Links <div className={styles.underline}><span></span></div></h3>
                    <p><a onClick={goToHome} style={{cursor:'pointer'}}>Home</a></p>
                    <p><a onClick={goToFileFIR} style={{cursor:'pointer'}}>File FIR</a></p>
                    <p><a onClick={goToUserDashboard} style={{cursor:'pointer'}}>Dashboard</a></p>
                    <p><a onClick={goToFAQs} style={{cursor:'pointer'}}>FAQs</a></p>
                    <p><a onClick={goToContact} style={{cursor:'pointer'}}>Contact Us</a></p>
                    <p><a href="/Admin/Login" target='_blank'>Officers Portal Login</a></p>
                </div>
                <div className={styles.col}>
                    <h3>Stay Updated <div className={styles.underline}><span></span></div></h3>
                    <form action="" className={styles.form}>
                        <input type="email" placeholder="Enter your email to receive updates" required className={styles.input} />
                        <button type="submit" className={styles.button}>Subscribe</button>
                    </form>
                </div>
            </div>
            <hr className={styles.hr} />
            <p className={styles.copyright}>Police Department &copy; 2024 - All Rights Reserved </p>
        </footer>
    );
};

export default Footer;
