import React, { useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { notifyWarning } from '../../components/Toast';

function AdminDashboard() {
  const navigate  = useNavigate();
  useEffect(()=>{
    if(window.localStorage.getItem("role") !== "Admin"){
      // alert("Not authorized");
      notifyWarning("Not authorized");
      navigate("/");
    }
  },[])
  return (
    <div >
         {/* <h1 className='text-center'>Admin Dashboard</h1> */}
         <nav className='d-flex justify-content-evenly pt-2' style={{backgroundColor:"#9ef4fcff"}}>
          <NavLink to={"/admin/technology"} className={({ isActive }) =>
            `fs-5 fw-bold text-decoration-none px-3 py-1 ${
              isActive ? "bg-light text-dark" : "text-dark"
            }`
          }>Technologies</NavLink>
          <NavLink to={"/admin/questionbank"} className={({ isActive }) =>
            `fs-5 fw-bold text-decoration-none px-3 py-1 ${
              isActive ? "bg-light text-dark" : "text-dark"
            }`
          }>Question Bank</NavLink>
          <NavLink to={"/admin/quizes"} className={({ isActive }) =>
            `fs-5 fw-bold text-decoration-none px-3 py-1 ${
              isActive ? "bg-light text-dark" : "text-dark"
            }`
          }>Quizes</NavLink>
          {/* <Link to={"/admin/questionbank"} className='text-decoration-none fs-5 fw-bold text-dark'>Question Bank</Link> */}
          {/* <h4>Question Bank</h4> */}
         </nav>
         <Outlet></Outlet>
    </div>
  )
}

export default AdminDashboard
