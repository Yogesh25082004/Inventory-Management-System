import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      const responseData = err?.response?.data;
      const status = err?.response?.status;
      const backendMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.message || responseData?.error;
      setError(
        backendMessage ||
          (!err?.response
            ? "Unable to reach signup API from browser (possible CORS/server issue)."
            : "") ||
          (status === 404 ? "Signup API endpoint not found. Check backend auth routes." : "") ||
          "User already exists or invalid data"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: PRIMARY }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 border shadow-2xl"
        style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)", color: ACCENT }}
      >
        <h2 className="text-3xl font-black mb-6 text-center">Create Account</h2>

        {error && (
          <div
            className="text-sm rounded-lg p-3 mb-5 border"
            style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border outline-none"
            style={{
              borderColor: ACCENT,
              backgroundColor: "rgba(11,19,43,0.35)",
              color: ACCENT,
            }}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border outline-none"
            style={{
              borderColor: ACCENT,
              backgroundColor: "rgba(11,19,43,0.35)",
              color: ACCENT,
            }}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border outline-none"
            style={{
              borderColor: ACCENT,
              backgroundColor: "rgba(11,19,43,0.35)",
              color: ACCENT,
            }}
            required
          />

          <button
            className="w-full py-3 rounded-lg font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT, color: PRIMARY }}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <button className="font-semibold hover:opacity-90" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;
