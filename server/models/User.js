const Board = require('./Board');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profileImage: String,
    boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
    analytics: { type: mongoose.Schema.Types.ObjectId, ref: 'Analytics' }
  });


  userSchema.pre('save', async function(next) {
    const defaultBoards = ['Backlog', 'To Do', 'In Progress', 'Done'];
    const boards = defaultBoards.map(name => new Board({ name }));
    await Board.insertMany(boards);
    this.boards = boards.map(board => board._id);
    next();
  });
  

const User = mongoose.model('User', userSchema);

module.exports = User;