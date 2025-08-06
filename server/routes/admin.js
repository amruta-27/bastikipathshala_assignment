// routes/admin.js
const router = require('express').Router();
const Admin = require('../models/admin.model');
const Volunteer = require('../models/Volunteer.model');

router.route('/login').post((req, res) => {
    const { username, password } = req.body;

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "password123";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        res.json({ success: true, message: "Admin login successful" });
    } else {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
});

router.route('/volunteers').get((req, res) => {
    Volunteer.find()
        .then(volunteers => res.json(volunteers))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
