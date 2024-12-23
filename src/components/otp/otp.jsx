import React, { useState, useEffect } from 'react';
import styles from './otp.module.css';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext';
import { useNavigate } from 'react-router-dom'; // For navigation

const OtpInput = () => {
    const { colorMode, textSize } = useAccessibility();
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60); // Timer state for countdown
    const [isResendEnabled, setIsResendEnabled] = useState(false); // Track resend link state
    const navigate = useNavigate(); // For redirection

    useEffect(() => {
        if (timer === 0) {
            setIsResendEnabled(true); // Enable resend link when timer reaches 0
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [timer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        let newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move focus to the next input
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (otp.includes('')) {
            setError('Please enter all 6 digits');
        } else {
            setError('');
            console.log('Entered OTP:', otp.join(''));
            // Here you would validate the OTP (e.g., send to backend for validation)
            const isValidOtp = validateOtp(otp.join(''));
            if (isValidOtp) {
                // Redirect to homepage on successful OTP verification
                navigate('/home');
            } else {
                setError('Invalid OTP');
            }
        }
    };

    const validateOtp = (enteredOtp) => {
        // Mock validation logic (you can replace this with actual backend validation)
        return enteredOtp === '123456'; // Example: OTP should be '123456'
    };

    const handleResend = (e) => {
        if (!isResendEnabled) {
            e.preventDefault(); // Prevent default action when link is disabled
            return;
        }

        setTimer(60); // Reset the timer to 60 seconds
        setIsResendEnabled(false); // Disable resend until the timer runs out
        console.log('Resend OTP'); // Here you would trigger OTP resend (e.g., via backend)
    };

    // Dynamic styles based on theme and text size
    const containerStyle = {
        backgroundColor: colorMode === 'dark' ? '#1e1e1e' : '#ffffff',
        color: colorMode === 'dark' ? '#f0e68c' : '#333333',
        fontSize: `${textSize}px`,
    };

    const inputStyle = {
        backgroundColor: colorMode === 'dark' ? '#333333' : '#ffffff',
        color: colorMode === 'dark' ? '#f0e68c' : '#333333',
        borderColor: colorMode === 'dark' ? '#888888' : '#cccccc',
        fontSize: `${textSize}px`,
    };

    const buttonStyle = {
        backgroundColor: colorMode === 'dark' ? '#444444' : '#007BFF',
        color: colorMode === 'dark' ? '#f0e68c' : '#ffffff',
        fontSize: `${textSize}px`,
    };

    const linkStyle = {
        color: isResendEnabled
            ? colorMode === 'dark' ? '#f0e68c' : '#007BFF'
            : '#cccccc', // Disabled link color
        fontSize: `${textSize}px`,
        pointerEvents: isResendEnabled ? 'auto' : 'none', // Disable interaction when not enabled
        cursor: isResendEnabled ? 'pointer' : 'not-allowed', // Change cursor based on state
    };

    return (
        <div className={styles.main} style={{ backgroundColor: colorMode === 'dark' ? 'gray' : 'white' }}>
            <div className={styles.container} style={containerStyle}>
                <h2>Enter OTP</h2>
                <p>Please enter the 6-digit code sent to your phone number.</p>
                <form onSubmit={handleSubmit} className={styles.otpForm}>
                    <div className={styles.otpInputs}>
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={value}
                                onChange={(e) => handleChange(e.target, index)}
                                onFocus={(e) => e.target.select()}
                                style={inputStyle}
                                className={styles.otpInput}
                            />
                        ))}
                    </div>
                    {error && <span className={styles.error}>{error}</span>}
                    <button type="submit" style={buttonStyle} className={styles.submitButton}>
                        Verify OTP
                    </button>
                </form>
                <p className={styles.resend}>
                    Didn't receive the code?{' '}
                    <a
                        href="#"
                        onClick={handleResend}
                        style={linkStyle}
                    >
                        {isResendEnabled ? 'Resend OTP' : `Resend OTP in ${timer}s`}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default OtpInput;
