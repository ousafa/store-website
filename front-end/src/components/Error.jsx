import React from 'react'
import {
    useNavigate,
    useRouteError
} from "react-router-dom";
const Error = () => {
    const error = useRouteError()
    const navigate = useNavigate()
    return (
        <div className="flex justify-center items-center w-full h-120">
            <div className="product-details text-center">
                <h3 style={{ color: "gray", fontWeight: "normal" }}>
                    Unauthenticated | {error.message}.
                </h3>
                <button  onClick={()=>{navigate('/')}} className="rounded">Go to homePage</button>
            </div>
        </div>

    )
}

export default Error