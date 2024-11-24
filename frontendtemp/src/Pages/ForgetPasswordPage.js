import React, { useState } from "react";
import { forgotPassword, verifyOTP, resetPassword } from "../Services/forgetPasswordServices";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState(null); // OTP state as a number
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [otpBoxVisible, setOtpBoxVisible] = useState(false);
  const [resetBoxVisible, setResetBoxVisible] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (email && role) {
      try {
        const response = await forgotPassword(email, role);
        alert(response.message); // Notify user
        setOtpBoxVisible(true); // Show OTP box
      } catch (error) {
        alert(error.message || "Failed to send OTP. Please try again.");
      }
    } else {
      alert("Please fill in both fields.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === null) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await verifyOTP(email, role, otp);
      alert(response.message); // Notify user
      setOtpBoxVisible(false); // Hide OTP box
      setResetBoxVisible(true); // Show password reset box
    } catch (error) {
      alert(error.message || "Failed to verify OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const response = await resetPassword(email, role, newPassword);
      alert(response.message); // Notify user
      // Optionally, redirect to login page here
    } catch (error) {
      alert(error.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      {!otpBoxVisible && !resetBoxVisible && (
        // Initial form to request OTP
        <form onSubmit={handleSendOtp}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="tourist">Tourist</option>
            <option value="tourGuide">Tour Guide</option>
            <option value="tourismGovernor">Tourism Governor</option>
            <option value="seller">Seller</option>
            <option value="advertiser">Advertiser</option>
          </select>

          <button type="submit" className="btn">
            Send OTP
          </button>
        </form>
      )}

      {otpBoxVisible && (
        // OTP verification box
        <div className="otp-box">
          <h3>Enter OTP</h3>
          <input
            type="number" // Changed input type to "number"
            value={otp !== null ? otp : ""} // Display empty string if OTP is null
            onChange={(e) => setOtp(Number(e.target.value))} // Convert input to number
            placeholder="Enter your OTP"
            required
          />
          <button onClick={handleVerifyOtp} className="btn">
            Verify OTP
          </button>
        </div>
      )}

      {resetBoxVisible && (
        // Password reset form
        <div className="reset-box">
          <h3>Reset Password</h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <button onClick={handleResetPassword} className="btn">
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgetPasswordPage;
