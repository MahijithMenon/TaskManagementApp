const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
    title: String,
    priority: String,
    checklist: [{ text: String, completed: Boolean }],
    dueDate: Date,
    createdAt: { type: Date, default: Date.now },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' }
  });
  
  const Task = mongoose.model('Card', cardSchema);
  
  module.exports = Task;
  