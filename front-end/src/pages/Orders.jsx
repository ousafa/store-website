import React, { useEffect, useState } from "react";
import { useLoaderData, Link, useNavigate, useRevalidator, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteOrder, getUsers } from "../loaders/ordersLoader.js";

const Orders = () => {
    const orderData = useLoaderData();
    const orders = orderData.data || [];
    const meta = orderData.meta || {};
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters state
    const [userId, setUserId] = useState("");
    const [status, setStatus] = useState("");
    const [total, setTotal] = useState("");
    const [users, setUsers] = useState([]);

    // Fetch users on mount
    useEffect(() => {
        getUsers().then(setUsers).catch(console.error);
    }, []);

    // -------------------------
    // Filter & Sort Handlers
    // -------------------------
    const handleFilter = (field, value) => {
        if (!value) {
            searchParams.delete(`filter[${field}]`);
        } else {
            searchParams.set(`filter[${field}]`, value);
        }
        setSearchParams(searchParams);
    };

    const handleTotalFilter = () => {
        const val = total.trim();
        if (!val) {
            handleFilter("total", "");
            return;
        }
        if (!/^(\d+)(,\d+)?$/.test(val)) {
            return alert("Enter total as single value or min,max");
        }
        handleFilter("total", val);
    };

    const handleSort = (field, direction = "asc") => {
        searchParams.set("sort", direction === "desc" ? `-${field}` : field);
        setSearchParams(searchParams);
    };

    const clearAllFilters = () => {
        searchParams.delete("sort");
        ["user", "total", "status"].forEach(f => searchParams.delete(`filter[${f}]`));
        setSearchParams(searchParams);
        setUserId("");
        setTotal("");
        setStatus("");
    };

    // -------------------------
    // CRUD Handlers
    // -------------------------
    const handleEdit = (orderId) => navigate(`/orders/${orderId}/edit`);
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            await deleteOrder(id);
            alert("Order deleted successfully!");
            revalidator.revalidate();
        } catch (error) {
            console.error(error);
            alert("Failed to delete order.");
        }
    };

    const goToPage = (page) => {
        searchParams.set("page", page);
        setSearchParams(searchParams);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Orders Page</h1>
                <p className="text-gray-600 text-lg mb-6 text-center">List of current Orders.</p>

                {/* Filters */}
                <div className="flex gap-2 mb-6 flex-wrap items-center">
                    {/* User select */}
                    <select
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            handleFilter("user_id", e.target.value);
                        }}
                        className="px-3 py-2 rounded-lg border border-violet-500 text-violet-700 font-medium bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors"
                    >
                        <option value="">All Users</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.attributes.name}
                            </option>
                        ))}
                    </select>




                    {/* Status */}
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            handleFilter("status", e.target.value);
                        }}
                        className="px-3 py-2 rounded-lg border border-violet-500 text-violet-700 font-medium bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Total */}
                    <input
                        type="text"
                        placeholder="Filter by total (min,max or single)"
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        onBlur={handleTotalFilter}
                        className="px-3 py-2 rounded-lg border border-violet-500 text-violet-700 font-medium bg-white hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors"
                    />

                    {/* Sorting Buttons */}
                    <Button
                        sx={{
                            px: 2,
                            py: 1,
                            border: "1px solid #7c3aed",
                            color: "#7c3aed",
                            '&:hover': { backgroundColor: '#f3e8ff' },
                        }}
                        onClick={() => handleSort("total", "asc")}
                    >
                        Total ↑
                    </Button>
                    <Button
                        sx={{
                            px: 2,
                            py: 1,
                            border: "1px solid #7c3aed",
                            color: "#7c3aed",
                            '&:hover': { backgroundColor: '#f3e8ff' },
                        }}
                        onClick={() => handleSort("total", "desc")}
                    >
                        Total ↓
                    </Button>

                    {/* Clear Filters */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={clearAllFilters}
                        sx={{ px: 2, py: 1, fontWeight: 500 }}
                    >
                        Clear Filters
                    </Button>
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                    {orders.map((order) => (
                        <div key={order.id} className="rounded-lg shadow hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col bg-white overflow-hidden">
                            <div className="p-4 flex flex-col gap-2">
                                <Link to={`/orders/${order.id}`}>
                                    <h4 className="text-lg font-semibold">
                                        Order #{order.id} - {order.attributes.status}
                                    </h4>
                                    {order.includes?.user && (
                                        <p className="text-gray-700">
                                            Customer: <strong>{order.includes.user.attributes.name}</strong>
                                        </p>
                                    )}
                                    <p className="text-gray-600">
                                        Total: <strong className="text-violet-800 font-bold">{order.attributes.total} MAD</strong>
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Created: {new Date(order.attributes.created_at).toLocaleString()}
                                    </p>
                                </Link>

                                {order.includes?.items?.length > 0 && (
                                    <div className="mt-3">
                                        <h5 className="text-sm font-bold">Items:</h5>
                                        <ul className="list-disc ml-4 text-sm">
                                            {order.includes.items.map((item) => {
                                                const productName = item.includes?.product?.attributes?.name ?? `Product #${item.attributes.product_id}`;
                                                return <li key={item.id}>{productName} - Qty: {item.attributes.quantity} × {item.attributes.price} MAD</li>;
                                            })}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-auto flex gap-2 pt-2 justify-end">
                                    <Button onClick={() => handleEdit(order.id)} variant="contained" color="success" startIcon={<EditIcon />} className="flex-1">Edit</Button>
                                    <Button onClick={() => handleDelete(order.id)} variant="contained" color="error" startIcon={<DeleteIcon />} className="flex-1">Delete</Button>
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
                                "&:hover": { backgroundColor: "#6d28d9", color: "#fff" },
                                "&.Mui-disabled": { backgroundColor: "#ddd", color: "#888" },
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
                                "&:hover": { backgroundColor: "#6d28d9", color: "#fff" },
                                "&.Mui-disabled": { backgroundColor: "#ddd", color: "#888" },
                            }}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Orders;
