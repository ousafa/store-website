import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // true if token exists
    }, []);

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
                <NavLink to="/orders"><li>Orders</li></NavLink>
            </ul>
            <div className='buttons'>
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="bg-gray-100 text-black py-2 rounded-lg hover:bg-gray-800 hover:text-white transition duration-200"
                    >
                        Logout
                    </button>

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
