import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddEditProduct from "./pages/AddEditProduct";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProductTransactions from "./pages/ProductTransactions";

const noNavbarRoutes = ["/", "/login", "/signup", "/home"];

function App() {
  const location = useLocation();
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/products">
              <AddEditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/products">
              <AddEditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/transactions"
          element={
            <ProtectedRoute>
              <ProductTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;
