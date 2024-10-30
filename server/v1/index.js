const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const rescueType = require("../modules/rescue-type");
const speciesType = require("../modules/species-type");
const animalStatus = require("../modules/animal-status");
const breed = require("../modules/breed");
const role = require("../modules/role");
const user = require("../modules/user");
const city = require("../modules/tolfa-city");
const state = require("../modules/tolfa-state");
const cityArea = require("../modules/city-area");
const area = require("../modules/area");
const blockNumber = require("../modules/block-number");
const admissionStatus = require("../modules/admission-status");
const carePeople = require("../modules/care-people");
const analytics = require("../modules/analytics");
const color = require("../modules/color");
const abcStatus = require("../modules/abc-status");
const status = require("../modules/status");
const condition = require("../modules/condition");
const bodyScore = require("../modules/body-score");
const reports = require("../modules/reports");

const test = require("../modules/test");
const auth = require("../modules/auth");

const router = express.Router();

router.use("/auth", auth);
router.use("/test", authMiddleware.verifyToken, test);

router.use("/rescue-type", authMiddleware.verifyToken, rescueType);
router.use("/species-type", authMiddleware.verifyToken, speciesType);

router.use("/animal-status", authMiddleware.verifyToken, animalStatus);
router.use("/breed", authMiddleware.verifyToken, breed);

router.use("/city", authMiddleware.verifyToken, city);
router.use("/state", authMiddleware.verifyToken, state);
router.use("/city-area", authMiddleware.verifyToken, cityArea);

router.use("/area", authMiddleware.verifyToken, area);
router.use("/block-number", authMiddleware.verifyToken, blockNumber);

router.use("/analytics", authMiddleware.verifyToken, analytics);

router.use("/admission", authMiddleware.verifyToken, admissionStatus);
router.use("/care-people", authMiddleware.verifyToken, carePeople);

router.use("/tolfa-abc-status", authMiddleware.verifyToken, abcStatus);

router.use("/tolfa-status", authMiddleware.verifyToken, status);
router.use("/tolfa-condition", authMiddleware.verifyToken, condition);
router.use("/tolfa-body-score", authMiddleware.verifyToken, bodyScore);

router.use("/color", authMiddleware.verifyToken, color);

router.use("/reports", reports);

router.use("/role", authMiddleware.verifyToken, role);
router.use("/user", user);

module.exports = router;
