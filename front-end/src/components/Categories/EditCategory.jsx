import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateCategory } from "../../loaders/categoriesLoader.js";

const EditCategory = () => {
    const categoryDetails = useLoaderData(); // loader fetches category by id
    const category = categoryDetails.data;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: category.attributes.name || "",
        description: category.attributes.description || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append("_method", "PATCH"); // Laravel method spoofing
            payload.append("data[attributes][name]", formData.name);
            payload.append("data[attributes][description]", formData.description);

            await updateCategory(category.id, payload);
            navigate("/categories");
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Edit Category
                </h2>

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

                <div className="flex">
                    <button
                        type="submit"
                        className="bg-violet-600 mr-2 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition cursor-pointer"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/categories")}
                        className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
