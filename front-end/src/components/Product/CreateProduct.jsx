import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, createProduct } from "../../loaders/productsLoader.js";

const CreateProduct = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null, // image starts as null
    });

    const [errors, setErrors] = useState({});

    // =============================
    // Fetch categories on component mount
    // =============================
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


    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // If input is "image", store the uploaded file
        if (name === "image") {
            setFormData({ ...formData, image: files[0] });
        } else {
            // Otherwise update normal field
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

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

            // Call API
            await createProduct(payload);

            navigate("/products");
        } catch (err) {
            console.error("Create product error:", err);

            setErrors(err);
        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg"
                encType="multipart/form-data"
            >
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Create Product
                </h2>

                {/* =============================
                    Name
                ============================= */}
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

                {/* Display error if API returns validation issue */}
                {errors["data.attributes.name"] && (
                    <p className="text-red-500 mt-1">
                        {errors["data.attributes.name"][0]}
                    </p>
                )}

                {/* =============================
                    Description
                ============================= */}
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

                {/* Display error if API returns validation issue */}
                {errors["data.attributes.description"] && (
                    <p className="text-red-500 mt-1">
                        {errors["data.attributes.description"][0]}
                    </p>
                )}

                {/* =============================
                    Price
                ============================= */}
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
                {/* Display error if API returns validation issue */}
                {errors["data.attributes.price"] && (
                    <p className="text-red-500 mt-1">
                        {errors["data.attributes.price"][0]}
                    </p>
                )}

                {/* =============================
                    Stock
                ============================= */}
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
                {/* Display error if API returns validation issue */}
                {errors["data.attributes.stock"] && (
                    <p className="text-red-500 mt-1">
                        {errors["data.attributes.stock"][0]}
                    </p>
                )}

                {/* =============================
                    Category
                ============================= */}
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
                {/* Display error if API returns validation issue */}
                {errors["data.includes.category.id"] && (
                    <p className="text-red-500 mt-1">
                        {errors["data.attributes.category.id"][0]}
                    </p>
                )}

                {/* =============================
                    Image Upload
                ============================= */}
                <div className="mb-2">
                    <label className="block text-gray-700 mb-2">Product Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    />
                </div>
                {/* Display error if API returns validation issue */}
                {errors["data.attributes.image"] && (
                    <p className="text-red-500 mt-1">
                        {errors["data.attributes.image"][0]}
                    </p>
                )}

                {/* =============================
                    Buttons
                ============================= */}
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
