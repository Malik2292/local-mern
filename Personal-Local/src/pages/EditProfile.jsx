import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // 👇 Replace with your actual token management
  const token = localStorage.getItem("token");

  // 🔹 Fetch profile details on mount
  useEffect(() => {
    axios
      .patch(
        "http://16.171.158.43:3001/auth/auth/profile",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        const data = res.data.data; // Adjust if response format is different
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
      })
      .catch((err) => {
        alert("Failed to load profile");
      });
  }, []);

  // 🔄 Save profile changes
  const handleSave = () => {
    axios
      .put(
        "http://16.171.158.43:3001/auth/auth/profile",
        {
          first_name: firstName,
          last_name: lastName,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Profile updated successfully!");
      })
      .catch(() => {
        alert("Error updating profile");
      });
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Edit Profile
      </h2>

      <input
        type="text"
        placeholder="First Name"
        className="input-field"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Last Name"
        className="input-field"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone"
        className="input-field"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="email"
        value={email}
        disabled
        className="input-field bg-gray-100 cursor-not-allowed"
      />

      <button className="btn-primary w-full mt-4" onClick={handleSave}>
        Save Changes
      </button>

      <p className="text-sm mt-4 text-center">
        <Link to="/" className="text-indigo-600 hover:underline">
          Logout
        </Link>
      </p>
    </div>
  );
}
