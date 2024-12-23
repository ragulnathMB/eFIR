import React, { useEffect, useRef, useState } from "react";
import styles from "./Home.module.css";
import officerImg from '../../../assets/heroBg.png';
import { useAccessibility } from '../../UserAccessibility/AccessibilityContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../AuthProvider/AuthProvider";
import axios from "axios";


const OfficerHome = () => {
  const navigate = useNavigate();

  const goToFIRs = () => {
    navigate('/officer/dashboard');
  };
  const [announcementItems,setAnnouncementItems]=useState([]);
  const {user}=useAuth();

  

  const newsRef = useRef(null);
  const { textSize, colorMode } = useAccessibility();
  const fontSize = `${textSize}px`;

  useEffect(() => {
    const news = newsRef.current;
    const slideInterval = setInterval(() => {
      if (news) {
        news.scrollBy(1, 0);
        if (news.scrollLeft + news.clientWidth >= news.scrollWidth) {
          news.scrollTo(0, 0);
        }
      }
    }, 90);

    return () => clearInterval(slideInterval);
  }, []);
  useEffect(() => {
    const news = newsRef.current;
    fetchAnnouncements();
    const slideInterval = setInterval(() => {
      if (news) {
        news.scrollBy(1, 0);
        if (news.scrollLeft + news.clientWidth >= news.scrollWidth) {
          news.scrollTo(0, 0); // Reset scroll when reaching the end
        }
      }
    }, 1); // Adjust the interval for the speed of the slide

    return () => clearInterval(slideInterval); // Clean up interval on unmount
  }, []);

  const fetchAnnouncements = async () => {
      try {
          const response = await axios.get('http://localhost:5000/announcements');
          setAnnouncementItems(response.data);
          console.log(response.data)
      } catch (error) {
          console.error('Error fetching announcements:', error);
      }
  };


  return (
    <div className={styles.homeContainer}>
      {/* Announcement Section */}
      <section
            className={styles.announcementSection}
            style={{ backgroundColor: colorMode === "dark" ? "black" : "#ffcc00" }}
          >
            <div className={styles.newsTicker} ref={newsRef}>
              {announcementItems.map((item, index) => (
                <div className={styles.newsItemCont} key={index}>
                  <p
                    className={styles.newsItem}
                    style={{
                      color: colorMode === "dark" ? "yellow" : "black",
                      fontSize: fontSize,
                    }}
                  >
                    {item.AnnouncementDetail}
                  </p>
                </div>
              ))}
            </div>
          </section>
      

      {/* Hero Section */}
      <section
        className={styles.heroSection}
        style={{ backgroundColor: colorMode === "dark" ? "black" : "#003366" }}
      >
        <div className={styles.heroContent}>
          <h1
            className={styles.heroTitle}
            style={{ color: colorMode === "dark" ? "yellow" : "white" }}
          >
            Welcome to the Police Officers Portal
          </h1>
          <p
            className={styles.heroSubtitle}
            style={{ color: colorMode === "dark" ? "yellow" : "white" }}
          >
            View your assigned FIRs, update their status, and stay notified.
          </p>
          <div className={styles.cta}>
            <button
              className={styles.ctaButton}
              style={{ backgroundColor: "red" }}
              onClick={goToFIRs}
            >
              Assigned FIRs
            </button>
            <button
              className={styles.ctaButton}
              style={{ backgroundColor: "orange" }}
              onClick={goToFIRs}
            >
              Statistics
            </button>
            <button
              className={styles.ctaButton}
              style={{ backgroundColor: "green" }}
              onClick={goToFIRs}
            >
              Notifications
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={officerImg} alt="Officer Hero" />
        </div>
      </section>

      {/* Features Section */}
      <section
        className={styles.featuresSection}
        style={{ backgroundColor: colorMode === "dark" ? "black" : "white" }}
      >
        <h2
          className={styles.sectionTitle}
          style={{ color: colorMode === "dark" ? "yellow" : "black" }}
        >
          Portal Features
        </h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3 style={{ fontSize: fontSize }}>Assigned FIRs</h3>
            <p style={{ fontSize: fontSize }}>
              Access and manage the FIRs assigned to you.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 style={{ fontSize: fontSize }}>Status Updates</h3>
            <p style={{ fontSize: fontSize }}>
              Update the status of assigned FIRs efficiently.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 style={{ fontSize: fontSize }}>Notifications</h3>
            <p style={{ fontSize: fontSize }}>
              Stay updated with the latest case developments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OfficerHome;
