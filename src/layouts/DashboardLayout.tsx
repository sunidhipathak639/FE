import { useEffect, useState } from "react";
import { Button } from "../components/ui/button"; // Assuming the Button component is part of your UI library
import { useMediaQuery } from "react-responsive"; // Optional, for better control on breakpoints
import { Menu, X, Sun, Moon, LogOut, Bug, ClipboardList, Code2, Eye, ShieldCheck } from "lucide-react"; // Lucide icons for the menu and theme toggle
import { Link, useNavigate } from "react-router-dom"; // Import Link from React Router
import { removeToken } from "@/utils/token";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode state
  const navigate = useNavigate()

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const { user } = useAuth();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleLogout = () => {
    removeToken()
    navigate('/login')
  }
  return (
    <div className={`flex min-h-screen ${isDarkMode ? "bg-black" : "bg-white"}`}>
      {/* Side Navigation for mobile devices */}
      <div
        className={`fixed inset-0 z-50 transition-all transform bg-gray-900 bg-opacity-90 sm:hidden ${isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Side nav header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-white text-2xl">Dashboard</h2>
          <Button variant="ghost" onClick={toggleNav} className="text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>
        {/* Side nav items */}
        <div className="space-y-4 p-4">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              className="text-white hover:bg-gray-700 w-full flex items-center gap-2"
            >
              <Menu className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link to="/projects">
            <Button
              variant="ghost"
              className="text-white hover:bg-gray-700 w-full flex items-center gap-2"
            >
              <Menu className="w-4 h-4" /> Projects
            </Button>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/users">
              <Button
                variant="ghost"
                className="text-white hover:bg-gray-700 w-full flex items-center gap-2"
              >
                <Menu className="w-4 h-4" /> Users
              </Button>
            </Link>
          )}

        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 sm:ml-0 sm:w-full sm:static transition-all">
        {/* Header with nav items for larger screens */}
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md sm:flex-row sm:space-x-6">
          {/* Logo and App Name */}
          <h2 className="text-2xl font-semibold">TeamTasker</h2>

          {/* Navigation links for larger screens */}
          {!isMobile && (
            <nav className="space-x-6 flex items-center">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  Dashboard
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  Projects
                </Button>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/users">
                  <Button variant="ghost" className="text-white hover:bg-gray-700">
                    Users
                  </Button>
                </Link>
              )}

            </nav>
          )}

          {/* Theme toggle button */}
          <div className="flex items-center gap-3">
            {/* Role, Name & Email */}
            {user?.role && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 text-white border border-gray-600">
                {/* Role Icon */}
                {user.role === 'ADMIN' && <ShieldCheck className="w-4 h-4 text-green-400" />}
                {user.role === 'PROJECT_MANAGER' && <ClipboardList className="w-4 h-4 text-blue-400" />}
                {user.role === 'DEVELOPER' && <Code2 className="w-4 h-4 text-yellow-400" />}
                {user.role === 'TESTER' && <Bug className="w-4 h-4 text-pink-400" />}
                {user.role === 'VIEWER' && <Eye className="w-4 h-4 text-gray-400" />}

                {/* Role Text */}
                <span className="uppercase font-semibold tracking-tight">{user.role}</span>

                {/* Name with Email Tooltip */}
                <div className="relative group cursor-pointer">
                  <span className="ml-2 font-medium capitalize">{user.name}</span>

                  {/* Email Tooltip */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg border border-gray-700 whitespace-nowrap">
                    {user.email}
                  </div>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              onClick={toggleDarkMode}
              className="text-white hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5 text-red-500" />
            </Button>
          </div>


          {/* Toggle button for mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              onClick={toggleNav}
              className="absolute top-6 left-6 z-10 text-white"
            >
              {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          )}
        </header>

        {/* Main content area */}
        <div className={`bg-gray-800 text-white rounded-lg shadow-lg p-4`}>
          {children} {/* This is the main content */}
        </div>
      </div>
    </div>
  );
}
