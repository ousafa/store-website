import React from 'react'
import logo from '../assets/react.svg'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {
   const navigate = useNavigate()
    return (
        <div className='navbar'>
            <img src={logo} alt="logo" width="40px"/>
            <ul>
                <NavLink to="/"><li>Home</li></NavLink>
                <NavLink to="/products"><li>Products</li></NavLink>
                <NavLink to="/categories"><li>Categories</li></NavLink>
                <NavLink to="/orders"> <li>Orders</li></NavLink>
            </ul>
           <div className='buttons'>
               <button onClick={()=>navigate('/login', {replace:true})}>Login</button>
               <button  onClick={()=>navigate('/register', {replace:true})} className={'active'}>Register</button>
           </div>
        </div>
    )
}

export default Navbar