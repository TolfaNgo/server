const express = require("express");
const router = express.Router();
const {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
} = require("./controller");

// Create a new TolfaAbcStatus
router.post("/create", create);

// Get all TolfaAbcStatus records
router.get("/", getAll);

// Get a single TolfaAbcStatus by ID
router.get("/:id", getById);

// Update a TolfaAbcStatus by ID
router.post("/update/:id", updateById);

// Delete a TolfaAbcStatus by ID
router.delete("/delete/:id", deleteById);

module.exports = router;
