const express = require("express");
const { sendMatch, getMatchHistory, updateMatchStatus } = require("../controllers/matchController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", protect, sendMatch);
router.get("/history", protect, getMatchHistory);
router.patch("/:id/status", protect, updateMatchStatus);

module.exports = router;
