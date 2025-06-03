const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/User");
const { secKey } = require("../../../lib/exports");

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, profileImage } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      profileImage,
    });

    await newAdmin.save();

    const token = jwt.sign(newAdmin._id.toString(), secKey);

    const userResponse = newAdmin.toJSON();
    delete userResponse.password;
    userResponse.token = token;

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: userResponse,
    });
  } catch (error) {
    const message = error.message || "Something went wrong";
    res.status(500).json({ message, success: false });
  }
};

module.exports = {
  signUp,
};
