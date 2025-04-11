const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

router.get('/', async (req, res) => {
  const teams = await Team.find().populate('members');
  res.json(teams);
});

router.post('/', async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
