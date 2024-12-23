import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const goToLogin = () => {
        navigate('/login');
    };
    const { textSize, colorMode } = useAccessibility();

    // Define styles based on the context values
    const fontSize = `${textSize}px`;

    const [phoneNumber, setPhoneNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const validate = () => {
        let validationErrors = {};

        if (!phoneNumber) {
            validationErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            validationErrors.phoneNumber = "Please enter a valid 10-digit phone number";
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            try {
                const response = await axios.post('http://localhost:5000/forgot-password', { phoneNumber });
                setMessage(response.data.message);
                setPhoneNumber('');
            } catch (error) {
                console.error('Error during password reset request:', error.response?.data?.message || error.message);
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
                    <h2 style={{ color: (colorMode === 'dark') ? "yellow" : "black" }}>Forgot Password</h2>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber" style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                            style={{ backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                    </div>

                    {message && <div className={styles.successMessage}>{message}</div>}
                    {errors.general && <div className={styles.error}>{errors.general}</div>}

                    <button type="submit" className={styles.submitButton} disabled={loading} style={{ color: (colorMode === 'dark') ? "yellow" : "white", fontSize: fontSize }}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className={styles.loginLink}>
                    <p style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>
                        Remembered your password? <a style={{cursor: 'pointer', fontSize: fontSize}} onClick={goToLogin}>Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
