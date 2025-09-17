const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// multiple field upload (cover + images)
const uploadFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Public routes
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);

// Protected routes (hanya admin yang login bisa akses)
router.post("/", authMiddleware, uploadFields, projectController.createProject);
router.put(
  "/:id",
  authMiddleware,
  uploadFields,
  projectController.updateProject
);
router.delete("/:id", authMiddleware, projectController.deleteProject);

module.exports = router;
