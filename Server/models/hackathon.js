const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
    hackathonName: { type: String, required: true },
    hackathonDate: { type: Date, required: true },
    location: String,
    attendees: [{ type: String, ref: "User" }]
});

module.exports = mongoose.model("Hackathon", hackathonSchema);
