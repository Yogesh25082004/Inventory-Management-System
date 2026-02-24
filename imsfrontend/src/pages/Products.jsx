import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/productService";
import ProductTable from "../components/ProductTable";
import { useAuth } from "../auth/AuthContext";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { role } = useAuth();
  const canManageProducts = role === "ADMIN";

  const loadProducts = () => {
    getProducts().then((res) => setProducts(res.data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id) => {
    deleteProduct(id).then(() => loadProducts());
  };

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black">Products</h2>

        {canManageProducts && (
          <button
            onClick={() => navigate("/add-product")}
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90 cursor-pointer border"
            style={{ backgroundColor: ACCENT, color: PRIMARY, borderColor: ACCENT }}
          >
            Add Product
          </button>
        )}
      </div>

      <ProductTable
        products={products}
        canManage={canManageProducts}
        onStock={(productId) => navigate(`/products/${productId}/transactions`)}
        onEdit={canManageProducts ? (id) => navigate(`/products/edit/${id}`) : undefined}
        onDelete={canManageProducts ? handleDelete : undefined}
      />
    </div>
  );
}

export default Products;
