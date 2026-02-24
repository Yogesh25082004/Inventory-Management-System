import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { useAuth } from "../auth/AuthContext";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: credentials.usernameOrEmail,
        email: credentials.usernameOrEmail,
        password: credentials.password,
      };
      const res = await loginUser(payload);
      const responseData = res?.data;
      const authToken = responseData?.token || responseData?.accessToken || responseData?.jwt || null;
      const apiUser = res?.data?.user;
      const userData =
        apiUser && typeof apiUser === "object"
          ? { ...apiUser, role: (apiUser.role || responseData?.role || "USER").toUpperCase() }
          : {
              username: credentials.usernameOrEmail,
              name: credentials.usernameOrEmail,
              role: (responseData?.role || "USER").toUpperCase(),
            };
      login(userData, authToken);
      navigate("/dashboard");
    } catch (err) {
      const responseData = err?.response?.data;
      const backendMessage =
        typeof responseData === "string"
          ? responseData
          : responseData?.message || responseData?.error;
      setError(
        backendMessage ||
          (!err?.response
            ? "Unable to reach login API from browser (possible CORS/server issue)."
            : "") ||
          "Invalid username/email or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: PRIMARY }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 border shadow-2xl"
        style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)", color: ACCENT }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black">Welcome Back</h2>
          <p className="text-sm mt-2 opacity-80">Sign in to continue</p>
        </div>

        {error && (
          <div
            className="text-sm rounded-lg p-3 mb-5 border"
            style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Username or Email</label>
            <input
              name="usernameOrEmail"
              value={credentials.usernameOrEmail}
              onChange={handleChange}
              required
              placeholder="Enter username or email"
              className="w-full rounded-lg px-4 py-3 border outline-none"
              style={{
                borderColor: ACCENT,
                backgroundColor: "rgba(11,19,43,0.35)",
                color: ACCENT,
              }}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full rounded-lg px-4 py-3 border outline-none"
              style={{
                borderColor: ACCENT,
                backgroundColor: "rgba(11,19,43,0.35)",
                color: ACCENT,
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: ACCENT, color: PRIMARY }}
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <button onClick={() => navigate("/signup")} className="font-semibold hover:opacity-90">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
