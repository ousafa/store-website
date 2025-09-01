import React from 'react';
import { useLoaderData } from "react-router-dom";

const Show = () => {
    const productDetails = useLoaderData();
    const product = productDetails.data;

    if (!product) {
        return <p>Product not found.</p>; // gracefully handle missing data
    }

    return (
        <div className="product-details">
            <p>
                <b>Product Name:</b> {product.attributes.name}
            </p>
            <p><b>Description:</b> {product.attributes.description}</p>
            <p><b>Price:</b> ${product.attributes.price}</p>
            <button>Oder Now</button>
        </div>
    );
};

export default Show;
