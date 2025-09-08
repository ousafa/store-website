import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        const savedCount = localStorage.getItem("orderCount");
        setOrderCount(savedCount ? parseInt(savedCount) : 0);

        const handleStorageChange = () => {
            const newCount = localStorage.getItem("orderCount");
            setOrderCount(newCount ? parseInt(newCount) : 0);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (location.pathname === "/orders" && orderCount > 0) {
            setOrderCount(0);
            localStorage.setItem("orderCount", "0");
        }
    }, [location.pathname]);


    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className='navbar'>
            <img src={logo} alt="logo" width="50px"/>
            <ul>
                <NavLink to="/"><li>Home</li></NavLink>
                <NavLink to="/products"><li>Products</li></NavLink>
                <NavLink to="/categories"><li>Categories</li></NavLink>
                <NavLink to="/orders">
                    <li>
                        Orders
                        {orderCount > 0 && (
                            <span className="text-red-600 font-bold ml-1">({orderCount})</span>
                        )}
                    </li>
                </NavLink>
            </ul>

            <div className='buttons'>
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => navigate("/products/create")}
                            className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition cursor-pointer mr-5"
                        >
                            Create Product
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-black py-2 rounded-lg hover:bg-gray-800 hover:text-white transition duration-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate('/login', {replace:true})}>Login</button>
                        <button onClick={() => navigate('/register', {replace:true})} className={'active'}>Register</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
