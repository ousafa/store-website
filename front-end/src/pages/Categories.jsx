import React, { useState } from "react";
import {
    useLoaderData,
    Link,
    useNavigate,
    useRevalidator,
    useSearchParams
} from "react-router-dom";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { deleteCategory } from "../loaders/categoriesLoader.js";

const Categories = () => {
    const categoryData = useLoaderData();
    const categories = categoryData.data || [];
    const meta = categoryData.meta || {};
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters & Sort state
    const [filterName, setFilterName] = useState(searchParams.get("filter[name]") || "");
    const [sortField, setSortField] = useState(searchParams.get("sort") || "");

    const handleEdit = (categoryId) => navigate(`/categories/${categoryId}/edit`);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(id);
            alert("Category deleted successfully!");
            revalidator.revalidate();
        } catch (error) {
            console.error(error);
            alert("Failed to delete category.");
        }
    };

    // Filters handler
    const handleFilter = (field, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(`filter[${field}]`, value);
        else params.delete(`filter[${field}]`);
        params.set("page", 1); // reset page
        setSearchParams(params);
    };

    // Sort handler
    const handleSort = (field, direction = "asc") => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", direction === "desc" ? `-${field}` : field);
        setSearchParams(params);
    };

    const clearAllFilters = () => {
        setSearchParams({});
        setFilterName("");
        setSortField("");
    };

    const goToPage = (page) => setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        params.set("page", page);
        return params;
    });

    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Categories Page</h1>
                <p className="text-gray-600 text-lg mb-6 text-center">List of current Categories.</p>

                <div className="flex gap-3 flex-wrap justify-center mb-6">


                    {/* Filter by Name */}
                    <input
                        type="text"
                        placeholder="Filter by name..."
                        value={filterName}
                        onChange={(e) => {
                            setFilterName(e.target.value);
                            handleFilter("name", e.target.value);
                        }}
                        className="px-3 py-2 border border-violet-500 rounded-lg text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    />

                    {/* Sort by Name */}
                    <Button
                        variant="outlined"
                        sx={{ color: "#7c3aed", borderColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9", color: "#fff" } }}
                        onClick={() => handleSort("name", "asc")}
                    >
                        Name ↑
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ color: "#7c3aed", borderColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9", color: "#fff" } }}
                        onClick={() => handleSort("name", "desc")}
                    >
                        Name ↓
                    </Button>

                    {/* Clear all filters */}
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            px: 2,
                            py: 1,
                            fontWeight: 500,
                        }}
                        onClick={clearAllFilters}
                    >
                        Clear Filters
                    </Button>
                    {/* Create Category */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/categories/create")}
                        sx={{ backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}
                    >
                        Create Category
                    </Button>
                </div>
            </div>

            {/* Categories grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {categories.map((category) => (
                    <div key={category.id} className="rounded-lg shadow hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col bg-white overflow-hidden">
                        <div className="p-4 flex flex-col gap-2">
                            <Link to={`/categories/${category.id}`}>
                                <h4 className="text-lg font-semibold">{category.attributes.name}</h4>
                                <p className="text-gray-600 line-clamp-3">{category.attributes.description}</p>
                            </Link>

                            <div className="mt-auto flex gap-2 pt-2 justify-end">
                                <Button onClick={() => handleEdit(category.id)} variant="contained" color="success" startIcon={<EditIcon />} className="flex-1">
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(category.id)} variant="contained" color="error" startIcon={<DeleteIcon />} className="flex-1">
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
                    <Button onClick={() => goToPage(meta.current_page - 1)} disabled={meta.current_page === 1} variant="outlined"
                            sx={{ borderColor: "#7c3aed", color: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9", color: "#fff" } }}
                    >
                        Prev
                    </Button>
                    <span className="px-4">Page {meta.current_page} of {meta.last_page}</span>
                    <Button onClick={() => goToPage(meta.current_page + 1)} disabled={meta.current_page === meta.last_page} variant="outlined"
                            sx={{ borderColor: "#7c3aed", color: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9", color: "#fff" } }}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
};

export default Categories;
