require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function seedDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db("MatchathonDB"); // Change this if your DB name is different

        // Dummy users
        const users = [
            {
                email: "alice@example.com",
                passwordHash: "hashed_password",
                firstName: "Alice",
                lastName: "Johnson",
                skills: ["React", "Python"],
                interests: ["AI", "Web Development"],
                aboutMe: "Passionate about AI and hackathons!",
                location: "New York, NY",
                affiliatedWith: "MIT",
                linkedin: "https://linkedin.com/in/alicejohnson"
            },
            {
                email: "bob@example.com",
                passwordHash: "hashed_password",
                firstName: "Bob",
                lastName: "Smith",
                skills: ["Node.js", "MongoDB"],
                interests: ["Blockchain", "Security"],
                aboutMe: "Love solving complex problems.",
                location: "San Francisco, CA",
                affiliatedWith: "Stanford",
                linkedin: "https://linkedin.com/in/bobsmith"
            }
        ];

        // Dummy hackathons
        const hackathons = [
            {
                hackathonName: "Hack the Future",
                hackathonDate: new Date("2025-04-10"),
                location: "San Francisco, CA",
                attendees: ["alice@example.com", "bob@example.com"]
            },
            {
                hackathonName: "AI Innovate",
                hackathonDate: new Date("2025-06-15"),
                location: "New York, NY",
                attendees: ["alice@example.com"]
            }
        ];

        // Insert dummy data
        await db.collection("Users").deleteMany({}); // Clear old data
        await db.collection("Users").insertMany(users);

        await db.collection("hackathons").deleteMany({});
        await db.collection("hackathons").insertMany(hackathons);

        console.log(" Dummy data inserted successfully!");

    } catch (err) {
        console.error("Error inserting dummy data:", err);
    } finally {
        await client.close();
        console.log("Database connection closed.");
    }
}

// Run the function
seedDatabase();
