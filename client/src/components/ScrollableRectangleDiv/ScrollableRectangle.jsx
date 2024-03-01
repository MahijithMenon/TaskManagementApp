// ScrollableRectangle.jsx
import React, { useState, useEffect } from 'react';
import styles from './ScrollableRectangle.module.css';
import Card from '../Card/Card';
import CollapseAll from '../../assets/collapseall.png';
import CreateTaskModal from '../createTaskModal/createTask';
import plus from '../../assets/plus.png';
import DeleteModal from '../DeleteModal/DeleteModal';

function ScrollableRectangle({ task, userDetails, name }) {
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
    const [areAllCardsCollapsed, setAreAllCardsCollapsed] = useState(false);

    useEffect(() => {
        if (areAllCardsCollapsed) {

            const timeoutId = setTimeout(() => {
                setAreAllCardsCollapsed(false);
            }, 1000);


            return () => clearTimeout(timeoutId);
        }
    }, [areAllCardsCollapsed]);

    return (
        <div className={styles.rectangleContainer}>
            {showCreateTaskModal && <CreateTaskModal userDetails={userDetails} setTaskId={setSelectedTaskId} taskId={selectedTaskId || null} closeModal={() => setShowCreateTaskModal(false)} />}
            {showDeleteTaskModal && <DeleteModal userDetails={userDetails} taskId={selectedTaskId} closeModal={() => setShowDeleteTaskModal(false)} />}
            <div className={styles.scrollableRectangle}>
                <div className={styles.header}>
                    <div className={styles.nameSection}>
                        <span>{name}</span>
                    </div>
                    <div className={styles.iconSection}>
                        {name === 'To Do' &&
                            <button className={styles.actionButtons} onClick={() => setShowCreateTaskModal(true)}>
                                <img src={plus} height={20} weight={20} alt="Add Cards" />
                            </button>
                        }
                        <button className={styles.actionButtons} onClick={() => setAreAllCardsCollapsed(true)}>
                            <img src={CollapseAll} height={20} weight={20} alt="CollapseAll" />
                        </button>
                    </div>
                </div>
                {
                    task && task.tasks && task.tasks.map((children, index) => (

                        <Card key={`${children}-${index}`} boardName={name} taskID={children} setShowCreateTaskModal={setShowCreateTaskModal} setShowDeleteTaskModal={setShowDeleteTaskModal} setSelectedTaskId={setSelectedTaskId} areAllCardsCollapsed={areAllCardsCollapsed} />

                    ))
                }
            </div>
        </div>
    );
}

export default ScrollableRectangle;