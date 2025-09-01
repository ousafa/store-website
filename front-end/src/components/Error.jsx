import React from 'react'
import {
    useNavigate,
    useRouteError
} from "react-router-dom";
const Error = () => {
    const error = useRouteError()
    const navigate = useNavigate()
    return (
        <div className="product-details">
            <h3 style={{ color: "gray", fontWeight: "normal" }}>
                An error occurred | {error.message}.
            </h3>

            <button  onClick={()=>{navigate('/')}}>Go to homePage</button>
        </div>
    )
}

export default Error