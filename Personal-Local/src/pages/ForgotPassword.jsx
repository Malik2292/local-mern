import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [userId, setUserId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // // Load userId from localStorage when component mounts
  // useEffect(() => {
  //   const storedUserId = localStorage.getItem("userId");
  //   if (storedUserId) {
  //     setUserId(storedUserId);
  //   }
  // }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        "http://16.171.158.43:3001/auth/auth/password/update",
        {
          _id: userId,
          currentPassword,
          newPassword,
          confirmPassword,
        }
      );

      alert("Password updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Reset Password
      </h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="text"
          placeholder="User ID"
          className="input-field"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Current Password"
          className="input-field mt-3"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="input-field mt-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="input-field mt-3"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        <Link to="/" className="text-indigo-600 hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
