import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Adminpanel from './pages/Adminpanel';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/Inventory';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import TransactionsPage from './pages/TransactionsPage';
import UserPage from './pages/adminUserPage'; 
import { Loader } from 'lucide-react';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

   if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
                <Loader className="h-12 w-12 animate-spin text-emerald-400" />
                <p className="mt-4 text-lg text-slate-300">Initializing SmartInventory...</p>
            </div>
        );
    }

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/panel/dashboard" />
                            ) : (
                                <LoginPage setIsAuthenticated={setIsAuthenticated} />
                            )
                        }
                    />

                    <Route
                        path="/panel"
                        element={
                            isAuthenticated ? <Adminpanel /> : <Navigate to="/login" />
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<UserPage />} />
                        <Route path="inventory" element={<InventoryPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="transactions" element={<TransactionsPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </Router>
    );
};

export default App;
