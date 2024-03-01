// Card.jsx
import React, { useEffect, useState } from 'react';
import styles from './Card.module.css';
import axios from 'axios';
import threeDots from '../../assets/three-dots.png';
import downArrow from '../../assets/down-arrow.png';
import upArrow from '../../assets/uparrow.png';
import TaskModal from '../TaskModal/TaskModal';

function Card({ boardName, taskID, setShowCreateTaskModal, setSelectedTaskId, setShowDeleteTaskModal, areAllCardsCollapsed }) {
    const [task, setTask] = useState({});
    const [email, setEmail] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [isListVisible, setIsListVisible] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);


    const boards = ['Backlog', 'To Do', 'In Progress', 'Done'];

    useEffect(() => {
        if (areAllCardsCollapsed) {
            setIsListVisible(false);
        }
    }, [areAllCardsCollapsed]);


    const handleTaskModal = () => {
        setShowTaskModal((prev) => !prev);
    }


    const handleMoveCards = (newBoard) => {
        try {

            const response = axios.post(`http://localhost:5000/moveTask/${taskID}`, { previousBoard: boardName, newBoard, email });
            if (response.status === 200) {
                window.location.reload();
                console.log('Task successfully');
            }
        }
        catch (error) {
            console.error('Error:', error.response.data);
        }


    }

    useEffect(() => {
        const getTask = async () => {
            const response = await axios.get(`http://localhost:5000/getTask/${taskID}`);
            setTask(response.data);
        }
        getTask();
        setEmail(JSON.parse(localStorage.getItem('userDetails')).email);


    }, []

    );
    return (
        <div className={styles.card}>
            <div className={styles.row}>
                <div>
                    <span className={`${styles['priority-dot']} ${task.priority ? styles[task.priority.toLowerCase()] : ''}`}></span>
                    <span>
                        {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'No Priority'} Priority
                    </span>
                </div>
                <div className={styles.handleTask} onClick={handleTaskModal}>

                    {showTaskModal && <TaskModal task={task} setShowDeleteTaskModal={setShowDeleteTaskModal} setShowCreateTaskModal={setShowCreateTaskModal} setSelectedTaskId={setSelectedTaskId} />}

                    <img src={threeDots} height={20} width={20} alt="three dots" />
                </div>
            </div>
            <div className={styles.row}>
                <span>{task.title}</span>
            </div>
            <div className={styles.row}>
                <span>Checklist:</span>
                <div onClick={() => setIsListVisible(!isListVisible)}>
                    <img src={isListVisible ? upArrow : downArrow} height={20} width={20} alt="collapse" />
                </div>
            </div>
            <div className={styles.row}>
                {isListVisible && (
                    <div className={styles.scrollableDiv}>
                        {task && task.checklist && task.checklist.map((item, index) => (
                            <div key={index} className={styles.row}>
                                <input type="checkbox" checked={item.completed} readOnly />
                                {item.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.row}>
                <div>
                    {task.dueDate &&
                        <div className={styles.dueDate}>

                            <span className={styles.taskDueDate}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                        </div>
                    }
                </div>
                <div className={styles.buttons}>
                    {
                        boards
                            .filter(board => board !== boardName)
                            .map((board, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        handleMoveCards(board);
                                        setIsClicked(true);
                                    }}
                                    disabled={isClicked}
                                >
                                    {board}
                                </button>
                            ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Card;