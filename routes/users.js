let express = require("express");
let router = express.Router();
const serviceConfig = require(`../config/serviceConfig`);
const userController = require(`../controller/userController`);
userControllerObj = new userController();

router.get("/:uri/:id?", function(req, res) {
    userControllerObj.execute(req)
        .then((userResponse) => {
            res.status("200").send(userResponse);
        });
});

module.exports = router;