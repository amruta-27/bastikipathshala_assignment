// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const dbURI = "mongodb://localhost:27017/bastiKiPathshala"; 
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

// Routes
const adminRoutes = require('./routes/admin');
const volunteerRoutes = require('./routes/volunteer');

app.use('/api/admin', adminRoutes);
app.use('/api/volunteer', volunteerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
