import React, { useState } from 'react';
import { loginUser } from '../../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.payload.token);
            localStorage.setItem('user_id', data.payload.id); // store user ID

            window.location.href = '/';
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-[80vh]">
            <div className="p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition duration-200 cursor-pointer"

                    >
                        Login
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don't have an account?{' '}
                    <a href="/register" className="text-violet-600 hover:underline">Register</a>

                </p>
            </div>
        </div>
    );
};

export default Login;
