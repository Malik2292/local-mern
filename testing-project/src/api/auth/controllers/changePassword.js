const bcrypt = require("bcrypt");
const { User } = require("../../../models/User");

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // 👈 from JWT middleware

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Please include "current", "new", and "confirm" password.',
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password should be the same.",
        success: false,
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this ID.",
        user: null,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong current password. Please try again.",
        user: null,
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    const message = error.message || "We are working to fix this problem";
    res.status(500).json({ message, user: null, success: false });
  }
};

module.exports = {
  changePassword,
};
