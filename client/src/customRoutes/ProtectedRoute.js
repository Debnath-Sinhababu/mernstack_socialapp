import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

const ProtectedRouter = ({children}) => {
    console.log(children)
  return  (
      <>
      {
        localStorage.getItem('firstLogin')? children:<Navigate to='/'/>
      }
      </>
  )
    
  
}

export default ProtectedRouter
