const mongoose = require('mongoose');
const boardSchema = new mongoose.Schema({
  name: String,
  description: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});




const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
  