import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

const Home = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const displayName =
    typeof user === "string"
      ? user
      : user?.username || user?.name || user?.email || "User";
  const userInitial = (displayName || "U").charAt(0).toUpperCase();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: PRIMARY, color: ACCENT }}
    >
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full"
        style={{ backgroundColor: ACCENT, opacity: 0.12 }}
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-24 w-96 h-96 rounded-full"
        style={{ backgroundColor: ACCENT, opacity: 0.08 }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between mb-12">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">INVENTRA</h1>

          {!user ? (
            <div className="flex w-full sm:w-auto gap-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg border text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT, color: PRIMARY }}
              >
                Signup
              </button>
            </div>
          ) : (
            <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">
              <div
                className="w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm"
                style={{ borderColor: ACCENT }}
              >
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate max-w-28 sm:max-w-40">{displayName}</p>
                <p className="text-xs font-medium opacity-80">{(role || "USER").toUpperCase()}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="ml-auto sm:ml-0 px-4 py-2 rounded-lg border text-sm font-semibold hover:opacity-90"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                Logout
              </button>
            </div>
          )}
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-3 space-y-6">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
              Inventory Intelligence
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Simple.
              <br />
              Fast.
              <br />
              In Control.
            </h2>
            <p className="text-sm sm:text-base max-w-xl opacity-90">
              Manage products, track stock movement, and monitor low inventory from one place.
              Designed for clear operations with minimal complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT, color: PRIMARY }}
              >
                {user ? "Open Dashboard" : "Get Started"}
              </button>
              <button
                onClick={() => navigate(user ? "/products" : "/login")}
                className="px-6 py-3 rounded-xl border font-bold text-sm sm:text-base hover:opacity-90"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                {user ? "Manage Products" : "Login"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="h-full rounded-2xl border p-5 sm:p-6 flex flex-col justify-between"
              style={{ borderColor: ACCENT }}
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-3 py-3 rounded-lg text-sm font-semibold border hover:opacity-90"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/products")}
                    className="px-3 py-3 rounded-lg text-sm font-semibold border hover:opacity-90"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => navigate("/feedback")}
                    className="px-3 py-3 rounded-lg text-sm font-semibold border hover:opacity-90"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    Feedback
                  </button>
                  <button
                    onClick={() => navigate(user ? "/products" : "/signup")}
                    className="px-3 py-3 rounded-lg text-sm font-semibold hover:opacity-90"
                    style={{ backgroundColor: ACCENT, color: PRIMARY }}
                  >
                    {user ? "Stock" : "Create Account"}
                  </button>
                </div>
              </div>

              {/* <div className="mt-6 border-t pt-4" style={{ borderColor: ACCENT }}>
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">Theme</p>
                <p className="text-sm font-semibold mt-1">Two-Color UI: Navy + Teal</p>
              </div> */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
