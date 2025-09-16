const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", testimonialController.getTestimonials);
router.get("/:id", testimonialController.getTestimonialById);
router.post("/", authMiddleware, testimonialController.createTestimonial);
router.put("/:id", authMiddleware, testimonialController.updateTestimonial);
router.delete("/:id", authMiddleware, testimonialController.deleteTestimonial);

module.exports = router;
