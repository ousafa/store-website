import React from "react";
import { useLoaderData, Link, useNavigate, useRevalidator} from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';


const Categories = () => {
    const categoryData = useLoaderData();
    const categories = categoryData.data || [];
    const navigate = useNavigate();
    // const revalidator = useRevalidator(); // hook to revalidate loader


    const handleEdit = (categoyId) => {
        navigate(`/categories/${categoyId}/edit`);
    };

    const handleDelete = async () => {
        (window.confirm("Are you sure you want to delete this product?"));

        // try {
        //     await deleteProduct(id);
        //     alert("Product deleted successfully!");
        //     revalidator.revalidate(); // refresh loader data
        // } catch (error) {
        //     console.error(error);
        //     alert("Failed to delete product.");
        // }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Categories Page
                </h1>
                <p className="text-gray-600 text-lg mb-6 text-center">
                    List of current Categories.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">

                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="rounded-lg shadow hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col bg-white overflow-hidden"
                    >

                        {/* category Info */}
                        <div className="p-4 flex flex-col gap-2">
                            <Link to={`/categories/${category.id}`}>
                                <h4 className="text-lg font-semibold">{category.attributes.name}</h4>
                                <p className="text-gray-600 line-clamp-3">{category.attributes.description}</p>

                            </Link>


                            {/* Adit & Delete Buttons */}
                            <div className="mt-auto flex gap-2 pt-2 justify-end">
                                <Button
                                    onClick={() => handleEdit(category.id)}
                                    variant="contained"
                                    color="success"
                                    startIcon={<EditIcon />}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDelete(category.id)}
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    className="flex-1"
                                >
                                    Delete
                                </Button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Categories;