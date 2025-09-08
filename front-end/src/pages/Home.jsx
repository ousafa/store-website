import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600 text-lg mb-10 text-center">
                Manage Products, Categories, and Orders easily
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {/* Products Card */}
                <div
                    onClick={() => navigate("/products")}
                    className="bg-white shadow hover:shadow-xl rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition transform hover:-translate-y-2"
                >
                    <h2 className="text-2xl font-semibold mb-2">Products</h2>
                    <p className="text-gray-500 text-center">
                        View, create, edit, or delete your products.
                    </p>
                </div>

                {/* Categories Card */}
                <div
                    onClick={() => navigate("/categories")}
                    className="bg-white shadow hover:shadow-xl rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition transform hover:-translate-y-2"
                >
                    <h2 className="text-2xl font-semibold mb-2">Categories</h2>
                    <p className="text-gray-500 text-center">
                        Manage product categories efficiently.
                    </p>
                </div>

                {/* Orders Card */}
                <div
                    onClick={() => navigate("/orders")}
                    className="bg-white shadow hover:shadow-xl rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition transform hover:-translate-y-2"
                >
                    <h2 className="text-2xl font-semibold mb-2">Orders</h2>
                    <p className="text-gray-500 text-center">
                        View and manage all customer orders.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
