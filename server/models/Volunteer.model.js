// models/volunteer.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    occupation: { type: String, required: true },
    whyJoin: { type: String, required: true },
}, {
    timestamps: true,
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
