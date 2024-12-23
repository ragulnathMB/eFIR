// Announcement.jsx
import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../UserAccessibility/AccessibilityContext';
import axios from 'axios';
import styles from './Announcement.module.css';

const Announcement = () => {
    const { colorMode, textSize } = useAccessibility();
    const [announcements, setAnnouncements] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    useEffect(() => {
        fetchAnnouncements();
    }, [announcements]);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('http://localhost:5000/announcements');
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('hello')
        try {
            if (isEditing && currentAnnouncement) {
                await axios.put(`http://localhost:5000/announcements/${currentAnnouncement._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/announcements', formData);
            }
            fetchAnnouncements();
            resetForm();
        } catch (error) {
            console.error('Error saving announcement:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/announcements/${id}`);
            fetchAnnouncements();
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const handleEdit = (announcement) => {
        setIsEditing(true);
        setCurrentAnnouncement(announcement);
        setFormData({
            title: announcement.AnnouncementTitle,
            content: announcement.AnnouncementDetail
        });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentAnnouncement(null);
        setFormData({
            title: '',
            content: ''
        });
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
            {/* Form Section */}
            <div className={styles.formCard} style={cardStyle}>
                <h2 className={styles.formTitle}>
                    {isEditing ? 'Edit Announcement' : 'Add New Announcement'}
                </h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                            style={{
                                backgroundColor: colorMode === 'dark' ? '#1a1a1a' : '#ffffff',
                                color: colorMode === 'dark' ? '#f0e68c' : '#333333',
                                borderColor: colorMode === 'dark' ? '#404040' : '#ddd'
                            }}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            className={styles.textarea}
                            style={{
                                backgroundColor: colorMode === 'dark' ? '#1a1a1a' : '#ffffff',
                                color: colorMode === 'dark' ? '#f0e68c' : '#333333',
                                borderColor: colorMode === 'dark' ? '#404040' : '#ddd'
                            }}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.submitButton}>
                            {isEditing ? 'Update' : 'Add'} Announcement
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Announcements List Section */}
            <div className={styles.announcementList} style={cardStyle}>
                <h2 className={styles.listTitle}>Current Announcements</h2>
                {announcements.map((announcement) => (
                    <div key={announcement._id} className={styles.announcementCard} style={cardStyle}>
                        <div className={styles.announcementHeader}>
                            <h3 className={styles.announcementTitle}>{announcement.AnnouncementTitle}</h3>
                            <div className={styles.actionButtons}>
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className={styles.editButton}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement._id)}
                                    className={styles.deleteButton}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <p className={styles.announcementContent}>{announcement.AnnouncementDetail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Announcement;