import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { User, Mail, Lock, Home } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [strengthScore, setStrengthScore] = useState(0);
  const navigate = useNavigate();

  // 👉 เพิ่มฟังก์ชันสำหรับ Google
  const googleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // คำนวณความแข็งแรงของ password
  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setStrengthScore(calculateStrength(pwd));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (strengthScore < 3) {
      setError("Password too weak. Please make it stronger.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      alert("Register success! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  };

  const getStrengthLabel = () => {
    if (strengthScore === 0) return "";
    if (strengthScore <= 2) return "Weak";
    if (strengthScore === 3) return "Medium";
    if (strengthScore === 4) return "Strong";
    return "Very Strong";
  };

  const getStrengthColor = () => {
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore === 3) return "bg-yellow-500";
    if (strengthScore === 4) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-orange-100"
      >
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto h-16 w-16 mb-2" />
          <h2 className="text-3xl font-bold text-orange-500">สมัครสมาชิก</h2>
          <p className="text-gray-500 text-sm mt-1">สร้างบัญชีใหม่</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* First Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="First Name"
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Last Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        {/* Password Strength */}
        {password && (
          <div className="mb-3">
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${getStrengthColor()}`}
                style={{ width: `${(strengthScore / 5) * 100}%` }}
              ></div>
            </div>
            <p
              className={`text-sm mt-1 ${
                strengthScore <= 2
                  ? "text-red-500"
                  : strengthScore === 3
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {getStrengthLabel()} Password
            </p>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
        >
          สมัครสมาชิก
        </button>

        {/* Google Button */}
        <button
          type="button"
          onClick={googleLogin}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 
                     bg-red-500 text-white font-medium rounded-lg shadow-md 
                     hover:bg-red-600 hover:scale-105 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          สมัคร / เข้าสู่ระบบด้วย Google
        </button>

        {/* Back Home Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 
                     bg-white text-orange-700 font-medium rounded-lg shadow-md border border-orange-200 
                     hover:bg-orange-50 hover:scale-105 transition"
        >
          <Home className="w-5 h-5" />
          กลับหน้าแรก
        </button>

        {/* Back to Login */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          มีบัญชีอยู่แล้ว?{" "}
          <span
            className="text-orange-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            เข้าสู่ระบบ
          </span>
        </p>
      </form>
    </div>
  );
}
