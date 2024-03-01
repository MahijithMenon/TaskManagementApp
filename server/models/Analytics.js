const mongoose = require('mongoose');
const analyticsSchema = new mongoose.Schema({
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    overdueTasks: { type: Number, default: 0 },
    tasksCreatedThisWeek: { type: Number, default: 0 },
    tasksCreatedThisMonth: { type: Number, default: 0 }
  });

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
  