import React, { useState, useEffect } from "react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { createProduct, getCategories } from "../../loaders/productsLoader";

const Create = () => {
    const navigate = useNavigate();
    const revalidator = useRevalidator(); // loader revalidation

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") setFormData({ ...formData, image: files[0] });
        else setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        data.append("category_id", formData.category);
        if (formData.image) data.append("image", formData.image);

        try {
            await createProduct(data, true); // true = formData
            revalidator.revalidate(); // refresh product list
            navigate("/products"); // optionally redirect
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Create Product
            </h2>
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
            <button
                type="submit"
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition cursor-pointer"
            >
                Create Product
            </button>
        </form>
    );
};

export default Create;
