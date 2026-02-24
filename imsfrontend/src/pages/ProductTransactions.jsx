import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api/productService";
import { createProductTransaction, getProductTransactions } from "../api/transactionService";
import { useAuth } from "../auth/AuthContext";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function ProductTransactions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const isAdmin = role === "ADMIN";

  const [product, setProduct] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    transactionType: "IN",
    quantity: "",
    note: "",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productRes, transactionRes] = await Promise.all([
        getProductById(id),
        getProductTransactions(id),
      ]);
      setProduct(productRes.data);
      setTransactions(transactionRes.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load stock transaction data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const quantity = Number(form.quantity);
    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Please provide a valid non-negative quantity");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await createProductTransaction(id, {
        transactionType: form.transactionType,
        quantity,
        note: form.note,
        createdBy: user?.username || user?.name || "system",
      });
      setForm({ transactionType: "IN", quantity: "", note: "" });
      await loadData();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to save transaction"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
        <p className="animate-pulse">Loading stock transactions...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
        <p>Product not found.</p>
      </div>
    );
  }

  const inputStyle = {
    borderColor: ACCENT,
    backgroundColor: "rgba(11,19,43,0.35)",
    color: ACCENT,
  };

  return (
    <div className="p-8 space-y-6 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black">Stock Transactions</h2>
          <p className="mt-1">
            {product.productName || product.name} | Current Qty:{" "}
            <span className="font-semibold">{product.quantity}</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 rounded-lg border hover:opacity-90"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          Back to Products
        </button>
      </div>

      {error && (
        <div className="rounded-lg p-3 border" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}>
          {error}
        </div>
      )}

      {isAdmin ? (
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
          style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Type</label>
            <select
              name="transactionType"
              value={form.transactionType}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              style={inputStyle}
            >
              <option value="IN">IN (Add Stock)</option>
              <option value="OUT">OUT (Remove Stock)</option>
              <option value="ADJUSTMENT">ADJUSTMENT (Set New Qty)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              style={inputStyle}
              min="0"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Note</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={onChange}
              className="w-full border rounded-lg px-3 py-2"
              style={inputStyle}
              placeholder="Optional reason/comment"
            />
          </div>
          <div className="md:col-span-4">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor: ACCENT, color: PRIMARY }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Add Transaction"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-lg p-3 border" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}>
          You have view-only access to stock history.
        </div>
      )}

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ backgroundColor: "rgba(91,192,190,0.2)" }} className="text-xs uppercase tracking-wider">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Before</th>
              <th className="px-4 py-3">After</th>
              <th className="px-4 py-3">By</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td className="px-4 py-4 opacity-80" colSpan={7}>
                  No transactions found for this product.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b" style={{ borderColor: "rgba(91,192,190,0.25)" }}>
                  <td className="px-4 py-3 text-sm">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: "rgba(91,192,190,0.2)" }}>
                      {tx.transactionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{tx.quantity}</td>
                  <td className="px-4 py-3">{tx.quantityBefore}</td>
                  <td className="px-4 py-3">{tx.quantityAfter}</td>
                  <td className="px-4 py-3">{tx.createdBy || "-"}</td>
                  <td className="px-4 py-3">{tx.note || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductTransactions;
