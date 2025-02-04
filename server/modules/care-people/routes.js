const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/", controller.get);
/* CREATE */
router.post("/create", middlewares.duplicate, controller.create);
// /* UPDATE */
// router.put("/update", controller.update);
// /* DELETE */
// router.delete("/delete", controller.delete);

module.exports = router;
