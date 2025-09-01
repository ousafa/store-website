// layout/RootLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout = () => {
    const location = useLocation();

    // Array of paths where navbar should NOT appear
    const hideNavbarPaths = ["/login", "/register"];

    const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

    return (
        <div>
            {shouldShowNavbar && <Navbar />}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;
