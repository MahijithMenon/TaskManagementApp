import { useState } from 'react';
import styles from './TaskModal.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function MyComponent({ task, setShowCreateTaskModal, setSelectedTaskId, setShowDeleteTaskModal }) {

    const handleEdit = () => {
        setSelectedTaskId(task._id)
        setShowCreateTaskModal(true);
    }

    const handleDelete = () => {
        setShowDeleteTaskModal(true);
        setSelectedTaskId(task._id);
    }

    const handleShare = () => {
        navigator.clipboard.writeText(`https://menon-mahijith-gmail-com-cuvette-final-evaluation-may.vercel.app/publicpage/${task._id}`);
        toast.success('Link copied to clipboard');

    }
    return (
        <div className={styles.modal}>
            <button className={styles.button} onClick={handleEdit}>Edit</button>
            <button className={styles.button} onClick={handleShare}>Share</button>
            <button className={`${styles.button} ${styles.delete}`} onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default MyComponent;