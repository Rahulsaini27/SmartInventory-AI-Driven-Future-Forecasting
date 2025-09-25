import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Download, CreditCard, DollarSign, CheckCircle, AlertCircle, Loader, X, ArrowUpDown } from 'lucide-react';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('transactionDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/transactions`)
            .then(res => setTransactions(res.data))
            .catch(() => setError('Failed to load transactions.'))
            .finally(() => setLoading(false));
    }, []);

    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);
    };

    const filteredTransactions = transactions
        .filter(t => 
            (filterStatus === 'all' || t.status === filterStatus) &&
            (t.order.toLowerCase().includes(searchTerm.toLowerCase()) || t.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            const fieldA = a[sortField];
            const fieldB = b[sortField];
            let comparison = 0;
            if (fieldA > fieldB) comparison = 1;
            else if (fieldA < fieldB) comparison = -1;
            return sortDirection === 'desc' ? comparison * -1 : comparison;
        });

    const getStatusBadge = (status) => {
        const statuses = {
          completed: 'bg-emerald-500/20 text-emerald-300',
          failed: 'bg-red-500/20 text-red-300',
          initiated: 'bg-amber-500/20 text-amber-300',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center ${statuses[status] || 'bg-slate-700 text-slate-300'}`}>{status}</span>;
    };
    
    const StatCard = ({ icon, label, value, gradient }) => (
      <div className={`bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`}></div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg shadow-lg`}>{icon}</div>
        </div>
      </div>
    );
    
    const totalRevenue = transactions.reduce((sum, tx) => tx.status === 'completed' ? sum + tx.amount : sum, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<CreditCard size={20}/>} label="Total Transactions" value={transactions.length} gradient="from-emerald-500 to-cyan-500" />
                <StatCard icon={<DollarSign size={20}/>} label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} gradient="from-blue-500 to-purple-500" />
                <StatCard icon={<CheckCircle size={20}/>} label="Completed" value={transactions.filter(t => t.status === 'completed').length} gradient="from-emerald-500 to-green-500" />
                <StatCard icon={<AlertCircle size={20}/>} label="Failed" value={transactions.filter(t => t.status === 'failed').length} gradient="from-red-500 to-rose-500" />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-700/50 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg"/>
                </div>
                <div className="flex items-center gap-3">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2">
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="initiated">Initiated</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader className="animate-spin text-emerald-400" size={32} /></div>
            ) : (
                <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700/50">
                            <thead className="bg-slate-800">
                                <tr>
                                    {['Transaction ID', 'Date', 'Payment Method', 'Amount', 'Status'].map(h => (
                                        <th key={h} onClick={() => handleSort(h.toLowerCase().replace(' ', ''))} className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer">
                                            <div className="flex items-center">{h} <ArrowUpDown size={14} className="ml-2"/></div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredTransactions.map(t => (
                                    <tr key={t._id} className="hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-mono text-sm text-slate-400">#{t._id.slice(-6)}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300">{new Date(t.transactionDate).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-slate-300 capitalize">{t.paymentMethod}</td>
                                        <td className="px-6 py-4 font-semibold text-white">${t.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => setSelectedTransaction(t)} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {selectedTransaction && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Transaction Details</h3>
                            <button onClick={() => setSelectedTransaction(null)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong className="text-slate-400 w-32 inline-block">ID:</strong> {selectedTransaction._id}</p>
                            <p><strong className="text-slate-400 w-32 inline-block">Date:</strong> {new Date(selectedTransaction.transactionDate).toLocaleString()}</p>
                            <p><strong className="text-slate-400 w-32 inline-block">Order ID:</strong> {selectedTransaction.order}</p>
                            <p><strong className="text-slate-400 w-32 inline-block">User ID:</strong> {selectedTransaction.user}</p>
                            <p><strong className="text-slate-400 w-32 inline-block">Payment:</strong> {selectedTransaction.paymentMethod}</p>
                            <p><strong className="text-slate-400 w-32 inline-block">Status:</strong> {getStatusBadge(selectedTransaction.status)}</p>
                            <p><strong className="text-slate-400 w-32 inline-block">Amount:</strong> <span className="font-bold text-lg">${selectedTransaction.amount.toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
