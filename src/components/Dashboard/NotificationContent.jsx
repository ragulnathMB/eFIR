import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext';
import { useAuth } from '../AuthProvider/AuthProvider';
import { format } from 'date-fns';
import styles from './NotificationContent.module.css';

const NotificationContent = () => {
    const { colorMode, textSize } = useAccessibility();
    const [notifications, setNotifications] = useState([]);
    
    const { user } = useAuth(); // Assuming user info is needed for additional context

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/notifications/${user.userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [user.userId]);

    const containerStyle = {
        backgroundColor: colorMode === 'dark' ? '#333' : '#fff',
        color: colorMode === 'dark' ? '#f0e68c' : '#333',
        fontSize: `${textSize}px`,
    };

    return (
        <div className={styles.notificationContainer} style={containerStyle}>
            <h3>Your Notifications</h3>
            <ul>
                {notifications.length > 0 ? (
                    notifications.map((notification,index) => (
                        <li key={index} className={styles.notificationItem}>
                             <small>{format(new Date(notification.timestamp), 'MMM dd, yyyy HH:mm')}</small>
                            <p><strong>{notification.message}</strong></p>
                            <p><small>{notification.date}</small></p>
                        </li>
                    ))
                ) : (
                    <p>No notifications available.</p>
                )}
            </ul>
        </div>
    );
};

export default NotificationContent;
