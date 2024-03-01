// DeleteModal.jsx
import React from 'react';
import styles from './DeleteModal.module.css';
import axios from 'axios';

function DeleteModal({ closeModal, taskId }) {

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/deleteTask/${taskId}`);
            if (response.status === 200) {
                closeModal();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error.response.data);
        }
    }



    return (
        <div className={styles.deleteModal}>
            <div className={styles.deleteModalContent}>
                <h2>Are you sure you want to delete this?</h2>
                <div className={styles.deleteModalButtons}>
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteModal;