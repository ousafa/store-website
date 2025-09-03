import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, createProduct } from "../../loaders/productsLoader.js";

const CreateProduct = () => {
    const navigate = useNavigate();

    // Categories state
    const [categories, setCategories] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
    });

    // Validation errors
    const [errors, setErrors] = useState({});

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset errors

        try {
            const payload = new FormData();
            payload.append("data[attributes][name]", formData.name);
            payload.append("data[attributes][description]", formData.description);
            payload.append("data[attributes][price]", formData.price);
            payload.append("data[attributes][stock]", formData.stock);
            payload.append("data[relationships][category][data][id]", formData.category);

            if (formData.image) {
                payload.append("data[attributes][image]", formData.image);
            }

            await createProduct(payload);
            navigate("/products");
        } catch (err) {
            console.error("Create product error:", err);
            setErrors(err); // err should be backend validation errors
        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <form onSubmit={handleSubmit} className="w-full max-w-lg" encType="multipart/form-data">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Product</h2>

                {/* Error Display */}
                {errors && Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {Object.entries(errors).map(([key, messages]) => (
                            <p key={key}>{messages.join(", ")}</p>
                        ))}
                    </div>
                )}

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

                {/* Image */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Product Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition cursor-pointer"
                    >
                        Create
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
