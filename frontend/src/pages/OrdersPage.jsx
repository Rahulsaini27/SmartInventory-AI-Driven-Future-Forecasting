
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, Download, Plus, X, ShoppingCart, Trash2, Edit } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processingOrder, setProcessingOrder] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes] = await Promise.all([
                  axios.get(`${import.meta.env.VITE_API_URL}/orders`),
          axios.get(`${import.meta.env.VITE_API_URL}/products`)

        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPrice = selectedProducts.reduce((sum, item) => {
    const product = products.find(p => p._id === item.product);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleOpenCreateModal = () => {
    setCurrentOrder(null);
    setSelectedProducts([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (order) => {
    setCurrentOrder(order);
    setSelectedProducts(order.products.map(p => ({ product: p.product._id, quantity: p.quantity })));
    setIsModalOpen(true);
  };

  const handleSubmitOrder = async () => {
    if (selectedProducts.length === 0 || !userId) {
      alert('Please add products and ensure you are logged in.');
      return;
    }
    const orderData = {
      products: selectedProducts,
      totalPrice,
      user: userId,
      status: currentOrder ? currentOrder.status : 'pending'
    };
    try {
      if (currentOrder) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${currentOrder._id}`, orderData);
        setOrders(orders.map(o => (o._id === currentOrder._id ? res.data : o)));
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);
        setOrders([...orders, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save the order.');
    }
  };

 const handleCompleteTransaction = async () => {
    if (!processingOrder || !paymentMethod) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/transactions/complete`, {
        paymentMethod,
        user: processingOrder.user,
        order: processingOrder._id,
        products: processingOrder.products,
        amount: processingOrder.totalPrice
      });
      setOrders(orders.map(o => o._id === processingOrder._id ? { ...o, status: 'completed' } : o));
      setIsPaymentModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete transaction.');
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      completed: 'bg-emerald-500/20 text-emerald-300',
      pending: 'bg-amber-500/20 text-amber-300',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statuses[status] || 'bg-slate-700 text-slate-300'}`}>{status}</span>;
  };

  // Simplified add/remove product functions
  const handleAddProduct = () => setSelectedProducts([...selectedProducts, { product: '', quantity: 1 }]);
  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] = value;
    setSelectedProducts(updated);
  };
  const handleRemoveProduct = (index) => setSelectedProducts(selectedProducts.filter((_, i) => i !== index));

  if (loading) return <div className="flex justify-center py-12"><Loader className="animate-spin text-emerald-400" size={32} /></div>;
  if (error) return <div className="bg-red-500/10 text-red-300 p-4 rounded-lg text-center">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <div className="flex space-x-3">
          {/* Add Export CSV button if needed */}
          <button onClick={handleOpenCreateModal} className="flex items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
            <Plus size={16} className="mr-2" /> Add Order
          </button>
        </div>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead className="bg-slate-800">
              <tr>
                {['Order ID', 'Date', 'Products', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider ${h === 'Actions' || h === 'Total' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{order.products.length} items</td>
                  <td className="px-6 py-4 text-right font-semibold text-white">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">{getStatusBadge(order.status || 'pending')}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenEditModal(order)} className="p-2 text-cyan-400 hover:text-cyan-300"><Edit size={16} /></button>
                    {order.status !== 'completed' && <button onClick={() => { setProcessingOrder(order); setIsPaymentModalOpen(true); }} className="p-2 text-emerald-400 hover:text-emerald-300">Pay</button>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center py-16"><ShoppingCart size={40} className="mx-auto text-slate-500" /><h3 className="mt-4 text-lg font-medium text-white">No Orders Found</h3></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-6">{currentOrder ? 'Edit Order' : 'Create Order'}</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select value={item.product} onChange={e => handleProductChange(index, 'product', e.target.value)} className="flex-grow bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} - ${p.price}</option>)}
                  </select>
                  <input type="number" value={item.quantity} onChange={e => handleProductChange(index, 'quantity', parseInt(e.target.value))} min="1" className="w-20 bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center" />
                  <button onClick={() => handleRemoveProduct(index)} className="text-red-400"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
            <button onClick={handleAddProduct} className="text-emerald-400 text-sm mt-4">+ Add Product</button>
            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
              <span className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</span>
              <div className="flex gap-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700/50 rounded-lg">Cancel</button>
                <button onClick={handleSubmitOrder} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">
                  {currentOrder ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Complete Transaction</h3>
            <p className="text-slate-400 mb-6">Total: <span className="font-bold text-white">${processingOrder.totalPrice.toFixed(2)}</span></p>
            <div className="space-y-3 mb-6">
              <button onClick={() => { setPaymentMethod('cash'); setShowQR(false); }} className={`w-full text-left p-3 rounded-lg border-2 ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600'}`}>Cash</button>
              <button onClick={() => { setPaymentMethod('online'); setShowQR(true); }} className={`w-full text-left p-3 rounded-lg border-2 ${paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-600'}`}>Online / QR</button>
            </div>
            {showQR && (
              <div className="p-4 bg-white rounded-lg mb-6 flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Order-${processingOrder._id}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
            )}

            {/* {showQR && <div className="p-4 bg-white rounded-lg mb-6"><div className="aspect-square w-full bg-slate-300 animate-pulse"></div></div>} */}
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 bg-slate-700/50 rounded-lg">Cancel</button>
              <button onClick={handleCompleteTransaction} disabled={!paymentMethod} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold disabled:bg-slate-600">Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
