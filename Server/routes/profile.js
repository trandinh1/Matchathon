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

module.exports = router;
