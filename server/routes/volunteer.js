// routes/volunteer.js
const router = require('express').Router();
let Volunteer = require('../models/Volunteer.model');

router.route('/register').post((req, res) => {
    const { fullName, email, phone, password, address, occupation, whyJoin } = req.body;

    const newVolunteer = new Volunteer({
        fullName,
        email,
        phone,
        password, 
        address,
        occupation,
        whyJoin
    });

    newVolunteer.save()
        .then(() => res.json('Volunteer registered!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
    const { email, password } = req.body;

    Volunteer.findOne({ email: email })
        .then(volunteer => {
            if (volunteer) {
                if (volunteer.password === password) {
                    res.json({ success: true, message: "Login successful", volunteer });
                } else {
                    res.status(400).json({ success: false, message: "Invalid password" });
                }
            } else {
                res.status(400).json({ success: false, message: "Volunteer not found" });
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;
