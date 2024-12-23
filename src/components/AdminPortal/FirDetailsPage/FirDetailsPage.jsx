import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import styles from './FirDetailsPage.module.css';
import axios from 'axios';
import { useAccessibility } from '../../UserAccessibility/AccessibilityContext'; // Import Accessibility Context

const FIRDetailsPage = ({ fir, goBack }) => {
    const { colorMode, textSize } = useAccessibility(); // Get user accessibility settings
    const [log, setLog] = useState("");
    const [status, setStatus] = useState(fir.StatusOfFir);
    const [CurrentlyAssignedOfficer, setCurrentlyAssignedOfficer] = useState(
        fir.CurrentlyAssignedOfficer || 'Currently no officer has been assigned for this FIR'
      );
    const [logs, setLogs] = useState([]);
    const [assignedOfficer, setAssignedOfficer] = useState({ userID:"", username:""});

    const containerStyle = {
        backgroundColor: colorMode === 'dark' ? 'black' : '#ffffff',
        color: colorMode === 'dark' ? '#f0e68c' : '#333333',
        fontSize: `${textSize}px`,
    };

    const buttonStyle = {
        backgroundColor: colorMode === 'dark' ? '#444444' : '#063c8d',
        color: colorMode === 'dark' ? '#f0e68c' : '#ffffff',
        marginRight:'5px',
    };
    const fetchLogs = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/admin/fir/fetchlogs/${fir.FIR_ID}`);
            console.log(response);
            setLogs(response.data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };
    useEffect(() => {
        // Fetch logs when the component mounts
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/admin/fir/fetchlogs/${fir.FIR_ID}`);
                setLogs(response.data|| []);
                console.log(response);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
            setCurrentlyAssignedOfficer(fir.CurrrentlyAssignedOfficer);
        };
        
        fetchLogs();
    }, [fir.FIR_ID]);
    const handleAddLog = async () => {
        if (!log.trim()) return;
        try {
            const response = await axios.post('http://localhost:5000/admin/addlog', { firId:fir.FIR_ID,message:log }).then(console.log('i'));
            setLog("");
            await fetchLogs();
            alert('Log added successfully to FIR.');
        } catch (error) {
            console.error("Error adding log:", error);
        }
    };

    const handleChangeStatus = async () => {
        try {
            const response = await axios.put('http://localhost:5000/admin/fir/status', { firId:fir.FIR_ID,status });
            
            setStatus(status);
            alert('FIR status has been changed successfully');
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleAssignOfficer = async () => {
        if (!assignedOfficer.userID || !assignedOfficer.username) return;
        try {
            console.log(assignedOfficer);
            const response = await axios.put(`http://localhost:5000/admin/fir/assign/${fir.FIR_ID}`, assignedOfficer);
            setCurrentlyAssignedOfficer(assignedOfficer.username);
            alert(response.data.message);
        } catch (error) {
            window.alert('Officer credentials not found or server error has been occured!');
            console.error("Error assigning officer:", error);
        }
    };

    const handleDownloadFiles = () => {
        if (!fir || !fir.SupportingFiles || fir.SupportingFiles.length === 0) {
            console.error('No files to download.');
            return;
        }
    
        fir.SupportingFiles.forEach((fileID, index) => {
            // Create a dynamic link for each file
            const link = document.createElement("a");
            link.href = `http://localhost:5000/download/${fileID}`; // URL for downloading the file
            link.download = `file_${index + 1}`; // Customize the file name as needed
            document.body.appendChild(link); // Append link to the DOM
    
            // Trigger the download and remove the link from DOM after a short delay to allow browser to process
            setTimeout(() => {
                link.click(); // Trigger the download
                document.body.removeChild(link); // Clean up the link
            }, index * 500); // Adjust delay as necessary (500ms between downloads)
        });
    };
    
    
    const dateAndTime=(timestamp)=>{

        // Convert to Date object
        const date = new Date(timestamp);

        // Format the date and time
        const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long', // Day of the week (optional)
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true // 12-hour format (use false for 24-hour format)
        });
        return formattedDate
    }
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`FIR Details: #${fir.FIR_ID}`, 105, 20, { align: 'center' });

        doc.autoTable({
            head: [["Field", "Details"]],
            body: [
                ["Account Name", fir.AccountName],
                ["Account ID", fir.AccountID],
                ["Full Name", fir.FullName],
                ["Contact Number", fir.ContactNumber],
                ["Email", fir.Email || 'N/A'],
                ["Residential Address", fir.ResidentialAddress],
                ["Type of Complaint", fir.TypeOfComplaint],
                ["Incident Details", fir.IncidentDetails],
                ["Status of FIR", fir.StatusOfFir],
                ["Date Filed", fir.DateFiled],
                ["Currently Assigned Officer", fir.CurrentlyAssignedOfficer],
                ["Last Updated", fir.LastUpdatedDate],
                ["Comments", fir.Comments || 'No comments available'],
            ],
            startY: 35,
            columnStyles: {
                0: { fontStyle: 'bold' },
                1: { maxWidth: 120 }
            },
            margin: { top: 10 },
            bodyStyles: { valign: 'top' },
        });

        if (fir.SupportingFiles.length > 0) {
            const filesData = fir.SupportingFiles.map(file => [file]);

            doc.autoTable({
                head: [['Supporting Files ID']],
                body: filesData,
                startY: doc.autoTable.previous.finalY + 15,
                columnStyles: { 0: { maxWidth: 180 } },
                margin: { top: 10 },
                bodyStyles: { valign: 'top' },
            });
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Generated by eFIR Platform', 105, doc.autoTable.previous.finalY + 20, { align: 'center' });
        doc.save(`FIR_Details_${fir.FIR_ID}.pdf`);
    };

    return (
        <div className={styles.dashboard} style={containerStyle}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <p>FIR Details: #{fir.FIR_ID}</p>
                </div>
            </header>

            <section className={styles.firDetailsSection}>
                <p><strong>Account Name:</strong> {fir.AccountName}</p>
                <p><strong>Full Name:</strong> {fir.FullName}</p>
                <p><strong>Contact Number:</strong> {fir.ContactNumber}</p>
                <p><strong>Email:</strong> {fir.Email}</p>
                <p><strong>Address:</strong> {fir.ResidentialAddress}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Type of Complaint:</strong> {fir.TypeOfComplaint}</p>
                <p><strong>Date Filed:</strong> {fir.DateFiled}</p>
                <p><strong>Last Update:</strong> {fir.LastUpdatedDate}</p>
                <p><strong>Assigned Officer: </strong>{CurrentlyAssignedOfficer}</p>
                <p><strong>Comments:</strong> {fir.Comments || "No comments added."}</p>

                <button onClick={handleDownloadPDF} style={buttonStyle}>Download FIR Details PDF</button>

                {/* Added the download supporting files button */}
                {fir.SupportingFiles.length > 0 && (
                    <button onClick={handleDownloadFiles} style={buttonStyle}>Download Supporting Files</button>
                )}

                <button onClick={goBack} style={buttonStyle}>Back</button>
            </section>
            <section className={styles.logsSection}>
                <h3 style={{
                    textAlign: 'center',
                    color: colorMode === 'dark' ? '#f0e68c' : '#063c8d',
                    marginBottom: '20px',
                }}>
                    Logs
                </h3>
                {logs.length > 0 ? (
                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '10px',
                        backgroundColor: colorMode === 'dark' ? '#222831' : '#f1f1f1',
                        border: `2px solid ${colorMode === 'dark' ? '#393e46' : '#dcdcdc'}`,
                        borderRadius: '8px',
                        boxShadow: colorMode === 'dark' ? '0px 4px 6px rgba(0, 0, 0, 0.6)' : '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {logs.map((log, index) => (
                                <li key={index} style={{
                                    marginBottom: '15px',
                                    padding: '15px',
                                    backgroundColor: colorMode === 'dark' ? '#393e46' : '#ffffff',
                                    borderRadius: '8px',
                                    borderLeft: `4px solid ${colorMode === 'dark' ? '#f0e68c' : '#063c8d'}`,
                                    boxShadow: colorMode === 'dark' ? '0px 3px 4px rgba(0, 0, 0, 0.4)' : '0px 3px 4px rgba(0, 0, 0, 0.1)',
                                }}>
                                    <p style={{
                                        margin: '0 0 5px',
                                        fontWeight: 'bold',
                                        color: colorMode === 'dark' ? '#f0e68c' : '#063c8d',
                                    }}>
                                        {dateAndTime(log.timestamp)}
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        color: colorMode === 'dark' ? '#eeeeee' : '#333333',
                                    }}>
                                        {log.message}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p style={{
                        textAlign: 'center',
                        color: colorMode === 'dark' ? '#f0e68c' : '#666666',
                        backgroundColor: colorMode === 'dark' ? '#333333' : '#f9f9f9',
                        padding: '10px',
                        borderRadius: '8px',
                    }}>
                        No logs available.
                    </p>
                )}
            </section>


            <section className={styles.actionsSection}>
                <h3>Actions</h3>
                <textarea
                    value={log}
                    onChange={(e) => setLog(e.target.value)}
                    placeholder="Add a log entry..."
                    style={{ fontSize: `${textSize}px` }}
                ></textarea>
                <button onClick={handleAddLog} style={buttonStyle}>Add Log</button>

                <div>
                    <label>Status:</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{
                            fontSize: `${textSize}px`,
                            color: colorMode === 'dark' ? '#f0e68c' : '#000000', // Make text black in light mode
                        }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <button onClick={handleChangeStatus} style={buttonStyle}>Update Status</button>
                </div>

                <div>
                    <label>Assign Officer:</label>
                    <input
                        type="text"
                        value={assignedOfficer.username}
                        onChange={(e) => setAssignedOfficer({ ...assignedOfficer, username: e.target.value })}
                        placeholder="Officer Username"
                        style={{ fontSize: `${textSize}px`,backgroundColor:'transparent',color:(colorMode==='dark')?'yellow':'black' ,marginRight:'20px',padding:'5px',borderRadius:'5px',border:'2px solid gray'}}
                    />
                    <input
                        type="text"
                        value={assignedOfficer.userID}
                        onChange={(e) => setAssignedOfficer({ ...assignedOfficer, userID: e.target.value })}
                        placeholder="Officer ID"
                        style={{ fontSize: `${textSize}px` ,backgroundColor:'transparent',color:(colorMode==='dark')?'yellow':'black',marginRight:'20px',padding:'5px',borderRadius:'5px',border:'2px solid gray'}}
                    />
                    <button onClick={handleAssignOfficer} style={buttonStyle}>Assign Officer</button>
                </div>
            </section>
        </div>
    );
};

export default FIRDetailsPage;
