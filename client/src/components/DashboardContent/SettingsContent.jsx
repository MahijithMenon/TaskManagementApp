// SettingsContent.jsx
import React, { useEffect, useState } from 'react';
import styles from './SettingsContent.module.css';
import lock from '../../assets/lock.png';
import axios from 'axios';
import personLogo from '../../assets/person.png';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import eyeIcon from '../../assets/eye.png';


function SettingsContent() {
    const [userDetails, setUserDetails] = useState({ name: '', email: '' });
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const nameInputRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [confirmpasswordType, setConfirmPasswordType] = useState('password');

    const handleInputClick = (e) => {
        const len = e.target.value.length;
        e.target.setSelectionRange(len, len);
    };

    const handleUpdate = async () => {

        try {

            const response = await axios.put('https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/updatePassword', {
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
                        <img src={personLogo} width={30} height={30} alt="personlogo" />
                    </div>
                    <input type="text" placeholder="Name" value={userDetails.name} ref={nameInputRef} onClick={handleInputClick} onChange={(e) => setUserDetails((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                    <div>
                        <img src={lock} alt="lock" />
                    </div>
                    <input type={passwordType} placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <div onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}>
                        <img src={eyeIcon} width={20} height={20} alt="eye" />
                    </div>
                </div>
            </div>
            <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                    <div>
                        <img src={lock} alt="lock" />
                    </div>
                    <input type={confirmpasswordType} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <div onClick={() => setConfirmPasswordType(confirmpasswordType === 'password' ? 'text' : 'password')}>
                        <img src={eyeIcon} alt="eye" width={20} height={20} />
                    </div>
                </div>
            </div>
            <button onClick={handleUpdate} className={styles.styledButton}>Update</button>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </div>
    );
}

export default SettingsContent;