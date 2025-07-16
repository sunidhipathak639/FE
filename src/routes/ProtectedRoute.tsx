import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getToken } from '@/utils/token'

const ProtectedRoute = () => {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
