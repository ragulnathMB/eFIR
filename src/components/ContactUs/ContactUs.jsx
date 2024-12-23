import React, { useState } from 'react';
import styles from './ContactUs.module.css'; // Importing module.css
import { useAccessibility } from '../UserAccessibility/AccessibilityContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ContactUs = () => {
    const navigate=useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        phoneNumber:'',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const validate = () => {
        let validationErrors = {};
        
        if (!formData.name) {
            validationErrors.username = "Username is required";
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
                const response = await axios.post('http://localhost:5000/contactUsMessage', {
                    username: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    subject:formData.subject,
                    message: formData.message,
                });
                const { message} = response.data;
                window.alert(message); // Handle success message
                
        
                setFormData({
                    name: '',
                    email: '',
                    subject:'',
                    message: '',
                    phoneNumber: '',
                });
                navigate('/', {});
                    
            } catch (error) {
                console.error('Error during sending message:', error.response?.data?.message || error.message);
                
            }
        } else {
            setErrors(validationErrors);
        }
    };

    
    
    const { textSize, colorMode } = useAccessibility();

    // Define styles based on the context values
    const fontSize = `${textSize}px`;

    return (
        <div className={styles.contactUsContainer} style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}>
            <h1 className={styles.header} style={{color:(colorMode==='dark')?"yellow":"#003366"}}>Contact Us</h1>

            <div className={styles.contactSection}>
                <div className={styles.generalContact}>
                    <h2>General Inquiries</h2>
                    <p>If you have any questions or concerns related to the FIR filing process, feel free to contact us.</p>
                    <div className={styles.contactInfo}>
                        <p><strong>Office Address:</strong> sample address Road, state, India</p>
                        <p><strong>Email:</strong> <a href="mailto:support@policedepartment.in" style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366"}}>support@policedepartment.in</a></p>
                        <p><strong>Phone:</strong> +91 123 456 7890</p>
                    </div>
                </div>

                <div className={styles.technicalSupport}>
                    <h2>Technical Support</h2>
                    <p>If you are facing any issues with the FIR Filing system, please reach out to our technical support team.</p>
                    <div className={styles.contactInfo}>
                        <p><strong>Email:</strong> <a href="mailto:techsupport@policedepartment.in" style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366"}}>techsupport@policedepartment.in</a></p>
                        <p><strong>Phone:</strong> +91 987 654 3210</p>
                    </div>
                </div>
            </div>

            <div className={styles.contactForm} style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}>
                <h2>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                {errors.username && <span className={styles.error}>{errors.username}</span>}
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email(Optional)"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}
                    />
                    {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        style={{ fontSize: fontSize, color: (colorMode === 'dark') ? "yellow" : "#003366", backgroundColor: (colorMode === 'dark') ? 'black' : 'white' }}
                    />
                    
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className={styles.textarea}
                        style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}
                    />
                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>

            <div className={styles.socialMedia}>
                <h2>Follow Us</h2>
                <p>Stay connected with us through our social media channels:</p>
                <div className={styles.socialIcons}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Facebook</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Twitter</a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
