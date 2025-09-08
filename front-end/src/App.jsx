import React from "react";
import './App.css';
import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import RootLayout from "./layout/RootLayout";
import ProductLayout from "./layout/ProductLayout";
import CategoryLayout from "./layout/CategoryLayout";
import OrderLayout from "./layout/OrderLayout";

// Pages / Components
import Home from "./pages/Home";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders.jsx";
import ShowProduct from "./components/Product/ShowProduct.jsx";
import CreateProduct from "./components/Product/CreateProduct.jsx";
import Edit from "./components/Product/EditProduct.jsx";
import ShowCategory from "./components/Categories/ShowCategory.jsx";

import CreateCategory from "./components/Categories/CreateCategory.jsx";
import EditCategory from "./components/Categories/EditCategory.jsx";
import ShowOrder from "./components/Orders/ShowOrder.jsx";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import NotFound from "./components/NotFound";
import Error from "./components/Error";

// Loaders
import { productsLoader, productDetailsLoader } from "./loaders/productsLoader.js";
import { categoriesLoader, categoryDetailsLoader } from "./loaders/categoriesLoader.js";
import { ordersLoader, orderDetailsLoader } from "./loaders/ordersLoader.js";
import EditOrder
    from "./components/Orders/EditOrder.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />

                {/* Products Routes */}
                <Route path='products' element={<ProductLayout />} errorElement={<Error />}>
                    <Route index element={<Products />} loader={productsLoader} />
                    <Route path='create' element={<CreateProduct />} />
                    <Route path=':id' element={<ShowProduct />} loader={productDetailsLoader} />
                    <Route path=':id/edit' element={<Edit />} loader={productDetailsLoader} />
                </Route>

                {/* Categories Routes */}
                <Route path='categories' element={<CategoryLayout />} errorElement={<Error />}>
                    <Route index element={<Categories />} loader={categoriesLoader} />
                    <Route path='create' element={<CreateCategory />} />
                    <Route path=':id' element={<ShowCategory />} loader={categoryDetailsLoader} />
                    <Route path=':id/edit' element={<EditCategory />} loader={categoryDetailsLoader} />
                </Route>

                {/* Orders Routes */}
                <Route path='orders' element={<OrderLayout />} errorElement={<Error />}>
                    <Route index element={<Orders />} loader={ordersLoader} />
                    <Route path=':id' element={<ShowOrder />} loader={orderDetailsLoader} />
                    <Route path=':id/edit' element={<EditOrder />} loader={orderDetailsLoader} />

                </Route>

                {/* Auth Routes */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Registration />} />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
}

export default App;
