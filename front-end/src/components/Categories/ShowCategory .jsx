import React from 'react';
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

const ShowCategory = () => {
    const categoryDetails = useLoaderData();
    const category = categoryDetails.data;
    const navigate = useNavigate();

    if (!category) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <p className="text-gray-500 text-lg">Category not found.</p>
            </div>
        );
    }

    const handleEdit = () => {
        navigate(`/categories/${category.id}/edit`);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            console.log("Delete category", category.id);
            // Call delete API here
        }
    };

    return (
        <div className="px-6 py-10 max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Category Page</h1>
                <p className="text-gray-600 text-lg">Here are the details of the selected category.</p>
            </div>

            {/* Category Section */}
            <div className="prose lg:prose-xl mx-auto bg-white shadow rounded p-6">

                {/* Catgeory Info */}
                <h2 className="text-3xl font-bold mb-2">{category.attributes.name}</h2>
                <p className="text-gray-700 mb-4">{category.attributes.description}</p>
                <p className="text-gray-500 text-sm mb-1">
                    Created at: {new Date(category.attributes.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    Updated at: {new Date(category.attributes.udpatedAt).toLocaleDateString()}
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
                    <Link to="/categories">
                        <button className="bg-white text-black border border-gray-300 px-6 py-2 rounded hover:bg-black hover:text-white transition">
                            Go Back
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShowCategory;
