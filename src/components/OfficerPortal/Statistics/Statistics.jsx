import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Statistics.module.css";
import { useAuth } from "../../AuthProvider/AuthProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user}=useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/admin/statistics/${user.AdminId}`);
        const data = await response.json();
  
        setBarData({
          labels: Object.keys(data.complaintData),
          datasets: [
            {
              label: "Number of Complaints",
              data: Object.values(data.complaintData),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              borderWidth: 1,
            },
          ],
        });
  
        setLineData({
          labels: Object.keys(data.yearData),
          datasets: [
            {
              label: "FIRs Registered",
              data: Object.values(data.yearData),
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
            },
          ],
        });
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
  
    fetchData();
  }, []);
  

  if (loading) {
    return <div className={styles.loading}>Loading Statistics...</div>;
  }

  return (
    <div className={styles.statisticsContainer}>
      <h2 className={styles.title}>Statistics Dashboard</h2>

      <div className={styles.chartsWrapper}>
        {/* Bar Graph */}
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Complaints by Type</h3>
          {barData && (
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Number of Complaints by Type" },
                },
              }}
            />
          )}
        </div>

        {/* Line Graph */}
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Year-wise FIR Registrations</h3>
          {lineData && (
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Year-wise FIR Registrations",
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
