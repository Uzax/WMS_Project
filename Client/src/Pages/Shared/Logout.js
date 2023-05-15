import React,{ useEffect } from 'react'
import { Navigate } from "react-router-dom";

export const Logout = () => {

    useEffect(() => {
    localStorage.clear();
    window.location.reload();
   
    }, [])


  return (
    <div>LogingOut ........
      <Navigate replace to="/" />
      
    </div>
  )
}


export default Logout;