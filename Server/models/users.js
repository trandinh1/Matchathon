const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    skills: [String],
    interests: [String],
    aboutMe: String,
    location: String,
    affiliatedWith: String,
    linkedin: String,
    matches: [String]
});

module.exports = mongoose.model("User", userSchema);
