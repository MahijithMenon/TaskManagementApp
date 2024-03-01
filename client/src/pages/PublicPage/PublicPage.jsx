import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './PublicPage.module.css';

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [error, setError] = useState(null);
    const isOverdue = task && task.dueDate && new Date(task.dueDate) < new Date();

    useEffect(() => {
        if (!taskId) {
            setError('Task ID is not provided');
            return;
        }

        const handleGetTask = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getTask/${taskId}`);
                setTask(response.data);
                console.log(response.data);

            }
            catch (err) {
                setError(err.message);
            }
        }
        handleGetTask();



    }, [taskId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!task) {
        return (
            <>
                <div>Loading...</div>
            </>
        )
    }

    return (
        task ? (
            <div className={styles.wrapper}>
                <div className={styles.taskContainer}>
                    <h1 className={styles.title}>{task.title}</h1>
                    <p className={styles.priority}>Priority: {task.priority}</p>
                    <p className={styles.createdAt}>Created At: {task.createdAt}</p>
                    <div className={styles.checklist}>
                        {task.checklist ? task.checklist.map((item, index) => (
                            <div key={index} className={styles.checklistItem}>
                                <input type="checkbox" checked={item.completed} disabled />
                                <label>{item.text}</label>
                            </div>
                        )) : <p>No checklist items found</p>}
                    </div>

                    <div className={styles.dueDate}>

                        {task.dueDate && (
                            <div className={isOverdue ? styles.dueDateOverdue : styles.dueDate}>
                                <p>Due Date: <p>{new Date(task.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p></p>
                            </div>
                        )}

                    </div>



                </div>
            </div>
        ) : <div>Loading...</div>
    );
};

export default TaskPage;