const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
