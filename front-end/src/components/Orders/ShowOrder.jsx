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
    deleteOrder
} from "../../loaders/ordersLoader.js";

export default function ShowOrder () {
    const orderDetails = useLoaderData();
    const order = orderDetails.data;
    const navigate = useNavigate();
    const revalidator = useRevalidator(); // hook to revalidate loader


    if (!order) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <p className="text-gray-500 text-lg">Order not found.</p>
            </div>
        );
    }

    const handleEdit = () => {
        navigate(`/orders/${order.id}/edit`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            await deleteOrder(id);
            alert("Order deleted successfully!");
            navigate(`/orders`);
        } catch (error) {
            console.error(error);
            alert("Failed to delete order.");
        }
    };

    return (
        <div className="px-6 py-10 max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Page</h1>
                <p className="text-gray-600 text-lg">Here are the details of the selected order.</p>
            </div>

            {/* Order Section */}
            <div className="prose lg:prose-xl mx-auto bg-white shadow rounded p-6">

                {/* Order Info */}
                <h2 className="text-3xl font-bold mb-2">Order #{order.id} - {order.attributes.status}</h2>
                <p className="text-gray-500 text-sm mb-1">
                    Customer:{" "}
                    <strong>{order.includes.user.attributes.name}</strong>
                </p>
                <p className="text-gray-500 text-sm mb-1">
                    Created at: {new Date(order.attributes.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    Updated at: {new Date(order.attributes.updated_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                    Total: <strong className={'text-violet-800 font-bold'}>{order.attributes.total} MAD</strong>
                </p>

                {/* Items */}
                {order.includes?.items?.length > 0 && (
                    <div className="mt-3">
                        <h5 className="text-sm font-bold">Items:</h5>
                        <ul className="list-disc ml-4 text-sm">
                            {order.includes.items.map((item) => {
                                const productName = item.includes?.product?.attributes?.name ?? `Product #${item.attributes.product_id}`;
                                return (
                                    <li key={item.id}>
                                        {productName} - Qty: {item.attributes.quantity} × {item.attributes.price} MAD
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
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
                        onClick={() => handleDelete(order.id)}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </div>
                <div className="flex justify-end gap-2 ">
                    <Link to="/orders">
                        <button className="bg-white text-black border border-gray-300 px-6 py-2 rounded hover:bg-black hover:text-white transition">
                            Go Back
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};


