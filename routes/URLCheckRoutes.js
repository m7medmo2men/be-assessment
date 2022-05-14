const router = require("express").Router();
const URLCheckController = require("../controllers/URLCheckController");
const { verifyToken } = require("../controllers/authController");

router.use(verifyToken);

router
    .get("/:id", URLCheckController.getCheck)
    .post("/", URLCheckController.createCheck)
    .put("/:id", URLCheckController.updateCheck)
    .delete("/:id", URLCheckController.deleteCheck);

module.exports = router;
