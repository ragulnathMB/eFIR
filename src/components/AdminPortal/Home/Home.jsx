import React, { useEffect, useRef, useState } from "react"; 
import styles from "./Home.module.css";
import sideImg from '../../../assets/heroBg.png';
import { useAccessibility } from '../../UserAccessibility/AccessibilityContext'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../AuthProvider/AuthProvider";
import axios from 'axios'

const AdminHome = () => {
  const navigate = useNavigate();
  const [announcementItems,setAnnouncementItems]=useState([]);
  const {user}=useAuth();
  const [totalFir,setTotalFir]=useState(0);
  const [resolvedFir,setResolvedFir]=useState(0);
  const [pendingFir,setPendingFir]=useState(0);
  

  const goToManageFIRs = () => {
    navigate('/admin/dashboard');
  };
  const goToDashboard = () => {
    navigate('/admin/dashboard');
  };
  const goToNotifications = () => {
    navigate('/admin/dashboard');
  };

  const newsRef = useRef(null);
  const { textSize, colorMode } = useAccessibility();
  
  const fontSize = `${textSize}px`;
  const fetchStatisticsCount= async ()=>{
    try {
      const response = await axios.get('http://localhost:5000/firCounts');
      const {totalFIRs,pendingFIRs,resolvedFIRs}=response.data;
      console.log(response);
      setTotalFir(totalFIRs);
      setPendingFir(pendingFIRs);
      setResolvedFir(resolvedFIRs);
    } catch (error) {
      console.log('Error fetching statistics data:',error);
    }
  }

  
  useEffect(() => {
    const news = newsRef.current;
    fetchAnnouncements();
    fetchStatisticsCount();
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

  const [statistics, setStatistics] = useState({
    totalFIRs: 0,
    resolvedFIRs: 0,
    assignedOfficers: 0,
  });

  // Simulating fetching real-time statistics data
  useEffect(() => {
    setTimeout(() => {
      setStatistics({
        totalFIRs: 350,
        resolvedFIRs: 280,
        assignedOfficers: 25,
      });
    }, 1000);
  }, []);

  return (
    <div className={styles.homeContainer}>
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
      <section className={styles.heroSection} style={{ backgroundColor: (colorMode === 'dark') ? "black" : "#003366" }}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{ color: (colorMode === 'dark') ? "yellow" : "white" }}>Jurisdiction Admin Portal</h1>
          <p className={styles.heroSubtitle} style={{ color: (colorMode === 'dark') ? "yellow" : "white" }}>
            Efficiently manage FIRs, assign officers, and monitor progress.
          </p>
          <div className={styles.cta}>
            <button className={styles.ctaButton} style={{ backgroundColor: 'orange' }} onClick={goToManageFIRs}>Manage FIRs</button>
            <button className={styles.ctaButton} style={{ backgroundColor: 'green' }} onClick={goToDashboard}>View Dashboard</button>
            <button className={styles.ctaButton} style={{ backgroundColor: 'red' }} onClick={goToNotifications}>View Notifications</button>
          </div>
        </div>
        <div className={styles.heroImage}><img src={sideImg} alt="Hero" /></div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} style={{ backgroundColor: (colorMode === 'dark') ? "black" : "white" }}>
        <h2 className={styles.sectionTitle} style={{ color: (colorMode === 'dark') ? "yellow" : "black" }}>Admin Features</h2>
        <div className={styles.featuresGrid}>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>Assign FIRs</h3>
            <p style={{ fontSize: fontSize }}>Assign FIRs to the appropriate police officers within your jurisdiction.</p>
          </div>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>Track FIR Status</h3>
            <p style={{ fontSize: fontSize }}>Monitor the progress of FIRs and update their status as needed.</p>
          </div>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>View Notifications</h3>
            <p style={{ fontSize: fontSize }}>Keep track of notifications regarding FIR assignments and status updates.</p>
          </div>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>Manage Jurisdiction</h3>
            <p style={{ fontSize: fontSize }}>Update and manage jurisdiction areas to ensure accurate FIR assignments.</p>
          </div>
        </div>
      </section>

      {/* Real-Time Statistics Section */}
      <section className={styles.featuresSection} style={{ backgroundColor: (colorMode === 'dark') ? "black" : "white" }}>
        <h2 className={styles.sectionTitle} style={{ color: (colorMode === 'dark') ? "yellow" : "black" }}>Admin Dashboard Statistics</h2>
        <div className={styles.featuresGrid}>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>Total FIRs</h3>
            <p style={{ fontSize: fontSize }}>{totalFir}</p>
          </div>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>Resolved FIRs</h3>
            <p style={{ fontSize: fontSize }}>{resolvedFir}</p>
          </div>
          <div className={colorMode !== 'dark' ? styles.featureCard : styles.featureCard2}>
            <h3 style={{ fontSize: fontSize }}>Pending FIRs</h3>
            <p style={{ fontSize: fontSize }}>{pendingFir}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
