const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const artistRoutes = require('./routes/artistRoutes');
const songRoutes = require('./routes/songRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

require('dotenv').config();

const app = express();
app.use(express.static('public'));

// Middleware
app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use('/api/users', userRoutes);
app.use('/api/artists', authMiddleware, artistRoutes);  // Protect artist routes
app.use('/api/songs', authMiddleware, songRoutes);  // Protect song routes
