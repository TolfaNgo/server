const express = require("express");
const router = express.Router();
const {
  createTolfaStatus,
  deleteTolfaStatus,
  getAllTolfaStatus,
  getTolfaStatusById,
  updateTolfaStatus,
} = require("./controller");

// Create a new TolfaAbcStatus
router.post("/create", createTolfaStatus);

// Get all TolfaAbcStatus records
router.get("/", getAllTolfaStatus);

// Get a single TolfaAbcStatus by ID
router.get("/:id", getTolfaStatusById);

// Update a TolfaAbcStatus by ID
router.post("/update/:id", updateTolfaStatus);

// Delete a TolfaAbcStatus by ID
router.delete("/delete/:id", deleteTolfaStatus);

module.exports = router;
