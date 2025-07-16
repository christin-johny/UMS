import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({children}) => {
    const {user} = useSelector((state)=>state.auth)
  return  user && !user.isAdmin ?<Navigate to='/' /> : children
}

export default PublicRoute
