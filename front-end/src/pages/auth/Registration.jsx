import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "http://127.0.0.1:8000/api";

const Registration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client' // par défaut
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Laravel validation errors
                setErrors(data.errors || { general: data.message || "Registration failed" });
                setLoading(false);
                return;
            }

            // Save token and user id
            localStorage.setItem("token", data.payload.token);
            localStorage.setItem("user_id", data.payload.id);

            alert("Registration successful!");
            navigate("/"); // rediriger vers Home
        } catch (err) {
            console.error(err);
            // Vérifie si le backend a renvoyé un objet avec "errors" ou "message"
            if (err.errors) {
                // Transformation de l'objet errors en texte lisible
                const formattedErrors = {};
                Object.entries(err.errors).forEach(([field, messages]) => {
                    formattedErrors[field] = Array.isArray(messages) ? messages.join(", ") : messages;
                });
                setErrors(formattedErrors);
            } else if (err.message) {
                // Message général du backend
                setErrors({ general: err.message });
            } else {
                setErrors({ general: "Something went wrong. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-[80vh] mt-10">
            <div className="p-8 w-full max-w-md bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-400"
                        />
                    </div>

                    {/* Display errors */}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="text-red-500 mb-4">
                            {Object.entries(errors).map(([field, messages]) => (
                                <p key={field}>* {Array.isArray(messages) ? messages.join(", ") : messages}</p>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition duration-200 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Already have an account?{' '}
                    <a href="/login" className="text-violet-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Registration;
