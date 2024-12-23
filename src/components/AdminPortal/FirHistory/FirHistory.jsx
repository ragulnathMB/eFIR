import React, { useState, useEffect } from "react";
import styles from "./FIRHistory.module.css";
import { useAccessibility } from "../../UserAccessibility/AccessibilityContext";
import axios from "axios";
import { useAuth } from "../../AuthProvider/AuthProvider";

const FIRHistory = () => {
  const { textSize, colorMode } = useAccessibility();
  const [firHistory, setFirHistory] = useState([]);
  const [selectedFIR, setSelectedFIR] = useState(null); // Track selected FIR
  const [loading, setLoading] = useState(true);
  const fontSize = `${textSize}px`;
  const { user } = useAuth();

  const fetchFIRHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/firHistory/${user.AdminId}`
      );
      setFirHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching FIR history:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFIRHistory();
  }, []);

  const handleFIRClick = (fir) => {
    setSelectedFIR(fir); // Set the selected FIR for detailed view
  };

  const handleBackClick = () => {
    setSelectedFIR(null); // Clear the selected FIR to return to the list view
  };

  return (
    <div
      className={styles.historyContainer}
      style={{ backgroundColor: colorMode === "dark" ? "black" : "white" }}
    >
      <h1
        className={styles.pageTitle}
        style={{
          color: colorMode === "dark" ? "yellow" : "black",
          fontSize: fontSize,
        }}
      >
        FIR History
      </h1>

      {loading ? (
        <p
          className={styles.loadingText}
          style={{
            color: colorMode === "dark" ? "yellow" : "black",
            fontSize: fontSize,
          }}
        >
          Loading FIR history...
        </p>
      ) : selectedFIR ? (
        <div className={styles.firDetail}>
          <button
            onClick={handleBackClick}
            className={styles.backButton}
            style={{
              backgroundColor: colorMode === "dark" ? "yellow" : "black",
              color: colorMode === "dark" ? "black" : "white",
              fontSize: fontSize,
            }}
          >
            Back to List
          </button>
          <h2 style={{ fontSize: fontSize, color: colorMode === "dark" ? "yellow" : "black" }}>
            FIR Details
          </h2>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>FIR ID: {selectedFIR.FIR_ID}</p>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>Account Name: {selectedFIR.AccountName}</p>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>Incident Details: {selectedFIR.IncidentDetails}</p>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>Type of Complaint: {selectedFIR.TypeOfComplaint}</p>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>Status: {selectedFIR.StatusOfFir}</p>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>Date Filed: {selectedFIR.DateFiled}</p>
          <p style={{ fontSize: fontSize,color: colorMode === "dark" ? "yellow" : "black"  }}>Last Updated: {selectedFIR.LastUpdatedDate}</p>
          
          <p style={{ fontSize: fontSize }}>Comments: {selectedFIR.Comments || "N/A"}</p>
        </div>
      ) : (
        <div className={styles.firList}>
          {firHistory.length > 0 ? (
            firHistory.map((fir, index) => (
              <div
              style={{color: colorMode === "dark" ? "yellow" : "black" }}
                className={
                  colorMode !== "dark"
                    ? styles.firCard
                    : styles.firCardDark
                }
                key={index}
                onClick={() => handleFIRClick(fir)} // Click to view details
              >
                <h3 style={{ fontSize: fontSize }}>FIR #{fir.FIR_ID}</h3>
                <p style={{ fontSize: fontSize }}>Account Name: {fir.AccountName}</p>
                <p style={{ fontSize: fontSize }}>Type of Complaint: {fir.TypeOfComplaint}</p>
                <p style={{ fontSize: fontSize, }}>Incident Details: {fir.IncidentDetails}</p>
                <p style={{ fontSize: fontSize }}>Status: {fir.StatusOfFir}</p>
              </div>
            ))
          ) : (
            <p
              className={styles.noDataText}
              style={{
                color: colorMode === "dark" ? "yellow" : "black",
                fontSize: fontSize,
              }}
            >
              No FIRs found in history.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FIRHistory;
