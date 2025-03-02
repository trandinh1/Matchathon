const express = require("express");
const { getDB } = require("../db");

const router = express.Router();

// Get All Users
router.get("/all", async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection("Users").find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User by Email
router.get("/:email", async (req, res) => {
    try {
        const db = getDB();
        const user = await db.collection("Users").findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/update/:email", async (req, res) => {
    try {
        const db = getDB();
        const { email } = req.params;
        const updatedProfile = req.body;

        // Ensure user exists
        const existingUser = await db.collection("Users").findOne({ email });
        if (!existingUser) return res.status(404).json({ msg: "User not found" });

        // Update user profile
        await db.collection("Users").updateOne(
            { email },
            { $set: updatedProfile }
        );

        res.json({ msg: "Profile updated successfully", updatedProfile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

// {
//     "skills": ["React", "Node.js", "MongoDB"],
//     "interests": ["Hackathons", "AI", "Startups"],
//     "aboutMe": "I love building innovative projects!",
//     "location": "Los Angeles, CA",
//     "affiliatedWith": "University of Southern California",
//     "linkedin": "https://linkedin.com/in/johndoe"
// }