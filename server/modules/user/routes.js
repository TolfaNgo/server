const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/", controller.getAllUsers);
/* GET bvy :ID */
// router.get("/:id", controller.getUsers);
/* CREATE */
router.post("/create", controller.createUser);
/* UPDATE */
router.post("/update/:id", controller.updateUser);
/* DELETE */
router.delete("/delete/:id", controller.deleteUser);

module.exports = router;
