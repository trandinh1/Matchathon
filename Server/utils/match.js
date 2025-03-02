require("dotenv").config();
const {
   GoogleGenerativeAI,
} = require("@google/generative-ai");
const { getDB } = require("../db");


const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({
   model: "gemini-2.0-flash-lite",
});


const generationConfig = {
   temperature: 1,
   topP: 0.95,
   topK: 40,
   maxOutputTokens: 8192,
   responseMimeType: "text/plain",
};


async function findTopMatch(userEmail) {
   const db = getDB();
   const user = await db.collection("Users").findOne({ email: userEmail });


   if (!user) {
       console.error("User not found:", userEmail);
       return { message: "User not found" };
   }


   const userSkills = user.skills || [];
   const userInterests = user.interests || [];
   const userHackathons = user.hacklist || [];
   const userMatchedWith = user.matchedWith || [];
   const userDisliked = user.disliked || [];
   const userTeam = user.team || [];
   const userLikes = user.matches || [];  //  Track liked users


   if (userSkills.length === 0 || userInterests.length === 0 || userHackathons.length === 0) {
       return { message: "User does not have enough profile information for matching." };
   }


   //  Stop matching if the team is already full (4 members)
   if (userTeam.length >= 4) {
       return { message: "Your team is full! No more matches needed." };
   }


   //  Find users attending the same hackathons, excluding already matched & disliked & liked users
   const potentialMatches = await db.collection("Users").find({
       email: {
           $ne: userEmail,
           $nin: [...userMatchedWith, ...userDisliked, ...userTeam, ...userLikes] //  Exclude liked users
       },
       hacklist: { $in: userHackathons }
   }).toArray();


   if (potentialMatches.length === 0) return { message: "No new matches available." };


   const filteredUsers = potentialMatches.filter(u => u.skills && u.interests);
   if (filteredUsers.length === 0) return { message: "No suitable matches found with overlapping hackathons." };


   // Construct input prompt for Gemini
   const inputPrompt = `
   I need to find the **best match** for a hackathon participant based on **similar interests** but **complementary skills**.


   **User to be matched:**
   - Email: ${user.email}
   - Skills: ${userSkills.join(", ")}
   - Interests: ${userInterests.join(", ")}
   - Attending Hackathons: ${userHackathons.join(", ")}
   - Current Team Size: ${userTeam.length} (Max 4)


   **Potential Matches (Only Users Attending the Same Hackathons & Not Previously Matched/Disliked/Liked):**
   ${filteredUsers.map((u, index) => `
   Match ${index + 1}:
   - Name: ${u.firstName || "Unknown"} ${u.lastName || ""}
   - Email: ${u.email}
   - Skills: ${u.skills.join(", ")}
   - Interests: ${u.interests.join(", ")}
   - Attending Hackathons: ${u.hacklist.join(", ")}
   `).join("\n")}


   **Matching Criteria:**
   - The match must be attending at least one of the same hackathons as the user.
   - The match must have at least **one common interest** with the user.
   - The match should have **different but complementary skills**.
   - The match should NOT be a person the user has already matched, disliked, or teamed up with.
   - Example: If the user specializes in Backend, match them with someone skilled in Frontend or UI/UX.
   - Form a **balanced hackathon team covering different skill sets**.
   - Keep showing new matches until the user has **4 team members**.


   **Return ONLY the JSON response like this (without any code block formatting):**
   {
     "email": "best_match_email",
     "name": "best match name",
     "reason": "why this person is the best match"
   }
   `;


   try {
       const chatSession = model.startChat({
           generationConfig,
           history: [],
       });


       const result = await chatSession.sendMessage(inputPrompt);
       let responseText = result.response.text();


       console.log("Raw Gemini Response:", responseText);


       responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();


       const bestMatch = JSON.parse(responseText);


       if (!bestMatch.email || bestMatch.email === "unknown") {
           console.warn("Gemini returned an invalid match. Selecting a random match instead.");
           const randomMatch = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
           return {
               email: randomMatch.email,
               name: `${randomMatch.firstName || "Unknown"} ${randomMatch.lastName || ""}`,
               reason: "Selected as fallback due to Gemini response issue.",
           };
       }


       return bestMatch;
   } catch (error) {
       console.error("Error in Gemini API:", error);


       const randomMatch = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
       return {
           email: randomMatch.email,
           name: `${randomMatch.firstName || "Unknown"} ${randomMatch.lastName || ""}`,
           reason: "Selected as fallback due to Gemini API failure.",
       };
   }
}


module.exports = { findTopMatch };



