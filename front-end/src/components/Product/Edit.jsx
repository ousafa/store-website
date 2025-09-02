import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateProduct, getCategories } from "../../loaders/productsLoader.js";

const Edit = () => {
    const productDetails = useLoaderData();
    const product = productDetails.data;
    const navigate = useNavigate();

    // Categories state
    const [categories, setCategories] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        name: product.attributes.name || "",
        description: product.attributes.description || "",
        price: product.attributes.price || "",
        stock: product.attributes.stock || "",
        category: product.relationships.category.data.id || "",
        // image:product.attributes.image || "",
    });

    useEffect(() => {
        // Fetch categories for select dropdown
        const fetchCategories = async () => {
            try {
                const data = await getCategories(); // should return array of categories
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({ ...formData, image: files[0] }); // store file
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = new FormData();
            // payload.append("_method", "PATCH"); // Laravel trick
            payload.append("name", formData.name);
            payload.append("description", formData.description);
            payload.append("price", formData.price);
            payload.append("stock", formData.stock);
            payload.append("category_id", formData.category);

            // Add image if selected
            // if (formData.image instanceof File) {
            //     payload.append("image", formData.image);
            // }

            await updateProduct(product.id, payload);
            navigate("/products");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };



    return (
        <div className="flex justify-center mt-10 mb-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg"
                // encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Edit Product
                </h2>

                {/* Image */}
                {/*<div className="mb-6">*/}
                {/*    <label className="block text-gray-700 mb-2">Product Image</label>*/}
                {/*    <input*/}
                {/*        type="file"*/}
                {/*        name="image"*/}
                {/*        accept="image/*"*/}
                {/*        onChange={handleChange}*/}
                {/*        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"*/}
                {/*    />*/}
                {/*</div>*/}
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


                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition cursor-pointer"
                    >
                        Update
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

export default Edit;
