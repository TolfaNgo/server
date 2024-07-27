const express = require("express");
const controller = require("./controller");
const rescueInfo = require("./helper/rescue-info");
const { postFile } = require("../utils/mutler.service");

const router = express.Router();

/* GET */
router.get("/", controller.get);
/* CREATE */
router.post("/create", postFile, controller.create);
/* UPDATE */
router.put("/update", controller.update);
/* DELETE */
router.put("/delete", controller.delete);

/* GET latest rescue number */
router.get("/get-lastest-rescue-number", rescueInfo.getRescueNumber);

/**
 * @tolfa_location
 */

/* Update rescue location */
router.post("/update/rescue-location", controller.updateRescueLocation);

/** history_logs */
router.get(
  "/history-logs/rescue-location/:rescue_id",
  controller.historyLogsTolfaLocation
);

/**
 * @tolfa_rescue_animal_status
 */
router.post("/update/rescue-animal-status", controller.updateRescueAnimalStatus);

router.post("/update/rescue-animal-info", controller.updateRescueAnimalInfo);

module.exports = router;
