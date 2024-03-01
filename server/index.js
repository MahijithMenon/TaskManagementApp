const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;
const User = require('./models/User');
const Task = require('./models/Task');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

try {
  mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
} catch (err) {
  process.exit(1);
}



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).send('Invalid email or password');
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(400).send('Invalid email or password');
      }
      const userDetails = { name: user.name, email: user.email,userId: user._id};
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(200).json({ token, userDetails });
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  
  
  app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    
    if (!name || !email || !password) {
      return res.status(400).send('Please provide all fields');
    }
    
    try {
      
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).send('User already exists');
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      
      await newUser.save();
      
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
      const userDetails = { name: newUser.name, email: newUser.email,userId: newUser._id};
      res.status(200).json({ token, userDetails });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal server error');
    }
  });
  
  app.put('/updatePassword', async (req, res) => {
    const { email, oldPassword, newPassword, name } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User does not exist');
        }

        let updatedFields = {};

        if (newPassword ) {
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
       
            if (!isPasswordCorrect) {
                return res.status(400).send('Invalid password');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updatedFields.password = hashedPassword;
        }

        if (name) {
            updatedFields.name = name;
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            updatedFields,
            { new: true } 
        );
        const userDetails = { name: updatedUser.name, email: updatedUser.email,userId: updatedUser._id};
        res.status(200).send(userDetails);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});
  app.post('/createTask/:email', async (req, res) => {
    const { task } = req.body;
    const { email } = req.params;
    try {
        const newTask = new Task(task);
        await newTask.save();

        const user = await User.findOne({ email }).populate('boards');
        if (!user) {
            return res.status(400).send('User does not exist');
        }
        
        const board = user.boards.find(board => board.name === 'To Do');
        if (!board) {
            return res.status(400).send('Board does not exist');
        }
        board.tasks.push(newTask._id);
        await board.save();

        res.status(200).send('Task created');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});


app.get('/getBoards/:email', async (req, res) => {
  try {
      const { email } = req.params;
      let { dateFilter } = req.query;
      const user = await User.findOne({ email }).populate({
        path: 'boards',
        populate: {
          path: 'tasks', 
          model: 'Card'
        }
      });
      

      if (!user) {
          return res.status(400).send('User does not exist');
      }

      let boards = user.boards;
      
      if (dateFilter) {
        const today = new Date();
        if (dateFilter === 'Today') {
            boards = boards.map(board => {
              board.tasks = board.tasks.filter(task => task.createdAt && task.createdAt.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0));
              return board;
            });
        } else if (dateFilter === 'This Week') {
            const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            boards = boards.map(board => {
              board.tasks = board.tasks.filter(task => task.createdAt && task.createdAt >= oneWeekAgo);
              return board;
            });
        } else if (dateFilter === 'This Month') {
            const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            boards = boards.map(board => {
              board.tasks = board.tasks.filter(task => task.createdAt && task.createdAt >= oneMonthAgo);
              return board;
            });
        }
    }
      res.status(200).json(boards);
  } catch(err) {
      console.log(err.message);
      res.status(500).send('Server error');
  }
});

app.get('/getTask/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const task =  await Task.findById(id)
      if (!task) {
          return res.status(400).send('Task does not exist');
      }
      res.status(200).json(task);
  } catch(err) {
      console.log(err.message);
      res.status(500).send('Server error');
  }
}
);

app.post('/moveTask/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { previousBoard, newBoard,email } = req.body;
      const task
      = await Task.findById(id);
      if (!task) {
          return res.status(400).send('Task does not exist');
      }
      const
      user
      = await
      User.findOne({ email }).populate('boards');
      if (!user) {
          return res.status(400).send('User does not exist');
      }
      const previousBoardIndex = user.boards.findIndex(board => board.name === previousBoard);
      const newBoardIndex = user.boards.findIndex(board => board.name === newBoard);
      if (previousBoardIndex === -1 || newBoardIndex === -1) {
          return res.status(400).send('Board does not exist');
      }

      user.boards[previousBoardIndex].tasks = user.boards[previousBoardIndex].tasks.filter(task => task._id.toString() !== id);
      user.boards[newBoardIndex].tasks.push(id);
      await user.boards[previousBoardIndex].save();
      await user.boards[newBoardIndex].save();
      res.status(200).send('Task moved');
  } catch(err) {
      console.log(err.message);
      res.status(500).send('Server error');
  }
}
);

app.get('/getAnalytics/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email })
      .populate({
        path: 'boards',
        populate: {
          path: 'tasks',
          model: 'Card'
        }
      });

    if (!user) {
      return res.status(400).send('User does not exist');
    }

    let backlogTasks = 0;
    let todoTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let lowPriority = 0;
    let moderatePriority = 0;
    let highPriority = 0;
    let dueDateTasks = 0;

    user.boards.forEach(board => {
      board.tasks.forEach(task => {
        if (board.name === 'Backlog') backlogTasks++;
        if (board.name === 'To Do') todoTasks++;
        if (board.name === 'In Progress') inProgressTasks++;
        if (board.name === 'Done') completedTasks++;
        if (task.priority === 'low') lowPriority++;
        if (task.priority === 'medium') moderatePriority++;
        if (task.priority === 'high') highPriority++;
        if (task.dueDate) dueDateTasks++;
      });
    });

    res.status(200).json({
      "Backlog Tasks":backlogTasks,
      "To-do Tasks":todoTasks,
      "In-Progress Tasks":inProgressTasks,
      "Completed Tasks":completedTasks,
      "Low Priority":lowPriority,
      "Moderate Priority":moderatePriority,
      "High Priority":highPriority,
      "Due Date Tasks":dueDateTasks
    });
  }
  catch(err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/handleEditTask/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { title, checklist, priority, dueDate } = req.body;
      const task =  await Task
      .findById(id);
      if (!task) {
          return res.status(400).send('Task does not exist');
      }
      task.title = title;
      task.checklist = checklist;
      task.priority = priority;
      task.dueDate = dueDate;
      await task.save();
      console.log(task);
      res.status(200).send('Task updated');
  } catch(err) {
      console.log(err.message);
      res.status(500).send('Server error');
  }
}
);

app.delete('/deleteTask/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const task =  await Task.findById(id);
      if (!task) {
          return res.status(400).send('Task does not exist');
      }
      await Task.findByIdAndDelete(id);
      res.status(200).send('Task deleted');
  } catch(err) {
      console.log(err.message);
      res.status(500).send('Server error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
