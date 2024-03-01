// Dashboard.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/SideBar/Sidebar'
import DashboardContent from '../../components/DashboardContent/MainContent';
import AnalyticsContent from '../../components/DashboardContent/AnalyticsContent';
import SettingsContent from '../../components/DashboardContent/SettingsContent';
import PublicPage from '../../pages/PublicPage/PublicPage';
import styles from './Dashboard.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    return (
        <div className={styles.dashboard}>
            <div className={styles.sidebar}>
                <Sidebar />

            </div>
            <div className={styles.content}>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<DashboardContent />} />
                    <Route path="analytics" element={<AnalyticsContent />} />
                    <Route path="settings" element={<SettingsContent />} />
                    <Route path="publicpage" element={<PublicPage />} />
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Routes>
            </div>

        </div>

    );
}

export default Dashboard;
