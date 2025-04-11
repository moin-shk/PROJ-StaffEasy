const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRoutes = require('./staffeasy-backend/routes/users');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);


mongoose.connect('mongodb+srv://Nikita:AXZILEMONAX@cluster0.h1tjqig.mongodb.net/staffeasy?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const employeesRoute = require('./staffeasy-backend/routes/employees');
app.use('/api/employees', employeesRoute);
const teamsRoute = require('./staffeasy-backend/routes/teams');
app.use('/api/teams', teamsRoute);


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
