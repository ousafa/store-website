import React from "react";
import { useLoaderData, Link } from "react-router-dom";

const Products = () => {
    const productsData = useLoaderData();
    const products = productsData.data || [];


    return (

        <div className="products">
            {products.map((product) => (
                <Link to={product.id.toString()} key={product.id}>
                    <h4>{product.attributes.name}</h4>
                    <p>Price: ${product.attributes.price}</p>
                    <p>Stock: {product.attributes.stock}</p>
                    <p>Category: {product.includes.attributes.name}</p>
                </Link>
            ))}
        </div>
    );
};

export default Products;
