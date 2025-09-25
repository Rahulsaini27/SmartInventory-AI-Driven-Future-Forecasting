
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QrReader } from '@blackbox-vision/react-qr-reader';
import { Download, Edit2, Loader, Plus, QrCode, Search, Trash2, X, Package, ArrowUpDown } from 'lucide-react';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [formState, setFormState] = useState({ name: '', description: '', sku: '', price: '', quantity: '', category: '' });
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/products`),
                    axios.get(`${import.meta.env.VITE_API_URL}/categories`)
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const resetForm = () => {
        setFormState({ name: '', description: '', sku: '', price: '', quantity: '', category: '' });
        setIsEditing(false);
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setFormState({ ...product, price: product.price.toString(), quantity: product.quantity.toString() });
            setIsEditing(true);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
        setScanning(false);
    };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { ...formState, price: parseFloat(formState.price), quantity: parseInt(formState.quantity) };
        try {
            if (isEditing) {
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/products/${productData._id}`, productData);
                setProducts(products.map(p => p._id === productData._id ? res.data : p));
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/products`, productData);
                setProducts([...products, res.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };
    
    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/products/${productId}`);
                setProducts(products.filter(p => p._id !== productId));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };
    const handleSort = (field) => {
        const order = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortOrder(order);
    };
    
    const sortedAndFilteredProducts = products
        .filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const fieldA = a[sortBy];
            const fieldB = b[sortBy];
            let comparison = 0;
            if (fieldA > fieldB) {
                comparison = 1;
            } else if (fieldA < fieldB) {
                comparison = -1;
            }
            return sortOrder === 'desc' ? comparison * -1 : comparison;
        });

    const getStockStatusColor = (quantity) => {
        if (quantity > 10) return 'bg-emerald-500/20 text-emerald-300';
        if (quantity > 0) return 'bg-amber-500/20 text-amber-300';
        return 'bg-red-500/20 text-red-300';
    };

    const exportToCSV = () => {
      const headers = "ProductName,SKU,Description,Price,Quantity,Category\n";
      const rows = sortedAndFilteredProducts.map(p => {
        const catName = categories.find(c => c._id === p.category)?.name || 'N/A';
        return `"${p.name}","${p.sku}","${p.description || ''}","${p.price}","${p.quantity}","${catName}"`;
      }).join('\n');
      const csv = headers + rows;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Inventory</h1>
                <div className="flex space-x-3">
                    <button onClick={exportToCSV} className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <Download size={16} className="mr-2" /> Export CSV
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-emerald-500/25">
                        <Plus size={16} className="mr-2" /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-700/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
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
                                    {['name', 'sku', 'price', 'quantity'].map(field => (
                                        <th key={field} onClick={() => handleSort(field)} className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer">
                                            <div className="flex items-center">{field} <ArrowUpDown size={14} className="ml-2"/></div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {sortedAndFilteredProducts.length > 0 ? sortedAndFilteredProducts.map(p => (
                                    <tr key={p._id} className="hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-white">{p.name}</div>
                                            <div className="text-sm text-slate-400">{categories.find(c => c._id === p.category)?.name || 'Uncategorized'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{p.sku}</td>
                                        <td className="px-6 py-4 text-slate-300">${p.price.toFixed(2)}</td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(p.quantity)}`}>{p.quantity} in stock</span></td>
                                        <td className="px-6 py-4 text-right space-x-4">
                                            <button onClick={() => handleOpenModal(p)} className="text-cyan-400 hover:text-cyan-300"><Edit2 size={16} /></button>
                                            <button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5" className="text-center py-16">
                                        <Package size={40} className="mx-auto text-slate-500"/>
                                        <h3 className="mt-4 text-lg font-medium text-white">No Products Found</h3>
                                        <p className="mt-1 text-sm text-slate-400">{searchTerm ? 'Try a different search term.' : 'Get started by adding a product.'}</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input name="name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} placeholder="Product Name*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3" required />
                                <div className="relative">
                                    <input name="sku" value={formState.sku} onChange={e => setFormState({...formState, sku: e.target.value})} placeholder="SKU*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 pr-10" required />
                                    <button type="button" onClick={() => setScanning(!scanning)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"><QrCode size={18}/></button>
                                </div>
                                {scanning && (
                                    <div className="md:col-span-2 p-2 border-2 border-dashed border-slate-600 rounded-lg">
                                        <QrReader constraints={{ facingMode: 'environment' }} onResult={(res, err) => { if(res) { setFormState({...formState, sku: res.text}); setScanning(false); }}} style={{ width: '100%' }} />
                                    </div>
                                )}
                                <input name="price" type="number" value={formState.price} onChange={e => setFormState({...formState, price: e.target.value})} placeholder="Price*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3" required />
                                <input name="quantity" type="number" value={formState.quantity} onChange={e => setFormState({...formState, quantity: e.target.value})} placeholder="Quantity*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3" required />
                                <select name="category" value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} className="md:col-span-2 w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <textarea name="description" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} placeholder="Description" rows="3" className="md:col-span-2 w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3" />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold">{isEditing ? 'Update Product' : 'Add Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
