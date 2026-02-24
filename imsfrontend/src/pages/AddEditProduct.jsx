import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct, getProductById, updateProduct } from "../api/productService";

const PRIMARY = "#F8FAFC";
const ACCENT = "#111827";

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      navigate("/products");
    } catch (error) {
      console.error("SAVE FAILED:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="max-w-2xl mx-auto p-8 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 min-h-screen" style={{ backgroundColor: PRIMARY, color: ACCENT }}>
      <h2 className="text-3xl font-black mb-6">{id ? "Edit Product" : "Add Product"}</h2>
      <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default AddEditProduct;
