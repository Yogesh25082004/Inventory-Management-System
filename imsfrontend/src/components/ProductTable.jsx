const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function ProductTable({ products, onEdit, onDelete, onStock, canManage = true }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border rounded-xl" style={{ color: ACCENT, borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm opacity-80">Add a product to get started.</p>
      </div>
    );
  }

  const buttonStyle = {
    backgroundColor: "rgba(91,192,190,0.2)",
    border: `1px solid ${ACCENT}`,
    color: ACCENT,
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border" style={{ borderColor: ACCENT, backgroundColor: "rgba(91,192,190,0.08)" }}>
      <table className="w-full text-left" style={{ color: ACCENT }}>
        <thead>
          <tr style={{ backgroundColor: "rgba(91,192,190,0.18)" }} className="uppercase text-xs tracking-wider">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Qty</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">{canManage ? "Actions" : "Access"}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b" style={{ borderColor: "rgba(91,192,190,0.25)" }}>
              <td className="py-3 px-4">{p.productName || p.name || "Unnamed Product"}</td>
              <td className="py-3 px-4">{p.quantity}</td>
              <td className="py-3 px-4 font-semibold">{p.price}</td>
              <td className="py-3 px-4">
                {canManage ? (
                  <div className="flex gap-2">
                    <button onClick={() => onStock && onStock(p.id)} className="rounded-lg px-3 py-1 text-sm font-medium transition-colors hover:opacity-90" style={buttonStyle}>
                      Stock
                    </button>
                    <button onClick={() => onEdit(p.id)} className="rounded-lg px-3 py-1 text-sm font-medium transition-colors hover:opacity-90" style={buttonStyle}>
                      Edit
                    </button>
                    <button onClick={() => onDelete(p.id)} className="rounded-lg px-3 py-1 text-sm font-medium transition-colors hover:opacity-90" style={buttonStyle}>
                      Delete
                    </button>
                  </div>
                ) : (
                  <button onClick={() => onStock && onStock(p.id)} className="rounded-lg px-3 py-1 text-sm font-medium transition-colors hover:opacity-90" style={buttonStyle}>
                    View Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
