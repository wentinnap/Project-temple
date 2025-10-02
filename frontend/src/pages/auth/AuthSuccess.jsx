import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthSuccess() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [doneLogin, setDoneLogin] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        // ✅ decode JWT
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded payload:", payload);

        const newUser = {
          id: payload.id,
          email: payload.email,
          first_name: payload.first_name || "",
          last_name: payload.last_name || "",
          role: payload.role || "user",
          status: payload.status || "active",
        };

        // ✅ เก็บ user + token
        login(newUser, token);
        setDoneLogin(true); // mark ว่า login เสร็จแล้ว
      } catch (err) {
        console.error("Token decode error:", err, token);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [login, navigate]);

  // ✅ พอ user update แล้วค่อย navigate
  useEffect(() => {
    if (doneLogin && user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [doneLogin, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-600">กำลังเข้าสู่ระบบด้วย Google...</p>
    </div>
  );
}
