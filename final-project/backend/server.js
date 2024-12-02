const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Set up error handling for MongoDB connection
mongoose.connection.on('error', (err) => {
  console.error('Error occurred in MongoDB connection:', err);
});

// Set up route handling
app.use('/api', require('./routes/userRoutes'));

// Handle unknown routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Set up security measures
app.use(cors());
app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Close the MongoDB connection when the server is closed
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});