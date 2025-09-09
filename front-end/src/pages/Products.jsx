import React, { useEffect, useState } from "react";
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
import { deleteProduct, orderProduct, getCategories } from "../loaders/productsLoader.js";

const Products = () => {
    const productsData = useLoaderData();
    const products = productsData.data || [];
    const meta = productsData.meta || {};
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [searchParams, setSearchParams] = useSearchParams();

    // -------------------------
    // Dynamic Filters State
    // -------------------------
    const [categories, setCategories] = useState([]);
    const [priceInput, setPriceInput] = useState("");
    const [stockInput, setStockInput] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data); // [{id, attributes: {name}}]
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // -------------------------
    // Filter & Sort Handlers
    // -------------------------
    const handleSort = (field, direction = "asc") => {
        searchParams.set("sort", direction === "desc" ? `-${field}` : field);
        setSearchParams(searchParams);
    };

    const handleFilter = (field, value) => {
        if (!value) {
            searchParams.delete(`filter[${field}]`);
        } else {
            searchParams.set(`filter[${field}]`, value);
        }
        setSearchParams(searchParams);
    };

    const handlePriceFilter = () => {
        const val = priceInput.trim();
        if (!val) {
            handleFilter("price", "");
            return;
        }
        // // Accept single value or min,max
        // if (!/^(\d+)(,\d+)?$/.test(val)) {
        //     return alert("Enter price as single value or min,max");
        // }
        handleFilter("price", val);
    };

    const handleStockFilter = () => {
        const val = stockInput.trim();
        if (!val) {
            handleFilter("stock", "");
            return;
        }
        // Accept single value or min,max
        // if (!/^(\d+)(,\d+)?$/.test(val)) {
        //     return alert("Enter stock as single value or min,max");
        // }
        handleFilter("stock", val);
    };

    const clearAllFilters = () => {
        searchParams.delete("sort");
        ["category", "price", "stock"].forEach(f => searchParams.delete(`filter[${f}]`));
        setSearchParams(searchParams);
        setPriceInput("");
        setStockInput("");
    };

    // -------------------------
    // Pagination
    // -------------------------
    const goToPage = (page) => {
        searchParams.set("page", page);
        setSearchParams(searchParams);
    };

    // -------------------------
    // CRUD & Order Handlers
    // -------------------------
    const handleOrder = async (product) => {
        if (!window.confirm(`Order ${product.attributes.name}?`)) return;

        try {
            const userId = localStorage.getItem("user_id");
            const payload = {
                data: {
                    attributes: { user_id: userId, status: "pending" },
                    includes: [
                        { product_id: product.id, quantity: 1, price: product.attributes.price }
                    ]
                }
            };

            await orderProduct(payload);
            alert("Product ordered successfully!");
            let currentCount = parseInt(localStorage.getItem("orderCount")) || 0;
            localStorage.setItem("orderCount", (currentCount + 1).toString());
            window.dispatchEvent(new Event("storage"));
        } catch (error) {
            console.error(error);
            alert(error.errors ? Object.values(error.errors).flat().join("\n") : error.message);
        }
    };

    const handleEdit = (productId) => navigate(`/products/${productId}/edit`);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await deleteProduct(id);
            alert("Product deleted successfully!");
            revalidator.revalidate();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product.");
        }
    };

    // -------------------------
    // JSX
    // -------------------------
    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Products Page</h1>
                <p className="text-gray-600 text-lg mb-6 text-center">List of current products.</p>

                {/* Filters & Sorting */}
                <div className="flex gap-2 mb-6 flex-wrap items-center">
                    {/* Category Dropdown */}
                    <select
                        onChange={(e) => handleFilter("category", e.target.value)}
                        defaultValue=""
                        className="px-3 py-2 rounded-lg border border-violet-500 text-violet-700 font-medium bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.attributes.name}>{cat.attributes.name}</option>
                        ))}
                    </select>

                    {/* Price Input */}
                    <input
                        type="text"
                        placeholder="Price min,max or single value"
                        value={priceInput}
                        onChange={(e) => setPriceInput(e.target.value)}
                        onBlur={handlePriceFilter}
                        className="px-3 py-2 rounded-lg border border-violet-500 text-violet-700 font-medium bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors"

                    />

                    {/* Stock Input */}
                    <input
                        type="text"
                        placeholder="Stock min,max or single value"
                        value={stockInput}
                        onChange={(e) => setStockInput(e.target.value)}
                        onBlur={handleStockFilter}
                        className="px-3 py-2 rounded-lg border border-violet-500 text-violet-700 font-medium bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors"

                    />

                    {/* Sorting Buttons */}
                    <Button sx={{
                        px: 2,
                        py: 1,
                        border: '1px solid #7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                            backgroundColor: '#f3e8ff', // light violet on hover
                        },
                    }} onClick={() => handleSort("price", "asc")}>Price ↑</Button>
                    <Button sx={{
                        px: 2,
                        py: 1,
                        border: '1px solid #7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                            backgroundColor: '#f3e8ff', // light violet on hover
                        },
                    }} onClick={() => handleSort("price", "desc")}>Price ↓</Button>
                    <Button sx={{
                        px: 2,
                        py: 1,
                        border: '1px solid #7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                            backgroundColor: '#f3e8ff',
                        },
                    }} onClick={() => handleSort("stock", "asc")}>Stock ↑</Button>
                    <Button sx={{
                        px: 2,
                        py: 1,
                        border: '1px solid #7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                            backgroundColor: '#f3e8ff',
                        },
                    }} onClick={() => handleSort("stock", "desc")}>Stock ↓</Button>
                    <Button sx={{
                        px: 2,
                        py: 1,
                        border: '1px solid #7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                            backgroundColor: '#f3e8ff',
                        },
                    }} onClick={() => handleSort("name")}>Name ↑</Button>

                    {/* Clear Filters/Sort */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={clearAllFilters}
                        sx={{
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                        }}
                    >
                        Clear Filters
                    </Button>

                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {products.map((product) => (
                    <div key={product.id} className="rounded-lg shadow hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col bg-white overflow-hidden">
                        <Link to={`/products/${product.id}`}>
                            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                {product.attributes.image ? (
                                    <img
                                        src={product.attributes.image}
                                        alt={product.attributes.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : <span className="text-gray-400">No Image</span>}
                            </div>
                        </Link>

                        <div className="p-4 flex flex-col gap-2">
                            <h4 className="text-lg font-semibold">{product.attributes.name}</h4>
                            <p className="text-gray-600 line-clamp-3">{product.attributes.description}</p>
                            <p className="text-violet-800 font-bold">Price: ${product.attributes.price}</p>
                            <p className="text-gray-500">Stock: {product.attributes.stock}</p>
                            <span className="inline-block bg-gray-100 text-zinc-600 text-sm font-semibold px-3 py-1 rounded-full w-fit">
                                {product.includes?.attributes?.name}
                            </span>

                            <button
                                onClick={() => handleOrder(product)}
                                className="mt-auto bg-zinc-900 hover:bg-black text-white font-semibold py-2 rounded-lg transition duration-200 cursor-pointer"
                            >
                                Order Product
                            </button>

                            <div className="mt-auto flex gap-2 pt-2 justify-end">
                                <Button onClick={() => handleEdit(product.id)} variant="contained" color="success" startIcon={<EditIcon />} className="flex-1">Edit</Button>
                                <Button onClick={() => handleDelete(product.id)} variant="contained" color="error" startIcon={<DeleteIcon />} className="flex-1">Delete</Button>
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
