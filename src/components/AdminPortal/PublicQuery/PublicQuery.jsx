import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../UserAccessibility/AccessibilityContext';
import axios from 'axios';
import styles from './PublicQuery.module.css';

const PublicQuery = () => {
    const { colorMode, textSize } = useAccessibility();
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);

    useEffect(() => {
        fetchQueries();
    }, [queries]);

    const fetchQueries = async () => {
        try {
            const response = await axios.get('http://localhost:5000/queries');
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    };

    const handleDeleteQuery = async (queryId) => {
        try {
            setSelectedQuery(null);
            await axios.delete(`http://localhost:5000/queries/${queryId}`);
            fetchQueries();
            
        } catch (error) {
            console.error('Error deleting query:', error);
        }
    };

    const containerStyle = {
        backgroundColor: colorMode === 'dark' ? '#1a1a1a' : '#ffffff',
        color: colorMode === 'dark' ? '#f0e68c' : '#333333',
        fontSize: `${textSize}px`,
    };

    const cardStyle = {
        backgroundColor: colorMode === 'dark' ? '#2d2d2d' : '#ffffff',
        borderColor: colorMode === 'dark' ? '#404040' : '#ddd',
    };

    return (
        <div className={styles.container} style={containerStyle}>
            <div className={styles.header}>
                <h1>Query Management</h1>
            </div>

            <div className={styles.queryGrid}>
                {/* Queries List */}
                <div className={styles.queriesList} style={cardStyle}>
                    <h2>User Queries</h2>
                    {queries.map((query) => (
                        <div 
                            key={query._id} 
                            className={`${styles.queryCard} ${selectedQuery?._id === query._id ? styles.selected : ''}`}
                            style={cardStyle}
                            onClick={() => setSelectedQuery(query)}
                        >
                            <div className={styles.queryHeader}>
                                <h3>{query.username}</h3>
                            </div>
                            <p className={styles.queryEmail}>Email: {query.email ? query.email : 'not provided'}</p>
                            <p className={styles.queryPhone}>Contact Number: {query.phoneNumber}</p>
                            <p className={styles.querySubject}>Subject: {query.subject}</p>
                            <p className={styles.queryDate}>
                                {query.SubmitedDate}
                            </p>
                            <p className={styles.queryPreview}>{query.message.substring(0, 100)}...</p>
                        </div>
                    ))}
                </div>

                {/* Query Details */}
                {selectedQuery && (
                    <div className={styles.queryDetails} style={cardStyle}>
                        <div className={styles.detailsHeader}>
                            <h2>Query Details</h2>
                            <button 
                                onClick={() => handleDeleteQuery(selectedQuery._id)}
                                className={styles.deleteButton}
                            >
                                Delete Query
                            </button>
                        </div>
                        <div className={styles.detailsContent}>
                            <h3>{selectedQuery.username}</h3>
                            <p className={styles.queryEmail}>{selectedQuery.email}</p>
                            <p className={styles.queryPhone}>{selectedQuery.phoneNumber}</p>
                            <p className={styles.querySubject}>{selectedQuery.subject}</p>
                            <p className={styles.queryDate}>
                                Submitted: {selectedQuery.SubmitedDate}
                            </p>
                            <div className={styles.messageBox} style={cardStyle}>
                                <h4>Message:</h4>
                                <p>{selectedQuery.message}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicQuery;
