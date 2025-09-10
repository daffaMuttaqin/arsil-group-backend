const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", testimonialController.getTestimonials);
router.post("/", authMiddleware, testimonialController.createTestimonial);

module.exports = router;
