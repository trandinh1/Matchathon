const express = require("express");
const { getDB } = require("../db");

const router = express.Router();

// Get team members
router.get("/:email", async (req, res) => {
    try {
        const db = getDB();
        const { email } = req.params;

        // Find the user
        const user = await db.collection("Users").findOne({ email });

        if (!user || !user.team || user.team.length === 0) {
            return res.status(404).json({ message: "No team found" });
        }

        // Fetch full details of team members
        const teamMembers = await db.collection("Users").find({ email: { $in: user.team } }).toArray();

        res.json({ team: teamMembers });
    } catch (error) {
        console.error("Error fetching team:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
