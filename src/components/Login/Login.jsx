import React, { useState } from 'react';
import styles from './Login.module.css';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useAuth } from '../AuthProvider/AuthProvider';


const Login = ({onLogin}) => {
    const navigate=useNavigate();
    const {userlogin}=useAuth();
    const goToSignUp = () => {
        navigate('/register');
    };
    const gotoForgotPass = () => {
        navigate('/ForgotPass');
    };
    const { textSize, colorMode } = useAccessibility();

    // Define styles based on the context values
    const fontSize = `${textSize}px`;

    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let validationErrors = {};

        if (!formData.usernameOrEmail) {
            validationErrors.usernameOrEmail = "Username or Email is required";
        }
        if (!formData.password) {
            validationErrors.password = "Password is required";
        }

        return validationErrors;
    };

    const handleSubmit =async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response=await userlogin({
                    usernameOrEmail: formData.usernameOrEmail,
                    password: formData.password,
                })

                setFormData({
                    usernameOrEmail: '',
                    password: '',
                });
                const from = location.state?.from?.pathname || "/";
                console.log(response);
                if(response==='user'){
                    navigate(from, { replace: true });
                }else{
                    navigate('/unauthorized');
                }
                    
            } catch (error) {
                console.error('Error during Login:', error.response?.data?.message || error.message);
                // Check for specific error messages from backend
                if (error.response?.data?.message) {
                    setErrors({ general: error.response.data.message });
                } else {
                    setErrors(validationErrors);
                }
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className={styles.main} style={{ backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white" }}>
            <div className={styles.formContainer} style={{ backgroundColor: (colorMode === 'dark') ? "black" : "white" }}>
                <div className={styles.header}>
                    <h2 style={{ color: (colorMode === 'dark') ? "yellow" : "black" }}>Login</h2>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="usernameOrEmail" style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Username or Email</label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            placeholder="Enter your username or email"
                            required
                            style={{backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.usernameOrEmail && <span className={styles.error}>{errors.usernameOrEmail}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            style={{backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>

                    <button type="submit" className={styles.submitButton} style={{ color: (colorMode === 'dark') ? "yellow" : "white", fontSize: fontSize }}>Login</button>
                </form>

                <div className={styles.signupLink}>
                    <p style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Don't have an account? <a style={{cursor:'pointer',fontSize: fontSize }} onClick={goToSignUp}>Sign up</a></p>
                    <p style={{ color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}>Forgot your password? <a onClick={gotoForgotPass} style={{ fontSize: fontSize }}>Click here</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
