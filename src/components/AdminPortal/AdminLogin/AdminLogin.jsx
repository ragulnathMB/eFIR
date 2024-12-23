import React, { useState } from 'react';
import styles from './AdminLogin.module.css';
import { useAccessibility } from '../../UserAccessibility/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthProvider/AuthProvider';

const AdminLogin = () => {
    const navigate = useNavigate();
    const goToForgotPassword = () => {
        navigate('/forgot-password');
    };
    const { textSize, colorMode } = useAccessibility();
    const {user,login}=useAuth();

    // Define styles based on the context values
    const fontSize = `${textSize}px`;

    const [adminUsername, setAdminUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdminUsernameChange = (e) => {
        setAdminUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const validate = () => {
        let validationErrors = {};

        if (!adminUsername) {
            validationErrors.adminUsername = "Admin username is required";
        }

        if (!password) {
            validationErrors.password = "Password is required";
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            try {
                
                const response = await login({ adminUsername, password });
                // Redirect to admin dashboard after successful login
                if(response==='Officer'){
                    navigate('/officer/home');
                }else{
                    navigate('/admin/home');
                }
                
            } catch (error) {
                console.error('Error during login request:', error.response?.data?.message || error.message);
                setErrors({ general: error.response?.data?.message || 'Something went wrong. Please try again.' });
            }
            setLoading(false);
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className={styles.main} style={{ backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white" }}>
            <div className={styles.formContainer} style={{ backgroundColor: (colorMode === 'dark') ? "black" : "white" }}>
                <div className={styles.header}>
                    <h2 style={{ color: (colorMode === 'dark') ? "yellow" : "black" }}>Admin Login</h2>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="adminUsername" style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Admin Username</label>
                        <input
                            type="text"
                            id="adminUsername"
                            name="adminUsername"
                            value={adminUsername}
                            onChange={handleAdminUsernameChange}
                            placeholder="Enter your username"
                            required
                            style={{ backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.adminUsername && <span className={styles.error}>{errors.adminUsername}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                            required
                            style={{ backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>

                    {message && <div className={styles.successMessage}>{message}</div>}
                    {errors.general && <div className={styles.error}>{errors.general}</div>}

                    <button type="submit" className={styles.submitButton} disabled={loading} style={{ color: (colorMode === 'dark') ? "yellow" : "white", fontSize: fontSize }}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className={styles.forgotPasswordLink}>
                    <p style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>
                        Forgot your password? <a style={{ cursor: 'pointer', fontSize: fontSize }} onClick={goToForgotPassword}>Reset Password</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
