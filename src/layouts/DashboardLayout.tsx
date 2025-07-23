import { useState } from "react";
import { Button } from "../components/ui/button"; // Assuming the Button component is part of your UI library
import { useMediaQuery } from "react-responsive"; // Optional, for better control on breakpoints
import { Menu, X, Sun, Moon } from "lucide-react"; // Lucide icons for the menu and theme toggle
import { Link } from "react-router-dom"; // Import Link from React Router

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode state

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // For better mobile responsiveness, you can use media queries for breakpoints
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "bg-black" : "bg-white"}`}>
      {/* Side Navigation for mobile devices */}
      <div
        className={`fixed inset-0 z-50 transition-all transform bg-gray-900 bg-opacity-90 sm:hidden ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
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
          <Link to="/settings">
            <Button
              variant="ghost"
              className="text-white hover:bg-gray-700 w-full flex items-center gap-2"
            >
              <Menu className="w-4 h-4" /> Settings
            </Button>
          </Link>
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
              <Link to="/settings">
                <Button variant="ghost" className="text-white hover:bg-gray-700">
                  Settings
                </Button>
              </Link>
            </nav>
          )}

          {/* Theme toggle button */}
          <Button
            variant="ghost"
            onClick={toggleDarkMode}
            className="text-white hover:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </Button>

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
