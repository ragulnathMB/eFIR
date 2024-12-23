import React, { useState } from 'react';
import styles from './FIRFilingPage.module.css';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import cities from '../../assets/cities.json'
import { useAuth } from '../AuthProvider/AuthProvider';

const FIRFilingPage = () => {
    const fileInputRef = React.useRef(null);
    const { colorMode, textSize } = useAccessibility();
    const {user}=useAuth();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        address: '',
        incidentDetails: '',
        selectedJurisdictionArea:'',
        complaintType: '',
        files: [],
    });
    const [previewFiles, setPreviewFiles] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file uploads
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0); // Calculate total file size
    
        // Check if the total size exceeds 50 MB (50 MB = 50 * 1024 * 1024 bytes)
        if (totalSize > 50 * 1024 * 1024) {
            alert('Total file size should be less than 50 MB.');
            return;
        }
    
        setFormData({ ...formData, files });
    
        const previews = files.map((file) => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return null;
        });
        setPreviewFiles(previews);
    };
    // Validate form fields
    const validate = () => {
        let validationErrors = {};
        if (!formData.name) {
            validationErrors.name = 'Name is required';
        }
        if (!formData.contact) {
            validationErrors.contact = 'Contact number is required';
        } else if (!/^\d{10}$/.test(formData.contact)) {
            validationErrors.contact = 'Contact number must be 10 digits';
        }
        if (!formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            validationErrors.email = 'Invalid email address';
        }
        if (!formData.incidentDetails) {
            validationErrors.incidentDetails = 'Incident details are required';
        }
        if (!formData.address) {
            validationErrors.address = 'address details are required';
        }
        if (!formData.complaintType) {
            validationErrors.complaintType = 'Complaint type is required';
        }
        return validationErrors;
    };
    const [Loading,setLoading]=useState(false);

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('FullName', formData.name);
            formDataToSend.append('ContactNumber', formData.contact);
            formDataToSend.append('Email', formData.email);
            formDataToSend.append('ResidentialAddress', formData.address);
            formDataToSend.append('IncidentDetails', formData.incidentDetails);
            formDataToSend.append('TypeOfComplaint', formData.complaintType);
            formDataToSend.append('JurisdictionArea',formData.selectedJurisdictionArea)
            formDataToSend.append('AccountName', user.username);
            formDataToSend.append('AccountID',user.userId);
            formDataToSend.append('Comments',"");
            formDataToSend.append('StatusOfFir','Pending');
            formDataToSend.append('DateFiled',new Date().toLocaleString());
            formDataToSend.append('LastUpdatedDate',new Date().toLocaleString())
            formData.files.forEach((file) => {
                formDataToSend.append('files', file);
            });
            console.log(formDataToSend);
            setLoading(true);

            const response = await axios.post('http://localhost:5000/uploadFIR', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);

            setSuccessMessage(response.data.message || 'FIR filed successfully');
            window.alert("FIR filed successfully.");
            setFormData({
                name: '',
                contact: '',
                email: '',
                address: '',
                incidentDetails: '',
                complaintType: '',
                selectedJurisdictionArea:'',
                files: [],
            });
            setPreviewFiles([]);
            fileInputRef.current.value = ''; 
        } catch (error) {
            console.error('Error filing FIR:', error.response?.data || error.message);
            setErrors({ general: error.response?.data?.message || 'An error occurred' });
        }
    };
    const [searchQuery, setSearchQuery] = useState('');

    // Dynamic styles based on accessibility settings
    const containerStyle = {
        backgroundColor: colorMode === 'dark' ? 'black' : '#ffffff',
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
        backgroundColor: colorMode === 'dark' ? '#444444' : '#003366',
        color: colorMode === 'dark' ? '#f0e68c' : '#ffffff',
        fontSize: `${textSize}px`,
    };
    const [selectedCity, setSelectedCity] = useState(null);

    
    // Filter cities based on the search query
    const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle input change
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };
    const [isListOpen, setIsListOpen] = useState(false); 
    // Handle city selection
    const handleCitySelect = (city) => {
        setSelectedCity(city);
        formData.selectedJurisdictionArea=city.name;
        console.log(formData.selectedJurisdictionArea);
        setSearchQuery(city.name); // Update the input to show selected city
        setIsListOpen(false);
    };
    
    const handleSearchClick = () => {
        setIsListOpen(true); // Open the list when search input is clicked
    };


    return (
        <div className={styles.main} style={{ backgroundColor: colorMode === 'dark' ? 'gray' : 'white' }}>
            <div className={styles.container} style={containerStyle}>
                <h2>FIR Filing Form</h2>
                <p>Fill in the details below to file your complaint. You can also upload supporting documents.</p>
                <form onSubmit={handleSubmit} className={styles.firForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={inputStyle}
                            required
                        />
                        {errors.username && <span className={styles.error}>{errors.username}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="contact">Contact Number</label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="Enter your contact number"
                            style={inputStyle}
                            required
                        />
                        {errors.contact && <span className={styles.error}>{errors.contact}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            style={inputStyle}
                        />
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="address">Residential Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your residential address"
                            style={inputStyle}
                        />
                        {errors.address && <span className={styles.error}>{errors.address}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="incidentDetails">Incident Details</label>
                        <textarea
                            id="incidentDetails"
                            name="incidentDetails"
                            value={formData.incidentDetails}
                            onChange={handleChange}
                            placeholder="Describe the incident in detail"
                            style={inputStyle}
                            required
                        />
                        {errors.incidentDetails && <span className={styles.error}>{errors.incidentDetails}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                    <label htmlFor="city">Select the jurisdiction which should handle your case</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onClick={handleSearchClick}
                            style={{backgroundColor:(colorMode==='dark')?"black":"white",color:(colorMode==='dark')?"yellow":"black"}}
                            placeholder="Search for a jurisdiction"
                            required
                        />

                            {isListOpen && (
                                            <ul style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'scroll' }}>
                                                {filteredCities.length > 0 ? (
                                                    filteredCities.map((city) => (
                                                        <li
                                                            key={city.id}
                                                            onClick={() => handleCitySelect(city)}
                                                            style={{ padding: '8px', cursor: 'pointer' }}
                                                        >
                                                            {city.name}, {city.state}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p>No jurisdiction found</p>
                                                )}
                                            </ul>
                                        )}

                        {selectedCity && (
                            <p>Selected Jurisdiction: {selectedCity.name}, {selectedCity.state}</p>
                        )}
    
                    </div>

                    {/* New Dropdown for Complaint Type */}
                    <div className={styles.inputGroup}>
                    {errors.complaintType && <span className={styles.error}>{errors.complaintType}</span>}
                        <label htmlFor="complaintType">Type of Complaint</label>
                        <select
                            id="complaintType"
                            name="complaintType"
                            value={formData.complaintType}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">Select Complaint Type</option>
                            <option value="Theft">Theft</option>
                            <option value="Fraud">Fraud</option>
                            <option value="Assault">Assault</option>
                            <option value="cybercrime">Cybercrime</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="files">Upload Supporting Files (*Total size should not exeed 50 MB)</label>
                        <input
                            type="file"
                            id="files"
                            name="files"
                            accept=".jpg,.png,.pdf,.docx,.mp4"
                            multiple
                            onChange={handleFileUpload}
                            style={inputStyle}
                            ref={fileInputRef} 
                        />
                    </div>
                    {previewFiles.length > 0 && (
                        <div className={styles.previewSection}>
                            <h3>File Previews:</h3>
                            <div className={styles.previews}>
                                {previewFiles.map((preview, index) => (
                                    preview ? (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className={styles.previewImage}
                                        />
                                    ) : (
                                        <div key={index} className={styles.filePlaceholder}>
                                            File uploaded
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Loading animation */}
                    {Loading && (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>Submitting your FIR...</p>
                        </div>
                    )}
                    <button type="submit" style={buttonStyle} className={styles.submitButton}>
                        Submit FIR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FIRFilingPage;
