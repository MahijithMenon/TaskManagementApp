import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './PublicPage.module.css';
import logo from '../../assets/logo.png';

const TaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [error, setError] = useState(null);
    const isOverdue = task && task.dueDate && new Date(task.dueDate) < new Date();

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return '#FF2473';
            case 'medium':
                return '#18B0FF';
            case 'low':
                return 'green';
            default:
                return 'black';
        }
    }

    useEffect(() => {
        if (!taskId) {
            setError('Task ID is not provided');
            return;
        }

        const handleGetTask = async () => {
            try {
                const response = await axios.get(`https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/getTask/${taskId}`);
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

                <img className={styles.logo} src={logo} alt="logo" />

                <div className={styles.taskContainer}>
                    <div className={styles.heading}>
                        <p className={styles.priority}><span style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: getPriorityColor(task.priority),
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '5px'
                        }}></span>{task.priority} Priority</p>

                        <h1 className={styles.title}>{task.title}</h1>
                    </div>
                    <div className={styles.checklist}>
                        <label>Checklist  {task.checklist && ` (${task.checklist.filter(item => item.completed).length}/${task.checklist.length})`}</label>

                        <div className={styles.scrollableDiv}>
                            {task.checklist ? task.checklist.map((item, index) => (
                                <div key={index} className={styles.checklistItem}>
                                    <input type="checkbox" checked={item.completed} disabled />
                                    <label>{item.text}</label>
                                </div>
                            )) : <p>No checklist items found</p>}

                        </div>
                    </div>

                    {task.dueDate && (
                        <div className={styles.dueDate} >
                            <p>Due Date:</p>
                            <p className={isOverdue ? styles.dueDateOverdue : styles.dueDateNotOverdue}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                        </div>
                    )}




                </div>
            </div>
        ) : <div>Loading...</div>
    );
};

export default TaskPage;