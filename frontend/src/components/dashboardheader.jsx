
import { useEffect, useState } from 'react';
import {
    Users,
    ShoppingBag,
    CreditCard,
    Package,
    AlertTriangle,
    RefreshCcw,
    Award,
    X,
    BarChart,
    Loader
} from 'lucide-react';

export default function DashboardHeader() {
    const [metrics, setMetrics] = useState({
        users: 0,
        orders: 0,
        revenue: 0,
        products: 0,
        lowStockAlerts: 0
    });
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [showLowStockModal, setShowLowStockModal] = useState(false);
    const [showTopSellingModal, setShowTopSellingModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [productsRes, usersRes, ordersRes, transactionsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/products`),
                fetch(`${import.meta.env.VITE_API_URL}/users`),
                fetch(`${import.meta.env.VITE_API_URL}/orders`),
                fetch(`${import.meta.env.VITE_API_URL}/transactions`)
            ]);

            const productsData = await productsRes.json();
            const usersData = await usersRes.json();
            const ordersData = await ordersRes.json();
            const transactionsData = await transactionsRes.json();

            const lowStock = productsData.filter(product => product.quantity <= 10);
            const productsWithOrderCount = productsData.map(product => ({
                ...product,
                orderCount: ordersData.filter(order => order.products.some(p => p.product === product._id)).length
            }));
            const sortedTopSelling = productsWithOrderCount.sort((a, b) => b.orderCount - a.orderCount).slice(0, 10);
            const totalRevenueCalc = transactionsData.reduce((total, t) => total + t.amount, 0);

            setMetrics({
                users: usersData.length,
                orders: ordersData.length,
                revenue: totalRevenueCalc,
                products: productsData.length,
                lowStockAlerts: lowStock.length
            });
            setLowStockProducts(lowStock);
            setTopSellingProducts(sortedTopSelling);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const Modal = ({ title, children, onClose }) => (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-700/50">
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>
                <div className="p-6 max-h-[70vh] overflow-auto">{children}</div>
            </div>
        </div>
    );

    const cardData = [
        { label: 'Total Users', value: metrics.users, icon: Users, gradient: 'from-emerald-500 to-cyan-500' },
        { label: 'Total Orders', value: metrics.orders, icon: ShoppingBag, gradient: 'from-blue-500 to-purple-500' },
        { label: 'Total Revenue', value: `$${metrics.revenue.toLocaleString()}`, icon: CreditCard, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Total Products', value: metrics.products, icon: Package, gradient: 'from-pink-500 to-rose-500' },
        { label: 'Low Stock Alerts', value: metrics.lowStockAlerts, icon: AlertTriangle, gradient: 'from-red-500 to-red-600', onClick: () => setShowLowStockModal(true) },
        { label: 'Top Selling', value: "View", icon: Award, gradient: 'from-slate-600 to-slate-700', onClick: () => setShowTopSellingModal(true), isText: true }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-slate-800/60 p-5 rounded-2xl animate-pulse h-24"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {cardData.map(({ label, value, icon: Icon, gradient, onClick, isText }) => (
                    <div
                        key={label}
                        onClick={onClick}
                        className={`bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
                    >
                        <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-slate-400">{label}</p>
                                <p className={`font-bold mt-1 ${isText ? 'text-lg' : 'text-2xl'}`}>
                                    {value}
                                </p>
                            </div>
                            <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg shadow-lg`}>
                                <Icon size={20} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showLowStockModal && (
                <Modal title="Low Stock Products" onClose={() => setShowLowStockModal(false)}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead >
                                <tr className="text-slate-400 uppercase text-sm">
                                    <th className="py-3 px-6 text-left">Product</th>
                                    <th className="py-3 px-6 text-center">Quantity</th>
                                    <th className="py-3 px-6 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-200 text-sm">
                                {lowStockProducts.map(p => (
                                    <tr key={p._id} className="border-b border-slate-700/50 hover:bg-slate-700/50">
                                        <td className="py-3 px-6 text-left font-medium">{p.name}</td>
                                        <td className="py-3 px-6 text-center">
                                            <span className="bg-red-500/20 text-red-300 py-1 px-3 rounded-full text-xs font-bold">{p.quantity}</span>
                                        </td>
                                        <td className="py-3 px-6 text-right font-medium">${p.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            {showTopSellingModal && (
                <Modal title="Top 10 Selling Products" onClose={() => setShowTopSellingModal(false)}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="text-slate-400 uppercase text-sm">
                                    <th className="py-3 px-6 text-left">Rank</th>
                                    <th className="py-3 px-6 text-left">Product</th>
                                    <th className="py-3 px-6 text-center">Units Sold</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-200 text-sm">
                                {topSellingProducts.map((p, index) => (
                                    <tr key={p._id} className="border-b border-slate-700/50 hover:bg-slate-700/50">
                                        <td className="py-3 px-6 font-bold text-lg">{index + 1}</td>
                                        <td className="py-3 px-6 font-medium">{p.name}</td>
                                        <td className="py-3 px-6 text-center text-lg font-bold text-emerald-400">{p.orderCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}
        </div>
    );
}
