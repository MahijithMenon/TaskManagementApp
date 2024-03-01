// Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import LogoutBtn from '../../assets/logout.png';
import SettingsIcon from '../../assets/settings.png';
import AnalyticsIcon from '../../assets/data-analytics.png';
import DashboardIcon from '../../assets/dashboard.png';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        navigate('/');
    }

    return (
        <>
            <div className={styles.menu}>
                <h1>Pro Manage</h1>
                <ul className={styles.menubox}>
                    <li className={`${styles.menuItem} ${location.pathname === '/dashboard' ? styles.activeDashboard : ''}`} onClick={() => navigate('/dashboard')}>
                        <img src={DashboardIcon} width={20} height={20} alt="Dashboard" />
                        Dashboard
                    </li>
                    <li className={`${styles.menuItem} ${location.pathname === '/dashboard/analytics' ? styles.activeDashboard : ''}`} onClick={() => navigate('/dashboard/analytics')}>
                        <img src={AnalyticsIcon} width={20} height={20} alt="Analytics" />
                        Analytics
                    </li>
                    <li className={`${styles.menuItem} ${location.pathname === '/dashboard/settings' ? styles.activeDashboard : ''}`} onClick={() => navigate('/dashboard/settings')}>
                        <img src={SettingsIcon} width={20} height={20} alt="Settings" />
                        Settings
                    </li>
                </ul>
            </div>
            <div className={styles.footer}>
                <img src={LogoutBtn} width={20} height={20} alt="Logout" />
                <button className={styles.logoutButton} onClick={handleSignout}>
                    Logout
                </button>
            </div>
        </>
    );
}

export default Sidebar;