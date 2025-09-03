import React from 'react';
import {
    useLoaderData,
    useNavigate,
    Link,
    useRevalidator
} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {
    deleteProduct
} from "../../loaders/productsLoader.js";

const Show = () => {
    const productDetails = useLoaderData();
    const product = productDetails.data;
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    if (!product) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <p className="text-gray-500 text-lg">Product not found.</p>
            </div>
        );
    }

    const handleEdit = () => {
        navigate(`/products/${product.id}/edit`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await deleteProduct(id);
            alert("Product deleted successfully!");
            revalidator.revalidate(); // refresh loader data
        } catch (error) {
            console.error(error);
            alert("Failed to delete product.");
        }
    };

    return (
        <div className="px-6 py-10 max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Page</h1>
                <p className="text-gray-600 text-lg">Here are the details of the selected product.</p>
            </div>

            {/* Product Blog Section */}
            <div className="prose lg:prose-xl mx-auto bg-white shadow rounded p-6">
                {/* Product Image */}
                {product.attributes.image && (
                    <img
                        src={product.attributes.image}
                        alt={product.attributes.name}
                        className="w-full h-auto rounded mb-6"
                    />
                )}

                {/* Product Info */}
                <h2 className="text-3xl font-bold mb-2">{product.attributes.name}</h2>
                <p className="text-gray-700 mb-4">{product.attributes.description}</p>
                <p className="text-violet-800 font-semibold mb-2">Price: ${product.attributes.price}</p>
                <p className="text-gray-600 mb-1">Stock: {product.attributes.stock}</p>
                <p className="text-gray-600 mb-1">
                    Category: <span className="font-semibold">{product.includes.attributes.name}</span>
                </p>
                <p className="text-gray-500 text-sm mb-1">
                    Created at: {new Date(product.attributes.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    Updated at: {new Date(product.attributes.udpatedAt).toLocaleDateString()}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-4">
                    <Button
                        onClick={handleEdit}
                        variant="contained"
                        color="success"
                        startIcon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </div>
                <div className="flex justify-end gap-2 ">
                    <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                        Order Now
                    </button>
                    <Link to="/products">
                        <button className="bg-white text-black border border-gray-300 px-6 py-2 rounded hover:bg-black hover:text-white transition">
                            Go Back
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Show;
