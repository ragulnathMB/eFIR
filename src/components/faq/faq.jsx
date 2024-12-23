import React, { useState } from 'react';
import styles from './faq.module.css';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext'

const FAQs = () => {
    const { textSize, colorMode } = useAccessibility();
    
        // Define styles based on the context values
    const fontSize = `${textSize}px`;
    const faqData = [
        {
            question: "What is FIR, and how do I file it?",
            answer: "FIR stands for First Information Report. It is the initial step to register a complaint with the police. You can file it by visiting the nearest police station or through our online portal.",
        },
        {
            question: "How can I track the status of my case?",
            answer: "You can track the status of your case through the 'Dashboard' section on our website by entering your case ID.",
        },
        {
            question: "What documents are required to file a complaint?",
            answer: "Basic identification documents such as an Aadhaar card or passport are usually required. Additional documents may depend on the type of complaint.",
        },
        {
            question: "Is filing a complaint online secure?",
            answer: "Yes, our platform uses state-of-the-art encryption to ensure that your data is secure and protected.",
        },
        {
            question: "Can I remain anonymous while filing a complaint?",
            answer: "Yes, we offer the option to file complaints anonymously. However, certain cases may require your details for follow-up.",
        },
        {
            question: "How do I contact technical support?",
            answer: "You can reach out to our technical support team via email at techsupport@police.gov.in or call us at +91-9876543210.",
        },
        {
            question: "What is the time frame for case resolution?",
            answer: "The resolution time frame depends on the nature and complexity of the case. You will be updated regularly through your registered contact details.",
        },
        {
            question: "What should I do if I am being harassed online?",
            answer: "Report the harassment immediately through the 'Cyber Complaints' section. Provide all relevant details for quicker resolution.",
        },
        {
            question: "Can I update or withdraw my complaint after filing?",
            answer: "Yes, you can update or withdraw your complaint through the 'Dashboard' section, provided the case is not under active investigation.",
        },
        {
            question: "What are the working hours of the police station?",
            answer: "Police stations are operational 24/7. However, administrative work is usually handled during standard working hours.",
        },
        {
            question: "What should I do if I lose my ID documents?",
            answer: "You should file a complaint for lost documents at the nearest police station or through our online portal to avoid misuse.",
        },
        {
            question: "How do I report a missing person?",
            answer: "Visit the nearest police station with all the necessary details such as a recent photograph, physical description, and last known location of the person.",
        },
        {
            question: "What should I do if I witness a crime?",
            answer: "Immediately report the crime to the nearest police station or dial the emergency helpline number. Your identity will be kept confidential if requested.",
        },
        {
            question: "How do I report a stolen vehicle?",
            answer: "File a complaint at the nearest police station with details like the vehicle's registration number, make, model, and a copy of the RC book.",
        },
        {
            question: "Can I register a complaint if I am outside my home city?",
            answer: "Yes, complaints can be filed online or at any police station, irrespective of your location.",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className={styles.faqContainer} style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}>
            <h1 className={styles.header} style={{color:(colorMode==='dark')?"yellow":"#003366"}}>Frequently Asked Questions (FAQs)</h1>
            <div className={styles.faqList}>
                {faqData.map((faq, index) => (
                    <div key={index} className={styles.faqItem} style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}>
                        <div
                            className={styles.question}
                            onClick={() => toggleAnswer(index)}
                        >
                            <span style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366"}}>{faq.question}</span>
                            <span className={styles.toggleIcon}>
                                {activeIndex === index ? "-" : "+"}
                            </span>
                        </div>
                        {activeIndex === index && (
                            <div className={styles.answer} style={{fontSize:fontSize,color:(colorMode==='dark')?"yellow":"#003366",backgroundColor:(colorMode==='dark')?'black':'white'}}>
                                <p >{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <p style={{marginTop:'40px'}}>
                For more information or assistance, please visit our{' '}
                <a href="/contact" className={styles.contactLink}>
                    Contact Us
                </a>{' '}
                page, where you can find additional resources and support.
            </p>
        </div>
    );
};

export default FAQs;
