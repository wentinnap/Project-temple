import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Home } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);

      // Redirect ตาม role
      if (res.data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-orange-100"
      >
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <img
            src={logo}
            alt="โลโก้วัดกำแพง"
            className="mx-auto h-16 w-16 mb-2"
          />
          <h2 className="text-3xl font-bold text-orange-500">เข้าสู่ระบบ</h2>
          <p className="text-gray-500 text-sm mt-1">ยินดีต้อนรับกลับมา</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
        >
          เข้าสู่ระบบ
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



        {/* Register Link */}
        <p className="text-sm text-gray-600 mt-4 text-center">
          ยังไม่มีบัญชี?{" "}
          <span
            className="text-orange-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            สมัครสมาชิก
          </span>
        </p>

      </form>
    </div>
  );
}
