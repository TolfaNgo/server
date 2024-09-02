const express = require("express");
const router = express.Router();
const {
createTolfaCondition,
deleteTolfaCondition,
getAllTolfaCondition,
getTolfaConditionById,
updateTolfaCondition
} = require("./controller");

// Create a new TolfaAbcStatus
router.post("/create", createTolfaCondition);

// Get all TolfaAbcStatus records
router.get("/", getAllTolfaCondition);

// Get a single TolfaAbcStatus by ID
router.get("/:id", getTolfaConditionById);

// Update a TolfaAbcStatus by ID
router.post("/update/:id", updateTolfaCondition);

// Delete a TolfaAbcStatus by ID
router.delete("/delete/:id", deleteTolfaCondition);

module.exports = router;
