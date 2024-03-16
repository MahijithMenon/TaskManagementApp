// CreateTaskModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './createTask.module.css';
import axios from 'axios';

import DeleteIcon from '../../assets/delete.png';

function CreateTaskModal({ closeModal, userDetails, taskId, setTaskId }) {
  const [task, setTask] = useState({
    title: '',
    priority: '',
    checklist: [],
    dueDate: '',
  });
  const totalTasks = task.checklist.length;
  const completedTasks = task.checklist.reduce(
    (count, task) => (task.completed ? count + 1 : count),
    0
  );

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(
            `https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/getTask/${taskId}`
          );
          if (response.status === 200) {
            setTask(response.data);
          }
        } catch (error) {
          console.error('Error:', error.response.data);
        }
      };
      fetchTask();
    } else {
      setTaskId(null);
      setTask({ title: '', priority: '', checklist: [], dueDate: '' });
    }
  }, [taskId]);

  const handleCancel = () => {
    setTask({ title: '', priority: '', checklist: [], dueDate: '' });
    setTaskId(null);
    closeModal();
  };

  const handleInputChange = (index, event) => {
    const newChecklist = [...task.checklist];
    if (newChecklist[index]) {
      newChecklist[index].text = event.target.value;
      setTask({ ...task, checklist: newChecklist });
    }
  };

  const handleCheckboxChange = (index, event) => {
    const newChecklist = [...task.checklist];
    newChecklist[index].completed = event.target.checked;
    setTask({ ...task, checklist: newChecklist });
  };

  const handleAddClick = () => {
    const lastChecklistItem = task.checklist[task.checklist.length - 1];

    if (
      task.checklist.length === 0 ||
      (lastChecklistItem && lastChecklistItem.text !== '')
    ) {
      setTask({
        ...task,
        checklist: [...task.checklist, { text: '', completed: false }],
      });
    } else {
      alert(
        'Please complete the current checklist item before adding a new one.'
      );
    }
  };

  const handleDeleteClick = (index) => {
    const newChecklist = [...task.checklist];
    newChecklist.splice(index, 1);
    setTask({ ...task, checklist: newChecklist });
  };

  const handleDueDateChange = (event) => {
    setTask({ ...task, dueDate: event.target.value });
  };

  const handleSubmit = async () => {
    if (
      task.title === '' ||
      task.priority === '' ||
      task.checklist.length === 0 ||
      task.checklist[task.checklist.length - 1].text === ''
    ) {
      alert(
        'Please ensure the title, priority, and at least one checklist item are provided. All checklist items must have titles.'
      );
      return;
    }

    try {
      if (userDetails.email !== '' && userDetails.email !== undefined) {
        if (taskId) {
          const response = await axios.put(
            `https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/handleEditTask/${taskId}`,
            task
          );
          if (response.status === 200) {
            closeModal();
            setTaskId(null);
            setTask({ title: '', priority: '', checklist: [], dueDate: '' });
            window.location.reload();
          }
        } else {
          const response = await axios.post(
            `https://menon-mahijith-gmail-com-cuvette-final-lpx3.onrender.com/createTask/${userDetails.email}`,
            { task }
          );
          if (response.status === 200) {
            closeModal();
            setTaskId(response.data._id);
            setTask({ title: '', priority: '', checklist: [], dueDate: '' });
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <label className={styles.inputLabel}>
          Title
          <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            value={task.title}
            name="title"
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
        </label>

        <div className={styles.radioButtons}>
          <label>
            Select Priority
            <span style={{ color: 'red' }}>*</span>
          </label>
          <label
            className={`${
              task.priority === 'low' ? styles.radioButtonActive : ''
            } ${styles.radioButton} ${styles.radioButtonLow}`}
          >
            <input
              type="radio"
              name="priority"
              value="low"
              checked={task.priority === 'low'}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            />{' '}
            Low
          </label>
          <label
            className={`${
              task.priority === 'medium' ? styles.radioButtonActive : ''
            } ${styles.radioButton} ${styles.radioButtonMedium}`}
          >
            <input
              type="radio"
              name="priority"
              value="medium"
              checked={task.priority === 'medium'}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            />{' '}
            Medium
          </label>
          <label
            className={`${
              task.priority === 'high' ? styles.radioButtonActive : ''
            } ${styles.radioButton} ${styles.radioButtonHigh}`}
          >
            <input
              type="radio"
              name="priority"
              value="high"
              checked={task.priority === 'high'}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            />{' '}
            High
          </label>
        </div>

        <label className={styles.inputLabel}>
          Checklist({completedTasks}/{totalTasks}){' '}
          <span style={{ color: 'red' }}>*</span>
          <div className={styles.scrollableDiv}>
            {task.checklist.length > 0 ? (
              task.checklist.map((item, index) => (
                <div key={index}>
                  <div
                    className={styles.checklistItem}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(event) => handleCheckboxChange(index, event)}
                    />
                    <input
                      type="text"
                      placeholder="Add an item to the checklist..."
                      value={item.text}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                    {index > 0 && (
                      <img
                        className="deleteIcon"
                        src={DeleteIcon}
                        height={20}
                        width={20}
                        onClick={() => handleDeleteClick(index)}
                      ></img>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No checklist items</p>
            )}
          </div>
        </label>
        <button onClick={handleAddClick} className={styles.checklistItemBtn}>
          Add new checklist item
        </button>
        <div className={styles.buttonGroup}>
          <label>
            Due Date:
            <input
              className={styles.dateInput}
              type="date"
              min={today}
              value={task.dueDate}
              onChange={handleDueDateChange}
            />
          </label>
          <div className={styles.innerDiv}>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
            {taskId ? (
              <button className={styles.saveButton} onClick={handleSubmit}>
                Update
              </button>
            ) : (
              <button className={styles.saveButton} onClick={handleSubmit}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTaskModal;
