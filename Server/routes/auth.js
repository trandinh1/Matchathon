const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../db");

const router = express.Router();

// User Registration
// router.post("/register", async (req, res) => {
//     try {
//         const db = getDB();
//         const { email, password, firstName, lastName } = req.body;

//         const existingUser = await db.collection("Users").findOne({ email });
//         if (existingUser) return res.status(400).json({ msg: "User already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const passwordHash = await bcrypt.hash(password, salt);

//         const newUser = { email, passwordHash, firstName, lastName };
//         await db.collection("Users").insertOne(newUser);

//         res.status(201).json({ msg: "User registered successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

router.post("/register", async (req, res) => {
    try {
        const db = getDB();
        const { email, password, firstName, lastName, skills, interests, aboutMe, location, affiliatedWith, linkedin } = req.body;

        // Check if user already exists
        const existingUser = await db.collection("Users").findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Include all profile fields in registration
        const newUser = {
            email,
            passwordHash,
            firstName,
            lastName,
            skills: skills || [], // Default to empty array if not provided
            interests: interests || [],
            aboutMe: aboutMe || "",
            location: location || "",
            affiliatedWith: affiliatedWith || "",
            linkedin: linkedin || ""
        };

        await db.collection("Users").insertOne(newUser);

        res.status(201).json({ msg: "User registered successfully", newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Login
router.post("/login", async (req, res) => {
    try {
        const db = getDB();
        const { email, password } = req.body;

        const user = await db.collection("Users").findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
