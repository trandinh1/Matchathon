const express = require("express");
const { getDB } = require("../db");
const { findTopMatch } = require("../utils/match");


const router = express.Router();


//  Fetch next match excluding already matched & disliked users
router.get("/:email", async (req, res) => {
   try {
       const userEmail = req.params.email;
       const bestMatch = await findTopMatch(userEmail);


       if (!bestMatch || !bestMatch.email) {
           return res.json({ message: "No new matches available" });
       }


       res.json(bestMatch);
   } catch (err) {
       console.error("Error fetching match:", err);
       res.status(500).json({ error: err.message });
   }
});


//  Check if two users have mutually matched & add them to a team (max size: 4)
router.post("/check-match", async (req, res) => {
   try {
       const db = getDB();
       const { user1, user2 } = req.body;


       const user1Data = await db.collection("Users").findOne({ email: user1 });
       const user2Data = await db.collection("Users").findOne({ email: user2 });


       if (!user1Data || !user2Data) {
           return res.status(404).json({ message: "One or both users not found" });
       }


       //  Check if both users have mutually matched
       const user1MatchedWithUser2 = user1Data.matches.includes(user2);
       const user2MatchedWithUser1 = user2Data.matches.includes(user1);


       if (user1MatchedWithUser2 && user2MatchedWithUser1) {
           //  Check team size (max 4 members)
           const teamSize1 = user1Data.team ? user1Data.team.length : 0;
           const teamSize2 = user2Data.team ? user2Data.team.length : 0;


           if (teamSize1 < 4 && teamSize2 < 4) {
               //  Add both users to each other's teams
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


// ✅ Handle liking (✔️) and disliking (❌) users
router.post("/action", async (req, res) => {
   try {
       const db = getDB();
       const { userEmail, matchedEmail, action } = req.body;


       const user = await db.collection("Users").findOne({ email: userEmail });
       if (!user) return res.status(404).json({ message: "User not found" });


       if (action === "like") {
           // Add matched user to matches array (avoids duplicates)
           await db.collection("Users").updateOne(
               { email: userEmail },
               { $addToSet: { matches: matchedEmail } }
           );


           return res.json({ message: "User liked and added to matches." });
       } else if (action === "dislike") {
           // Add user to "disliked" array (prevents them from appearing again)
           await db.collection("Users").updateOne(
               { email: userEmail },
               { $addToSet: { disliked: matchedEmail } }
           );


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



