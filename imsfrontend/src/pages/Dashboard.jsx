import { useEffect, useMemo, useState } from "react";
import { getLowStockProducts, getProducts } from "../api/productService";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [productsRes, lowStockRes] = await Promise.all([
          getProducts(),
          getLowStockProducts(),
        ]);
        setProducts(productsRes.data || []);
        setLowStockProducts(lowStockRes.data || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalInventoryValue = products.reduce(
      (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
      0
    );
    const categories = new Set(
      products
        .map((item) => item.category)
        .filter(Boolean)
        .map((item) => String(item).trim())
    );

    return {
      totalProducts,
      totalQuantity,
      totalInventoryValue,
      totalCategories: categories.size,
      lowStockCount: lowStockProducts.length,
    };
  }, [products, lowStockProducts]);

  const topCategories = useMemo(() => {
    const counter = {};
    products.forEach((item) => {
      const key = item.category?.trim() || "Uncategorized";
      counter[key] = (counter[key] || 0) + 1;
    });
    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [products]);

  if (loading) {
    return (
      <div className="p-8" style={{ backgroundColor: PRIMARY, minHeight: "100vh", color: ACCENT }}>
        <p className="text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8" style={{ backgroundColor: PRIMARY, minHeight: "100vh", color: ACCENT }}>
        <div className="p-4 rounded-lg border" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
      <h2 className="text-3xl font-black">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <MetricCard label="Total Products" value={stats.totalProducts} />
        <MetricCard label="Total Quantity" value={stats.totalQuantity} />
        <MetricCard
          label="Inventory Value"
          value={stats.totalInventoryValue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })}
        />
        <MetricCard label="Categories" value={stats.totalCategories} />
        <MetricCard label="Low Stock Items" value={stats.lowStockCount} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
          <h3 className="text-xl font-semibold mb-4">Top Categories</h3>
          {topCategories.length === 0 ? (
            <p className="opacity-80">No category data available.</p>
          ) : (
            <ul className="space-y-3">
              {topCategories.map(([category, count]) => (
                <li
                  key={category}
                  className="flex items-center justify-between border-b pb-2"
                  style={{ borderColor: "rgba(91,192,190,0.25)" }}
                >
                  <span>{category}</span>
                  <span className="text-sm font-semibold px-2 py-1 rounded" style={{ backgroundColor: "rgba(91,192,190,0.2)" }}>
                    {count} products
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border p-6" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
          <h3 className="text-xl font-semibold mb-4">Low Stock Alert</h3>
          {lowStockProducts.length === 0 ? (
            <p className="rounded-lg p-3 border" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}>
              No low-stock items. Inventory levels look healthy.
            </p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg p-3 border"
                  style={{ borderColor: ACCENT, backgroundColor: "rgba(11,19,43,0.25)" }}
                >
                  <span className="font-medium">{item.productName || item.name || "Unnamed Product"}</span>
                  <span className="text-sm font-semibold">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "#5BC0BE", backgroundColor: "rgba(91,192,190,0.08)" }}>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm opacity-90 mt-1">{label}</div>
    </div>
  );
}

export default Dashboard;
