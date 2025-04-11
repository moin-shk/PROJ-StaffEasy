const mongoose = require('mongoose');
// 
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  email: String,
  phone: String,
  salary: Number,
  salaryHistory: Array,
  timeOffRequests: Array,
  reports: Array,
  increments: Array,
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
