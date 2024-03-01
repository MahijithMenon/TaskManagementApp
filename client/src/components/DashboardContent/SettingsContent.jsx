// SettingsContent.jsx
import React, { useEffect, useState } from 'react';
import styles from './SettingsContent.module.css';
import lock from '../../assets/lock.png';
import axios from 'axios';
import personLogo from '../../assets/person.png';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';


function SettingsContent() {
    const [userDetails, setUserDetails] = useState({ name: '', email: '' });
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const nameInputRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputClick = (e) => {
        const len = e.target.value.length;
        e.target.setSelectionRange(len, len);
    };

    const handleUpdate = async () => {

        try {

            const response = await axios.put('http://localhost:5000/updatePassword', {
                email: userDetails.email,
                oldPassword,
                newPassword,
                name: userDetails.name
            }, {
                headers: {
                    'Authorization': `Bearer ${userDetails.token}`
                }
            });


            if (response.status === 200) {
                localStorage.setItem('userDetails', JSON.stringify(response.data));
                navigate('/dashboard');
            }

        }
        catch (error) {
            setErrorMessage(error.response.data || 'An error occurred');
        }


    };


    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        setUserDetails(userDetails);
    }, []);

    return (
        <div className={styles.settingsContent}>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                    <div>
                        <img src={personLogo} alt="personlogo" />
                    </div>
                    <input type="text" placeholder="Name" value={userDetails.name} ref={nameInputRef} onClick={handleInputClick} onChange={(e) => setUserDetails((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                    <div>
                        <img src={lock} alt="lock" />
                    </div>
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                    <div>
                        <img src={lock} alt="lock" />
                    </div>
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
            </div>
            <button onClick={handleUpdate}>Update</button>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </div>
    );
}

export default SettingsContent;