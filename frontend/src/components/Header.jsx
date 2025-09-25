
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';

const Header = ({ toggleSidebar, sidebarOpen }) => {
    const role = localStorage.getItem('role');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    return (
        <header className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-40 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleSidebar}
                        className="text-slate-300 hover:text-emerald-400 focus:outline-none p-1 rounded-md transition-colors duration-200"
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    
                    <Link to="/panel/dashboard" className="hidden sm:flex items-center">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                           SmartInventory
                        </h1>
                    </Link>
                </div>
            
                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* Notification Button */}
                    <button className="text-slate-300 hover:text-emerald-400 relative p-1 rounded-full transition-colors duration-200">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    </button>
                    
                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white border-2 border-slate-700/50 shadow-md">
                                <span className="text-sm font-medium">{role?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                            <div className="hidden md:block text-slate-200">
                                <p className="text-sm font-medium">{role || 'User'}</p>
                            </div>
                            <ChevronDown size={16} className="text-slate-400 hidden md:block" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 py-1 z-50">
                                <Link 
                                    to="/panel/profile" 
                                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
                                >
                                    <User size={14} className="mr-2" /> Profile
                                </Link>
                                <Link 
                                    to="/panel/settings" 
                                    className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50"
                                >
                                    <Settings size={14} className="mr-2" /> Settings
                                </Link>
                                <div className="border-t border-slate-700/50 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50"
                                >
                                    <LogOut size={14} className="mr-2" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;