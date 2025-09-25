
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Brain, Zap, X, Shield, UserCog, UserCheck } from 'lucide-react';
import loginImg from '../images/warehouse-management-software.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginForm = ({ setIsAuthenticated }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const navigate = useNavigate();

    const demoUsers = [
        {
            role: 'Admin',
            email: 'admin@gmail.com',
            password: 'admin@gmail.com',
            icon: <Shield size={24} />
        },
        {
            role: 'Manager',
            email: 'manager@gmail.com',
            password: 'manager@gmail.com',
            icon: <UserCog size={24} />
        },
        {
            role: 'Staff',
            email: 'staff@gmail.com',
            password: 'staff@gmail.com',
            icon: <UserCheck size={24} />
        }
    ];

    const handleSelectUser = (user) => {
        setEmail(user.email);
        setPassword(user.password);
        setIsModalOpen(false); 
        toast.success(`Credentials for ${user.role} have been filled. Please click "Sign In".`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Login Successful!');
                const { token, userId, role } = data.user;
                localStorage.setItem('userId', userId);
                localStorage.setItem('role', role);
                localStorage.setItem('token', token);
                setIsAuthenticated(true);
                navigate("/panel");
            } else {
                toast.error(data.message || 'Login failed, please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong, please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-900">
            {/* --- START: Demo Credentials Modal --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Select a Demo Account</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-slate-400 mb-6 text-center">Click on a role to automatically fill the login credentials.</p>
                        <div className="space-y-4">
                            {demoUsers.map((user) => (
                                <button
                                    key={user.role}
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full text-left p-4 bg-slate-700/50 rounded-lg flex items-center gap-4 border border-transparent hover:border-emerald-500/50 hover:bg-slate-700 transition-all group"
                                >
                                    <div className="p-3 bg-slate-800 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                        {user.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">{user.role}</p>
                                        <p className="text-sm text-slate-300 font-mono">{user.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <button onClick={() => setIsModalOpen(false)} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                Or, sign in manually
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- END: Demo Credentials Modal --- */}
            
            <div className="flex flex-1">
                {/* Left Image Section */}
                <div className="w-1/2 hidden lg:flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                    <img src={loginImg} alt="Inventory Management" className="absolute object-cover w-full h-full opacity-20" />
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
                    </div>
                    <div className="relative z-20 flex flex-col justify-center items-start p-16 h-full">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"><Brain className="w-7 h-7 text-white" /></div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">SmartInventory</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-6">Streamline Your Operations with <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Insights</span></h2>
                        <p className="text-slate-300 text-lg max-w-md leading-relaxed">Access your dashboard to monitor stock levels, predict demand, and manage your inventory with unparalleled efficiency.</p>
                        <div className="mt-12 pt-8 border-t border-slate-700/50 w-full max-w-md space-y-4">
                            <div className="flex items-center text-slate-300"><div className="p-2 bg-slate-700/50 rounded-full mr-4 border border-slate-600"><Zap size={20} className="text-emerald-400" /></div><span>Secure & Encrypted Access</span></div>
                            <div className="flex items-center text-slate-300"><div className="p-2 bg-slate-700/50 rounded-full mr-4 border border-slate-600"><Zap size={20} className="text-cyan-400" /></div><span>Real-time Data Synchronization</span></div>
                        </div>
                    </div>
                </div>

                {/* Right Login Form Section */}
                <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
                                <p className="text-slate-400 mt-2">Please sign in to access your dashboard.</p>
                            </div>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Email Input */}
                                <div className="relative"><label className="text-sm font-medium text-slate-300 mb-2 block">Email Address</label><div className="relative"><User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" /><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition" placeholder="you@example.com" required /></div></div>
                                
                                {/* Password Input */}
                                <div className="relative"><div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-slate-300">Password</label><a href="#forgot" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a></div><div className="relative"><Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition" placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                                
                                <div className="flex items-center"><input id="remember-me" type="checkbox" className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500" /><label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">Remember me</label></div>
                                
                                <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 flex items-center justify-center group">{isLoading ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<>Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>)}</button>
                            </form>
                            
                            {/* --- Trigger Button for Modal --- */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-slate-400">
                                    Want to test the app?{' '}
                                    <button onClick={() => setIsModalOpen(true)} className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                                        Use a Demo Account
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;