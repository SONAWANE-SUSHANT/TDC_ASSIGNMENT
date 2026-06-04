const express = require("express");
const { explainMatch, generateIntro } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/explain-match", protect, explainMatch);
router.post("/generate-intro", protect, generateIntro);

module.exports = router;
