import React, { useEffect, useState } from 'react';
import styles from './Signup.module.css';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext'
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { useAuth } from '../AuthProvider/AuthProvider';

const SignUp = () => {

    
    const navigate = useNavigate();
    const location = useLocation();
    const {user, register}=useAuth()
    const goToLogin = () => {
        navigate('/login');
    };
    const { textSize, colorMode } = useAccessibility();

    // Define styles based on the context values
    const fontSize = `${textSize}px`;

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
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
        
        if (!formData.username) {
            validationErrors.username = "Username is required";
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = "Email is invalid";
        }
        if (!formData.password) {
            validationErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            validationErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.phoneNumber) {
            validationErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            validationErrors.phoneNumber = "Phone number must be 10 digits";
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                });
                
        
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phoneNumber: '',
                });
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
                    
            } catch (error) {
                console.error('Error during signup:', error.response?.data?.message || error.message);
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
        <div className={styles.main} style={{backgroundColor:(colorMode==='dark')?"rgb(44, 43, 43)":"white"}}>
            <div className={styles.formContainer} style={{backgroundColor:(colorMode==='dark')?"black":"white"}}>
                <div className={styles.header}>
                    <h2 style={{color:(colorMode==='dark')?"yellow":"black"}}>Register</h2>
                </div>
                {errors.general && <span className={styles.error}>{errors.general}</span>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" style={{color:(colorMode==='dark')?"yellow":"black",fontSize:fontSize}}>Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                            style={{backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.username && <span className={styles.error}>{errors.username}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" style={{color:(colorMode==='dark')?"yellow":"black",fontSize:fontSize}}>Email (Optional)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={{backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" style={{color:(colorMode==='dark')?"yellow":"black",fontSize:fontSize}}>Password</label>
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

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" style={{color:(colorMode==='dark')?"yellow":"black",fontSize:fontSize}}>Retype the password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Retype your password"
                            required
                            style={{backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="phoneNumber" style={{color:(colorMode==='dark')?"yellow":"black",fontSize:fontSize}}>Phone number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                            style={{backgroundColor: (colorMode === 'dark') ? "rgb(44, 43, 43)" : "white", color: (colorMode === 'dark') ? "yellow" : "black", fontSize: fontSize }}
                        />
                        {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                    </div>

                    <button type="submit" className={styles.submitButton} style={{color:(colorMode==='dark')?"yellow":"white",fontSize:fontSize}}>Register</button>
                    

                </form>

                <div className={styles.loginLink}>
                    <p style={{color:(colorMode==='dark')?"yellow":"black",fontSize:fontSize}}>Already have an account? <a style={{cursor:'pointer',fontSize:fontSize}} onClick={goToLogin} >Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
