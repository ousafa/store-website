import React from 'react'
import Products from "../pages/Products";
import {Outlet} from "react-router-dom";

const ProductLayout = () => {
    return (
        <div>
            <h1>Products Page</h1>
            <p>List of current product.</p>
            {/*<Products />*/}
            <Outlet />
        </div>
    )
}

export default ProductLayout