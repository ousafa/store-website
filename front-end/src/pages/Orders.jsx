import React from "react";
import {
    useLoaderData,
    Link,
    useNavigate,
    useRevalidator
} from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import {
    deleteOrder
} from "../loaders/ordersLoader.js";


const Orders = () => {
    const orderData = useLoaderData();
    const orders = orderData.data || [];
    const navigate = useNavigate();
    const revalidator = useRevalidator();


    const handleEdit = (orderId) => {
        navigate(`/orders/${orderId}/edit`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            await deleteOrder(id);
            alert("Order deleted successfully!");
            revalidator.revalidate(); // refresh loader data
        } catch (error) {
            console.error(error);
            alert("Failed to delete order.");
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center p-6 mt-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Orders Page
                </h1>
                <p className="text-gray-600 text-lg mb-6 text-center">
                    List of current Orders.
                </p>

                {/* Create Order Button */}
                {/*<Button*/}
                {/*    variant="contained"*/}
                {/*    startIcon={<AddIcon />}*/}
                {/*    onClick={() => navigate("/orders/create")}*/}
                {/*    sx={{*/}
                {/*        backgroundColor: "#7c3aed",*/}
                {/*        color: "#fff",*/}
                {/*        "&:hover": { backgroundColor: "#6d28d9" },*/}
                {/*    }}*/}
                {/*    className="mb-6"*/}
                {/*>*/}
                {/*    Create Order*/}
                {/*</Button>*/}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="rounded-lg shadow hover:shadow-xl transform hover:-translate-y-2 transition duration-300 flex flex-col bg-white overflow-hidden"
                    >
                        {/* Order Info */}
                        <div className="p-4 flex flex-col gap-2">
                            <Link to={`/orders/${order.id}`}>
                                <h4 className="text-lg font-semibold">
                                    Order #{order.id} - {order.attributes.status}
                                </h4>

                                {/* Customer */}
                                {order.includes?.user && (
                                    <p className="text-gray-700">
                                        Customer:{" "}
                                        <strong>{order.includes.user.attributes.name}</strong>
                                    </p>
                                )}

                                {/* Total */}
                                <p className="text-gray-600">
                                    Total: <strong className={'text-violet-800 font-bold'}>{order.attributes.total} MAD</strong>
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Created:{" "}
                                    {new Date(order.attributes.created_at).toLocaleString()}
                                </p>
                            </Link>

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



                            {/* Edit & Delete Buttons */}
                            <div className="mt-auto flex gap-2 pt-2 justify-end">
                                <Button
                                    onClick={() => handleEdit(order.id)}
                                    variant="contained"
                                    color="success"
                                    startIcon={<EditIcon />}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDelete(order.id)}
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

export default Orders;
