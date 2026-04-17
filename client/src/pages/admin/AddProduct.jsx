import React, { useContext, useState } from "react";
import upload_icon from "../../assets/upload_icon.png";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

const AddProduct = () => {
  const {axios} = useContext(ShopContext)
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("350");
  const [offerPrice, setOfferPrice] = useState("120");
  const [category, setCategory] = useState("Academic");
  const [popular, setPopular] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const productData = {
        name,
        description,
        category,
        price,
        offerPrice,
        popular
      }
      const formData = new FormData()
      
      formData.append("productData", JSON.stringify(productData))
      for (let i = 0; i < files.length; i++){
        formData.append("images",files[i])
      }

      const { data } = await axios.post("/api/product/add", formData)
      if (data.success) {
        toast.success(data.message)
        setName("")
        setDescription("");
        setFiles([])
        setPrice("350")
        setOfferPrice("120")
        setCategory("Academic")
        setPopular(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <div className="px-2 sm:px-6 py-12 m-2 h-[97vh] bg-primary overflow-y-scroll w-full lg:w-4/5 rounded-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaPlus className="text-secondary" />
          Add New Product
        </h1>
        <p className="text-gray-600 mt-2">Fill in the details below to add a new product to your catalog</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className="cursor-pointer"
                  >
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary transition-colors flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                      <img
                        src={
                          files[index]
                            ? URL.createObjectURL(files[index])
                            : upload_icon
                        }
                        alt={`Upload ${index + 1}`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      type="file"
                      id={`image${index}`}
                      hidden
                      accept="image/*"
                    />
                  </label>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Click on any box to upload images (PNG, JPG up to 10MB)</p>
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

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
          >
            <FaPlus />
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
