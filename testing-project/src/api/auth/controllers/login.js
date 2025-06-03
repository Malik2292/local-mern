const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { secKey } = require("../../../lib/exports");
const { loginValidation } = require("../../../validation");
const { User } = require("../../../models/User");

const login = async (req, res) => {
  try {
    const { error, value } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false,
        user: null,
      });
    }

    const searchKey = value.email.toLowerCase();

    const user = await User.findOne({
      email: { $regex: new RegExp("^" + searchKey + "$", "i") },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
        user: null,
      });
    }

    const passCheck = await bcrypt.compare(value.password, user.password);
    if (!passCheck) {
      return res.status(400).json({
        success: false,
        message: "Wrong password. Please try again.",
        user: null,
      });
    }

    const token = jwt.sign({ id: user._id.toString() }, secKey);
    const localUser = user.toJSON();
    delete localUser.password;
    localUser.token = token;

    res.json({
      success: true,
      message: "Logged in successfully!",
      user: localUser,
    });
  } catch (error) {
    const message = error.message || "We are working to fix this problem";
    res.status(500).json({ message, user: null, success: false });
  }
};

module.exports = {
  login,
};
