import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import LeftNav from '../components/LeftNav';

const Adminpanel = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white">
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            
            <div className="flex flex-1 overflow-hidden">
                <div 
                    className={`${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static z-30 h-[calc(100vh-64px)] top-16 md:top-0`}
                >
                    <LeftNav collapsed={isMobile ? false : !sidebarOpen} />
                </div>
                
                <main className="flex-1 overflow-auto pb-8 transition-all duration-300 ease-in-out">
                    {sidebarOpen && isMobile && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-60 z-20"
                            onClick={toggleSidebar}
                        />
                    )}
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Adminpanel;
