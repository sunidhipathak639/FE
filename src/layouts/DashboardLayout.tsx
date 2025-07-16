// src/layouts/DashboardLayout.tsx
import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { removeToken } from '@/utils/token'

export default function DashboardLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">TeamTasker</h1>
        <nav className="space-x-4">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/projects" className="hover:underline">
            Projects
          </Link>
          <Link to="/users" className="hover:underline">
            Users
          </Link>
          <button onClick={handleLogout} className="ml-4 text-red-400 hover:text-red-200">
            Logout
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}
