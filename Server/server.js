require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

// Import Routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const hackathonRoutes = require("./routes/hackathon");
const matchRoutes = require("./routes/match");
const teamRoutes = require("./routes/team");



const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/team", teamRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
