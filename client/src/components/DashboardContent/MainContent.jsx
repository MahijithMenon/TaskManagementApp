// DashboardContent.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MainContent.module.css';
import ScrollableRectangle from '../../components/ScrollableRectangleDiv/ScrollableRectangle';
function DashboardContent() {
    const [date, setDate] = useState([]);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const [dateFilter, setDateFilter] = useState('This Week');
    const [boardsDetails, setBoardsDetails] = useState([]);
    const dateFilters = ['Today', 'This Week', 'This Month'];

    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value);
        fetchTasks();
    };
    const fetchTasks = async () => {
        try {
            console.log(userDetails.email);
            const response = await axios.get(`http://localhost:5000/getBoards/${userDetails.email}?dateFilter=${dateFilter}`);
            setBoardsDetails(response.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [dateFilter]);


    useEffect(() => {

        const formattedDate = () => {
            const date = new Date();
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options);
            setDate(formattedDate);

        }
        formattedDate();
    }, []);

    return (
        <div className={styles.page}>

            <div className={styles.header}>
                <h2>Welcome {userDetails.name}</h2>
                <h3>{date}</h3>
            </div>
            <div className={styles.header}>
                <h2>Board</h2>

                <select value={dateFilter} onChange={handleDateFilterChange}>
                    {dateFilters.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.row}>
                <ScrollableRectangle task={boardsDetails && boardsDetails[0]} userDetails={userDetails} name='Backlog' />
                <ScrollableRectangle task={boardsDetails && boardsDetails[1]} userDetails={userDetails} name='To Do' />
                <ScrollableRectangle task={boardsDetails && boardsDetails[2]} userDetails={userDetails} name='In Progress' />
                <ScrollableRectangle task={boardsDetails && boardsDetails[3]} userDetails={userDetails} name='Done' />
            </div>
        </div>

    );
}

export default DashboardContent;
