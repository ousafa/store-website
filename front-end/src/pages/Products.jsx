import React from "react";
import {
    useLoaderData,
    Link,
    useNavigate,
    useRevalidator,
    useSearchParams
} from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {
    deleteProduct,
    orderProduct
} from "../loaders/productsLoader.js";


const Products = () => {
    const productsData = useLoaderData();
    const products = productsData.data || [];
    const meta = productsData.meta || {};
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [searchParams, setSearchParams] = useSearchParams();


    const handleOrder = async (product) => {
        if (!window.confirm(`Are you sure you want to order ${product.attributes.name}?`)) return;

        try {

            const userId = localStorage.getItem("user_id"); // make sure you saved it on login

            const payload = {
                data: {
                    attributes: {
                        user_id: userId,
                        status: "pending"
                    },
                    includes: {
                        items: [
                            {
                                product_id: product.id,
                                quantity: 1,
                                price: product.attributes.price
                            }
                        ]
                    }
                }
            };


            await orderProduct(payload);

            // après orderProduct(formData)
            alert("Product ordered successfully!");

            // Incrémente le badge
            let currentCount = parseInt(localStorage.getItem("orderCount")) || 0;
            currentCount += 1;
            localStorage.setItem("orderCount", currentCount.toString());

            // Re-render Navbar si nécessaire
            window.dispatchEvent(new Event("storage"));

        }catch (error) {
                console.error(error);
                if (error.errors) {
                    alert("Failed to order product:\n" + Object.values(error.errors).flat().join("\n"));
                } else {
                    alert("Failed to order product: " + error.message);
                }
        }

    };


    const handleEdit = (productId) => {
        navigate(`/products/${productId}/edit`);
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

    const goToPage = (page) => {
        setSearchParams({ page });
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Products Page
                </h1>
                <p className="text-gray-600 text-lg mb-6 text-center">
                    List of current products.
                </p>
            </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">

            {products.map((product) => (
                <div
                    key={product.id}
                    className="rounded-lg shadow hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col bg-white overflow-hidden"
                >
                    {/* Product Image */}
                    <Link to={product.id.toString()}>

                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {product.attributes.image ? (
                                <img
                                    src={product.attributes.image}
                                    alt={product.attributes.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400">No Image</span>
                            )}
                        </div>
                    </Link>

                        {/* Product Info */}
                        <div className="p-4 flex flex-col gap-2">
                            <Link to={`/products/${product.id}`}>
                                <h4 className="text-lg font-semibold">{product.attributes.name}</h4>
                                <p className="text-gray-600 line-clamp-3">{product.attributes.description}</p>
                                <p className="text-violet-800 font-bold">Price: ${product.attributes.price}</p>
                                <p className="text-gray-500">Stock: {product.attributes.stock}</p>
                                <span className="inline-block bg-gray-100 text-zinc-600 text-sm font-semibold px-3 py-1 rounded-full w-fit">
                                    {product.includes.attributes.name}
                                </span>
                            </Link>

                    {/* Order Button */}
                            <button
                                onClick={() => handleOrder(product)}
                                className="mt-auto bg-zinc-900 hover:bg-black text-white font-semibold py-2 rounded-lg transition duration-200 cursor-pointer"
                            >
                                Order Product
                            </button>


                            {/* Adit & Delete Buttons */}
                    <div className="mt-auto flex gap-2 pt-2 justify-end">
                        <Button
                            onClick={() => handleEdit(product.id)}
                            variant="contained"
                            color="success"
                            startIcon={<EditIcon />}
                            className="flex-1"
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => handleDelete(product.id)}
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

            {/* Pagination */}
            {meta && (
                <div className="flex justify-center items-center gap-2 my-6">
                    <Button
                        variant="outlined"
                        onClick={() => goToPage(meta.current_page - 1)}
                        disabled={meta.current_page === 1}
                        sx={{
                            borderColor: "#7c3aed",
                            color: "#7c3aed",
                            "&:hover": { backgroundColor: "#6d28d9",  color: "#fff", },
                            "&.Mui-disabled": {
                                backgroundColor: "#ddd",
                                color: "#888",
                            },
                        }}
                    >
                        Prev
                    </Button>
                    <span className="px-4">
                        Page {meta.current_page} of {meta.last_page}
                    </span>

                    <Button
                        variant="outlined"
                        onClick={() => goToPage(meta.current_page + 1)}
                        disabled={meta.current_page === meta.last_page}
                        sx={{
                            borderColor: "#7c3aed",
                            color: "#7c3aed",
                            "&:hover": { backgroundColor: "#6d28d9",  color: "#fff", },
                            "&.Mui-disabled": {
                                backgroundColor: "#ddd",
                                color: "#888",
                            },
                        }}
                    >
                        Next
                    </Button>
                </div>
            )}

        </>
    );
};

export default Products;
