import React, { useEffect, useState } from 'react';
import styles from './AnalyticsContent.module.css';
import axios from 'axios';

function AnalyticsContent() {
    const [data, setData] = useState({
        "Backlog Tasks": 0,
        "To-do Tasks": 0,
        "In-Progress Tasks": 0,
        "Completed Tasks": 0,
        "Low Priority": 0,
        "Moderate Priority": 0,
        "High Priority": 0,
        "Due Date Tasks": 0
    });

    useEffect(() => {
        const handleGetAnalytics = async () => {
            try {
                const email = JSON.parse(localStorage.getItem('userDetails')).email;
                const response = await axios.get(`http://localhost:5000/getAnalytics/${email}`);
                setData(response.data);
            }
            catch (err) {
                console.log(err.message);
            }
        }
        handleGetAnalytics()
    }, []);

    const entries = Object.entries(data);
    const half = Math.ceil(entries.length / 2);
    const firstHalf = entries.slice(0, half);
    const secondHalf = entries.slice(half);

    return (
        <div className={styles.dashboardContent}>
            <div className={styles.div}>
                {firstHalf.map(([key, value], index) => (
                    <div key={index} className={styles.row}>
                        <span>{key}</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
            <div className={styles.div}>
                {secondHalf.map(([key, value], index) => (
                    <div key={index} className={styles.row}>
                        <span>{key}</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AnalyticsContent;