const express = require("express");
const {
  getAllColors,
  getColorById,
  getActiveColors, // Import the new function
  createColor,
  updateColor,
  deleteColor,
} = require("./controller");

const router = express.Router();

router.get("/", getAllColors);
router.get("/active", getActiveColors);
router.get("/:id", getColorById);
router.post("/create", createColor);
router.post("/update/:id", updateColor);
router.delete("/delete/:id", deleteColor);

module.exports = router;
