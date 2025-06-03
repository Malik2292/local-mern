const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/User");
const { secKey } = require("../../../lib/exports");

const editProfile = async (req, res) => {
  try {
    const { userId } = req.params; // You can also extract from token middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID provided",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { firstName, lastName, phone, password, profileImage } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: userResponse,
    });
  } catch (error) {
    const message = error.message || "Something went wrong";
    res.status(500).json({ message, success: false });
  }
};

module.exports = {
  editProfile,
};
