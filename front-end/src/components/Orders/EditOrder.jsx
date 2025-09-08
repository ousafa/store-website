import React, { useState } from "react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import Button from "@mui/material/Button";
import { updateOrder } from "../../loaders/ordersLoader.js";

const EditOrder = () => {
    const orderDetails = useLoaderData();
    const order = orderDetails.data;
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [status, setStatus] = useState(order.attributes.status);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await updateOrder(order.id, status);
            alert("Order status updated successfully!");
            revalidator.revalidate();
            navigate(`/orders/${order.id}`);
        } catch (err) {
            console.error(err);
            setErrors(err.errors || { general: err.message || "Failed to update status" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <form onSubmit={handleSubmit} className="w-full max-w-lg" >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Edit Order #{order.id}
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Status</label>
                    <select
                        name="status"
                        value={status}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-violet-300"
                    >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {errors && Object.keys(errors).length > 0 && (
                    <div className="text-red-500 mt-4 mb-4">
                        {Object.entries(errors).map(([field, messages]) => (
                            <p key={field}>
                                *{Array.isArray(messages) ? messages.join(", ") : messages}
                            </p>
                        ))}
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditOrder;
