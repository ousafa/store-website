import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../loaders/categoriesLoader.js";

const CreateCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // reset previous errors

        try {
            const payload = new FormData();
            payload.append("data[attributes][name]", formData.name);
            payload.append("data[attributes][description]", formData.description);

            await createCategory(payload);
            alert("Category created successfully!");
            navigate("/categories");
        } catch (err) {
            // err should be an object from API like { "data.attributes.name": ["The name has already been taken."] }
            setErrors(err);
        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Create New Category
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
                    {errors["data.attributes.name"] && (
                        <p className="text-red-500 mt-2">{errors["data.attributes.name"][0]}</p>
                    )}
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
                    {errors["data.attributes.description"] && (
                        <p className="text-red-500 mt-2">{errors["data.attributes.description"][0]}</p>
                    )}
                </div>

                <div className="flex">
                    <button
                        type="submit"
                        className="bg-violet-600 mr-2 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition cursor-pointer"
                    >
                        Create
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

export default CreateCategory;
