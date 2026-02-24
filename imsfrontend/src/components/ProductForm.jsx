import { useEffect, useState } from "react";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

const ProductForm = ({ initialData = null, onSubmit, loading = false }) => {
  const [product, setProduct] = useState({
    productName: "",
    category: "",
    quantity: "",
    price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setProduct({
        productName: initialData.productName || "",
        category: initialData.category || "",
        quantity: initialData.quantity ?? "",
        price: initialData.price ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!product.productName || !product.quantity || !product.price || !product.category) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      productName: product.productName.trim(),
      category: product.category.trim(),
      quantity: Number(product.quantity),
      price: Number(product.price),
    };

    if (Number.isNaN(payload.quantity) || Number.isNaN(payload.price)) {
      setError("Quantity and Price must be valid numbers.");
      return;
    }

    onSubmit(payload);
  };

  const inputStyle = {
    borderColor: ACCENT,
    backgroundColor: "rgba(11,19,43,0.35)",
    color: ACCENT,
  };

  return (
    <div className="rounded-2xl border p-6" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
      <form onSubmit={handleSubmit} className="space-y-4" style={{ color: ACCENT }}>
        {error && (
          <div className="rounded-lg p-3 text-sm border" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.12)" }}>
            {error}
          </div>
        )}

        <Field label="Product Name">
          <input
            type="text"
            name="productName"
            className="w-full border rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            value={product.productName}
            onChange={handleChange}
            placeholder="Enter product name"
          />
        </Field>

        <Field label="Category">
          <input
            type="text"
            name="category"
            className="w-full border rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            value={product.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </Field>

        <Field label="Quantity">
          <input
            type="number"
            name="quantity"
            className="w-full border rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            value={product.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
          />
        </Field>

        <Field label="Price">
          <input
            type="number"
            name="price"
            className="w-full border rounded-lg px-4 py-2.5 outline-none"
            style={inputStyle}
            value={product.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </Field>

        <button
          type="submit"
          className="w-full font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 hover:opacity-90"
          style={{ backgroundColor: ACCENT, color: PRIMARY }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {children}
    </div>
  );
}

export default ProductForm;
