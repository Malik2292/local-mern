const express = require("express");

const { login } = require("./controllers/login");
const { signUp } = require("./controllers/signUp");
const { editProfile } = require("./controllers/editProfile");
const { changePassword } = require("./controllers/changePassword");

const router = express.Router();

router.post("/login", login);
router.patch("/password/update", changePassword);
router.post("/signUp", signUp);
router.patch("/edit/:userId", editProfile);

module.exports = router;
