import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

const navLinks = [
  { path: "/home", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/products", label: "Products" },
  { path: "/feedback", label: "Feedback" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName =
    typeof user === "string"
      ? user
      : user?.username || user?.name || user?.email || "User";

  const roleLabel =
    (typeof user === "object" && user?.role ? String(user.role) : "USER").toUpperCase();

  const userInitial = (displayName || "U").charAt(0).toUpperCase();

  return (
    <nav
      className="sticky top-0 z-50 shadow-lg border-b"
      style={{ backgroundColor: PRIMARY, borderColor: ACCENT }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/home" className="text-xl font-bold tracking-wide hover:opacity-90" style={{ color: ACCENT }}>
          Inventra
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{
                color: ACCENT,
                backgroundColor:
                  location.pathname === link.path ? "rgba(91,192,190,0.20)" : "transparent",
                border: "1px solid rgba(91,192,190,0.35)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="w-px h-6 mx-2" style={{ backgroundColor: ACCENT, opacity: 0.4 }} />

          <div
            className="w-9 h-9 rounded-full border flex items-center justify-center font-semibold text-sm"
            style={{ color: ACCENT, borderColor: ACCENT }}
          >
            {userInitial}
          </div>
          <span className="text-sm max-w-28 truncate" style={{ color: ACCENT }}>
            {displayName}
          </span>
          <span
            className="px-2 py-1 rounded-md text-xs font-semibold"
            style={{ backgroundColor: "rgba(91,192,190,0.2)", color: ACCENT }}
          >
            {roleLabel}
          </span>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-90"
            style={{
              color: ACCENT,
              border: "1px solid rgba(91,192,190,0.35)",
              backgroundColor: "rgba(91,192,190,0.12)",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
