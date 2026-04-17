import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import upload_icon from "../../assets/upload_icon.png";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const EditProduct = () => {
  const { axios, fetchBooks } = useContext(ShopContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("350");
  const [offerPrice, setOfferPrice] = useState("120");
  const [category, setCategory] = useState("Academic");
  const [popular, setPopular] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.post("/api/product/single", { productId: id });
        if (data.success) {
          const product = data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setOfferPrice(product.offerPrice);
          setCategory(product.category);
          setPopular(product.popular);
          setCurrentImages(product.image || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, axios]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const productData = {
        productId: id,
        name,
        description,
        category,
        price,
        offerPrice,
        popular
      };
      const formData = new FormData();

      formData.append("productData", JSON.stringify(productData));
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      const { data } = await axios.post("/api/product/update", formData);
      if (data.success) {
        toast.success("Product updated successfully!");
        fetchBooks();
        navigate('/admin/list');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll w-full lg:w-4/5 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll w-full lg:w-4/5 rounded-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaEdit className="text-secondary" />
          Edit Product
        </h1>
        <p className="text-gray-600 mt-2">Update the product details below</p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter product name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={4}
              placeholder="Enter product description..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors resize-vertical"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors bg-white"
            >
              <option value="Academic">Academic</option>
              <option value="Children">Children</option>
              <option value="Health">Health</option>
              <option value="Horror">Horror</option>
              <option value="Business">Business</option>
              <option value="History">History</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Price
            </label>
            <input
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              type="number"
              placeholder="120"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              min="0"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            {currentImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="flex flex-wrap gap-2">
                  {currentImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Current ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                  ))}
                </div>
              </div>
            )}
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary transition-colors">
                <img
                  src={files.length > 0 ? URL.createObjectURL(files[0]) : upload_icon}
                  alt="Upload"
                  className="w-12 h-12"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {files.length > 0 ? `${files.length} file(s) selected` : "Click to upload new images"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </label>
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              type="file"
              name="image"
              id="file-input"
              hidden
              multiple
              accept="image/*"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Popular Product</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md"
          >
            <FaSave />
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/list')}
            className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
