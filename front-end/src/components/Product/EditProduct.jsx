import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateProduct, getCategories } from "../../loaders/productsLoader.js";

const EditProduct = () => {
    const productDetails = useLoaderData();
    const product = productDetails.data;
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: product.attributes.name || "",
        description: product.attributes.description || "",
        price: product.attributes.price || "",
        stock: product.attributes.stock || "",
        category: product.relationships.category.data.id || "",
        image: null,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors avant submit

        const payload = new FormData();
        payload.append("_method", "PATCH"); // Laravel method spoofing
        payload.append("data[attributes][name]", formData.name);
        payload.append("data[attributes][description]", formData.description);
        payload.append("data[attributes][price]", formData.price);
        payload.append("data[attributes][stock]", formData.stock);
        payload.append("data[relationships][category][data][id]", formData.category);

        if (formData.image) {
            payload.append("data[attributes][image]", formData.image);
        }

        try {
            await updateProduct(product.id, payload, true); // true = multipart
            navigate("/products");
        }catch (err) {
            setErrors(err);

        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <form onSubmit={handleSubmit} className="w-full max-w-lg" encType="multipart/form-data">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Product</h2>

                {/* Image Preview */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Product Image</label>
                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden mb-2">
                        {formData.image ? (
                            <img src={URL.createObjectURL(formData.image)} alt="preview" className="h-full w-full object-cover" />
                        ) : product.attributes.image ? (
                            <img src={product.attributes.image} alt={product.attributes.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                    </div>
                    <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"/>
                </div>
                {/* Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    />
                </div>

                {/* Price */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    />
                </div>

                {/* Stock */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    />
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.attributes.name}
                            </option>
                        ))}
                    </select>
                </div>

                {errors && Object.keys(errors).length > 0 && (
                    <div className="text-red-500 mt-4 mb-4">
                        {Object.entries(errors).map(([field, messages]) => (
                            <p key={field}>*{Array.isArray(messages) ? messages.join(", ") : messages}</p>
                        ))}
                    </div>
                )}





                <div className="flex justify-between">
                    <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition">Update</button>
                    <button type="button" onClick={() => navigate("/products")} className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
