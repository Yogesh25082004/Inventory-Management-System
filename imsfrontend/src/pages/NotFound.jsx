import { Link } from "react-router-dom";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: PRIMARY, color: ACCENT }}
    >
      <h1 className="text-9xl font-black opacity-25">404</h1>
      <h2 className="text-2xl font-semibold mt-3">Page Not Found</h2>
      <p className="mt-2 opacity-80">The page you are looking for does not exist.</p>
      <Link
        to="/home"
        className="mt-6 px-6 py-2.5 rounded-lg font-semibold border hover:opacity-90"
        style={{ borderColor: ACCENT, color: ACCENT }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
