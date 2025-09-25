
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Home, Package, AppWindow, ShoppingCart, BarChart2, Users, Settings, PieChart, Brain, LogOut } from 'lucide-react';

const LeftNav = ({ collapsed }) => {
    const [role, setRole] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
    }, []);

    const isActive = (path) => location.pathname.startsWith(path);

    const menuIcons = {
        dashboard: <Home size={20} />,
        inventory: <Package size={20} />,
        categories: <AppWindow size={20} />,
        orders: <ShoppingCart size={20} />,
        transactions: <BarChart2 size={20} />,
        users: <Users size={20} />,
        settings: <Settings size={20} />,
        reports: <PieChart size={20} />
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };

    const getMenuItems = () => {
        if (!role) return [];
        const allItems = [
            { name: 'Dashboard', path: '/panel/dashboard', icon: menuIcons.dashboard, allowedRoles: ['Admin', 'Manager', 'Staff'] },
            { name: 'Users', path: '/panel/users', icon: menuIcons.users, allowedRoles: ['Admin'] },
            { name: 'Products', path: '/panel/inventory', icon: menuIcons.inventory, allowedRoles: ['Admin', 'Manager', 'Staff'] },
            { name: 'Categories', path: '/panel/categories', icon: menuIcons.categories, allowedRoles: ['Admin'] },
            { name: 'Orders', path: '/panel/orders', icon: menuIcons.orders, allowedRoles: ['Admin', 'Manager', 'Staff'] },
            { name: 'Transactions', path: '/panel/transactions', icon: menuIcons.transactions, allowedRoles: ['Admin', 'Manager'] },
            // { name: 'Reports', path: '/panel/reports', icon: menuIcons.reports, allowedRoles: ['Admin', 'Manager'] },
            // { name: 'Settings', path: '/panel/settings', icon: menuIcons.settings, allowedRoles: ['Admin'] }
        ];
        return allItems.filter(item => item.allowedRoles.includes(role));
    };

    return (
        <nav className={`bg-slate-800/95 backdrop-blur-md text-white h-full transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
            <div className="flex items-center justify-center p-4 h-16 border-b border-slate-700/50">
                <Link to="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            SmartInventory
                        </span>
                    )}
                </Link>
            </div>

            <div className="py-4 flex-grow overflow-y-auto">
                <ul>
                    {getMenuItems().map((item, index) => (
                        <li key={index} className="px-3">
                            <Link
                                to={item.path}
                                title={collapsed ? item.name : ''}
                                className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200 ${collapsed ? 'justify-center' : ''} 
                                ${isActive(item.path) 
                                    ? 'bg-slate-700/80 text-white font-semibold' 
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-emerald-400'}`}
                            >
                                {item.icon}
                                {!collapsed && <span className="ml-4 text-sm">{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t border-slate-700/50 p-3">
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Logout' : ''}
                    className={`flex w-full items-center text-red-400 hover:text-red-300 hover:bg-slate-700/50 py-3 px-4 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="ml-4 text-sm">Logout</span>}
                </button>
            </div>
        </nav>
    );
};

export default LeftNav;
