const express = require("express");
const controller = require("./controller");
const {
  generateSmallAnimalReport,
  generateLargeAnimalReport,
  generateReleasedSmallAnimalReport,
  generateReleasedLargeAnimalReport,
  generateAdmittedByWhoReport,
  generateCaregiverReport,
  generateInjuryReport,
  generateAreaReport,
} = require("./report.controller");

const router = express.Router();

/* GET */
router.get("/admission-report", controller.getAnimalStatusReport);

router.get("/generate-small-animal-report", generateSmallAnimalReport);
router.get("/generate-large-animal-report", generateLargeAnimalReport);

router.get(
  "/generate-small-animal-released-report",
  generateReleasedSmallAnimalReport
);

router.get(
  "/generate-large-animal-released-report",
  generateReleasedLargeAnimalReport
);

router.get("/generate-admitted-by-who-report", generateAdmittedByWhoReport);

router.get("/generate-caregiver-report", generateCaregiverReport);

router.get("/generate-injury-illness-report", generateInjuryReport);

router.get("/generate-area-report", generateAreaReport);

module.exports = router;
