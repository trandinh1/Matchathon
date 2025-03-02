const express = require("express");
const { getDB } = require("../db");
const { findTopMatch } = require("../utils/match");

const router = express.Router();

router.get("/:email", async (req, res) => {
    try {
        const userEmail = req.params.email;
        const bestMatch = await findTopMatch(userEmail);
        res.json(bestMatch);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check if two users have matched & add to a team (max size: 4)
router.post("/check-match", async (req, res) => {
    try {
        const db = getDB();
        const { user1, user2 } = req.body; // Emails of users

        const user1Data = await db.collection("Users").findOne({ email: user1 });
        const user2Data = await db.collection("Users").findOne({ email: user2 });

        if (!user1Data || !user2Data) {
            return res.status(404).json({ message: "One or both users not found" });
        }

        // Check if they have matched each other
        const user1MatchedWithUser2 = user1Data.matches.includes(user2);
        const user2MatchedWithUser1 = user2Data.matches.includes(user1);

        if (user1MatchedWithUser2 && user2MatchedWithUser1) {
            // Check if team exists and has space
            const teamSize1 = user1Data.team ? user1Data.team.length : 0;
            const teamSize2 = user2Data.team ? user2Data.team.length : 0;

            if (teamSize1 < 4 && teamSize2 < 4) {
                //  Add both users to each other's team
                await db.collection("Users").updateOne(
                    { email: user1 },
                    { $addToSet: { team: user2 } }
                );

                await db.collection("Users").updateOne(
                    { email: user2 },
                    { $addToSet: { team: user1 } }
                );

                return res.json({ message: "Users added to the same team" });
            } else {
                return res.json({ message: "Team size limit reached (max 4 members)" });
            }
        } else {
            return res.json({ message: "Users have not mutually matched" });
        }
    } catch (error) {
        console.error("Error in checking match:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//  Handle liking (match) and disliking (skip)
router.post("/action", async (req, res) => {
    try {
        const db = getDB();
        const { userEmail, matchedEmail, action } = req.body;

        const user = await db.collection("Users").findOne({ email: userEmail });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (action === "like") {
            await db.collection("Users").updateOne(
                { email: userEmail },
                { $addToSet: { matches: matchedEmail } }
            );
            return res.json({ message: "User liked and added to matches." });
        } else if (action === "dislike") {
            return res.json({ message: "User skipped." });
        } else {
            return res.status(400).json({ message: "Invalid action." });
        }
    } catch (error) {
        console.error("Error in match action:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
