import React, { useEffect, useRef, useState } from "react"; // Add useState here
import styles from "./Home.module.css";
import sideImg from '../../assets/heroBg.png';
import { useAccessibility } from '../UserAccessibility/AccessibilityContext'
import { useNavigate } from 'react-router-dom';
import axios from "axios";



const Home = () => {
  const navigate = useNavigate();
  const [announcementItems,setAnnouncementItems]=useState([]);
  const [totalFir,setTotalFir]=useState(0);
  const [resolvedFir,setResolvedFir]=useState(0);
  const [pendingFir,setPendingFir]=useState(0);

  const goToUserDashboard = () => {
    navigate('/UserDashboard');
  };
  const goToFileFIR = () => {
      navigate('/FileFIR');
  };
  const goToContact = () => {
    navigate('/contact');
};
  const newsRef = useRef(null);
  const { textSize, colorMode } = useAccessibility();
      
          // Define styles based on the context values
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
      <section className={styles.heroSection} style={{backgroundColor:(colorMode==='dark')?"black":"#003366"}}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{color:(colorMode==='dark')?"yellow":"white"}}>Welcome to E-FIR Portal</h1>
          <p className={styles.heroSubtitle} style={{color:(colorMode==='dark')?"yellow":"white"}}>
            Your gateway to quick and secure online complaint registration.
          </p>
          <div className={styles.cta}>
            <button className={styles.ctaButton} style={{ backgroundColor: 'orange' }} onClick={goToFileFIR}>File Complaint</button>
            <button className={styles.ctaButton} style={{ backgroundColor: 'green' }} onClick={goToUserDashboard}>Track Status</button>
            <button className={styles.ctaButton} style={{ backgroundColor: 'red' }} onClick={goToContact}>Emergency Assistance</button>
          </div>
        </div>
        <div className={styles.heroImage}><img src={sideImg} alt="Hero" /></div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection} style={{backgroundColor:(colorMode==='dark')?"black":"white"}}>
        <h2 className={styles.sectionTitle} style={{color:(colorMode==='dark')?"yellow":"black"}}>Why Use E-FIR?</h2>
        <div className={styles.featuresGrid}>
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2} >
            <h3 style={{fontSize:fontSize}}>24/7 Availability</h3>
            <p style={{fontSize:fontSize}}>File your complaints anytime, anywhere.</p>
          </div>
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2}>
            <h3 style={{fontSize:fontSize}}>Secure Platform</h3>
            <p style={{fontSize:fontSize}}>Your data is encrypted and fully secure.</p>
          </div>
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2}>
            <h3 style={{fontSize:fontSize}}>Quick Resolution</h3>
            <p style={{fontSize:fontSize}}>Receive updates and resolutions promptly.</p>
          </div>
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2}>
            <h3 style={{fontSize:fontSize}}>User-Friendly Interface</h3>
            <p style={{fontSize:fontSize}}>Designed for ease of access and simplicity.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection} style={{backgroundColor:(colorMode==='dark')?"black":"#efecec"}}>
        <h2 className={styles.sectionTitle} style={{color:(colorMode==='dark')?"yellow":"black"}}>How It Works</h2>
        <div className={styles.stepsGrid}>
          <div className={(colorMode==='dark')?styles.stepCard2:styles.stepCard}>
            <h3 style={{fontSize:fontSize}}>1. Register</h3>
            <p style={{fontSize:fontSize}}>Sign up or log in to access the portal.</p>
          </div>
          <div className={(colorMode==='dark')?styles.stepCard2:styles.stepCard}>
            <h3 style={{fontSize:fontSize}}>2. File Complaint</h3>
            <p style={{fontSize:fontSize}}>Provide details and submit your complaint.</p>
          </div>
          <div className={(colorMode==='dark')?styles.stepCard2:styles.stepCard}>
            <h3 style={{fontSize:fontSize}}>3. Track Progress</h3>
            <p style={{fontSize:fontSize}}>Use your dashboard to monitor updates.</p>
          </div>
        </div>
      </section>
      
      {/* Real-Time Statistics Section */}
      <section className={styles.featuresSection} style={{backgroundColor:(colorMode==='dark')?"black":"white"}}>
        <h2 className={styles.sectionTitle} style={{color:(colorMode==='dark')?"yellow":"black"}}>Real-Time Statistics</h2>
        <div className={styles.featuresGrid} >
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2}>
            <h3 style={{fontSize:fontSize}} >Total FIRs</h3>
            <p style={{fontSize:fontSize}}>{totalFir}</p>
          </div>
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2}>
            <h3 style={{fontSize:fontSize}}>Resolved Complaints</h3>
            <p style={{fontSize:fontSize}}>{resolvedFir}</p>
          </div>
          <div className={(colorMode!=='dark')?styles.featureCard:styles.featureCard2}>
            <h3 style={{fontSize:fontSize}}>Pending FIRs</h3>
            <p style={{fontSize:fontSize}}>{pendingFir}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
