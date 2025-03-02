const express = require("express");
const { getDB } = require("../db");

const router = express.Router();

// Get All Hackathons
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const hackathons = await db.collection("hackathons").find().toArray();
        res.json(hackathons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register for Hackathon
router.post("/register", async (req, res) => {
    try {
        const db = getDB();
        const { hackathonName, email } = req.body;

        const hackathon = await db.collection("hackathons").findOne({ hackathonName });
        if (!hackathon) return res.status(404).json({ msg: "Hackathon not found" });

        await db.collection("hackathons").updateOne(
            { hackathonName },
            { $addToSet: { attendees: email } }
        );

        res.json({ msg: "Successfully registered!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
