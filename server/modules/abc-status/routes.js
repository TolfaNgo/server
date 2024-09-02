const express = require("express");
const router = express.Router();
const {
  createTolfaAbcStatus,
  getAllTolfaAbcStatus,
  getTolfaAbcStatusById,
  updateTolfaAbcStatus,
  deleteTolfaAbcStatus,
} = require("./controller");

// Create a new TolfaAbcStatus
router.post("/create", createTolfaAbcStatus);

// Get all TolfaAbcStatus records
router.get("/", getAllTolfaAbcStatus);

// Get a single TolfaAbcStatus by ID
router.get("/:id", getTolfaAbcStatusById);

// Update a TolfaAbcStatus by ID
router.post("/update/:id", updateTolfaAbcStatus);

// Delete a TolfaAbcStatus by ID
router.delete("/delete/:id", deleteTolfaAbcStatus);

module.exports = router;
