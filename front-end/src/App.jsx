
import './App.css'
import Navbar from "./components/Navbar";
import {
    Route,
    createRoutesFromElements,
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom'
import Home from "./pages/Home";
import {
    productDetailsLoader,
    productsLoader,
    updateProduct
} from "./loaders/productsLoader";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders.jsx";
import Login from "./pages/auth/Login";
import Registration from "./pages/auth/Registration";
import RootLayout from "./layout/RooteLayout"
import ProductLayout from "./layout/ProductLayout"
import Create from "./components/Product/Create"
import Edit from "./components/Product/Edit"

import React from "react";
import NotFound from "./components/NotFound";
import Error from "./components/Error";

import Products
    from "./pages/Products.jsx";
import Show
    from "./components/Product/Show.jsx";

import  ShowCategory
from "./components/Categories/ShowCategory .jsx";
import {
    categoriesLoader,
    categoryDetailsLoader
} from "./loaders/categoriesLoader.js";
import CategoryLayout
    from "./layout/CategoryLayout.jsx";
import EditCategory
    from "./components/Categories/EditCategory.jsx";


function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<RootLayout />} >
                <Route index element={<Home />} />
                <Route path='products' element={<ProductLayout /> }
                       errorElement={<Error />}>
                    <Route
                        index
                        element={<Products />}
                        loader={productsLoader}

                    />
                    <Route path=':id' element={<Show />} loader={productDetailsLoader}
                    />
                    <Route path='create' element={<Create />} />
                    <Route path=':id/edit' element={<Edit />} loader={productDetailsLoader} />

                </Route>

                <Route path='categories' element={<CategoryLayout /> }
                       errorElement={<Error />}>
                    <Route
                        index
                        element={<Categories />}
                        loader={categoriesLoader}

                    />
                    <Route path=':id' element={<ShowCategory />} loader={categoryDetailsLoader}
                    />
                    <Route path=':id/edit' element={<EditCategory />} loader={categoryDetailsLoader} />


                </Route>

                <Route path='Orders' element={<Orders />} />

                <Route path="login" element={<Login />} />
                <Route path="register" element={<Registration />} />

                <Route path="*" element={<NotFound />} />
            </Route>

        )
    )
    return (
        <RouterProvider router={router} />
    );
}
export default App
