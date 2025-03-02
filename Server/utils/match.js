require("dotenv").config();
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
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
    const userMatchedWith = user.matchedWith || []; // Existing matches

    if (userSkills.length === 0 || userInterests.length === 0 || userHackathons.length === 0) {
        return { message: "User does not have enough profile information for matching." };
    }

    // ✅ Find users attending the same hackathons, but NOT already matched
    const otherUsers = await db.collection("Users").find({
        email: { $ne: userEmail, $nin: userMatchedWith }, // Exclude self and existing matches
        hacklist: { $in: userHackathons } // Match overlapping hackathons
    }).toArray();

    if (otherUsers.length === 0) return { message: "No other users available for matching." };

    const filteredUsers = otherUsers.filter(u => u.skills && u.interests);
    if (filteredUsers.length === 0) return { message: "No suitable matches found with overlapping hackathons." };

    // Construct input prompt for Gemini
    const inputPrompt = `
    I need to find the **best match** for a hackathon participant based on **similar interests** but **complementary skills**.

    **User to be matched:**
    - Email: ${user.email}
    - Skills: ${userSkills.join(", ")}
    - Interests: ${userInterests.join(", ")}
    - Attending Hackathons: ${userHackathons.join(", ")}

    **Potential Matches (Only Users Attending the Same Hackathons & Not Previously Matched):**
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
    - The match should NOT be a person the user has already matched with.
    - Example: If the user specializes in Backend, match them with someone skilled in Frontend or UI/UX.
    - Form a **balanced hackathon team covering different skill sets**.

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

        // Extract JSON from Markdown-style response
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse the response safely
        const bestMatch = JSON.parse(responseText);

        // Ensure the response contains a valid email
        if (!bestMatch.email || bestMatch.email === "unknown") {
            return { message: "Gemini could not determine the best match email. Try again." };
        }

        return bestMatch;
    } catch (error) {
        console.error("Error in Gemini API:", error);
        return { message: "Error in finding a match" };
    }
}

module.exports = { findTopMatch };

