const express = require("express");
const controller = require("./controller");
const middlewares = require("./middlewares");

const router = express.Router();

/* GET */
router.get("/get", controller.getRoles);
/* CREATE */
router.post("/create", controller.createRole);
/* UPDATE */
router.post("/update/:id", controller.updateRole);
/* DELETE */
router.delete("/delete/:id", controller.deleteRole);

module.exports = router;
