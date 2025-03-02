const express = require("express");
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

module.exports = router;
