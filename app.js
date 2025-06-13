const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const config = require('./config');
const memberRoutes = require('./routes/members');
const schemeRoutes = require('./routes/schemes');

const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/schemes', schemeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
