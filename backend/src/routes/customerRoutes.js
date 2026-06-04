const express = require("express");
const {
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getCustomerMatches
} = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCustomers);
router.get("/:id", protect, getCustomerById);
router.patch("/:id/status", protect, updateCustomerStatus);
router.get("/:id/matches", protect, getCustomerMatches);

module.exports = router;
