
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Loader, AlertCircle, Download, AppWindow, X } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`);
        setCategories(categories.filter(c => c._id !== categoryId));
      } catch (error) {
        alert('Failed to delete category.');
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (categoryName.trim() === '') return;
    const data = { name: categoryName, description: categoryDescription };
    try {
      if (editingCategoryId) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/categories/${editingCategoryId}`, data);
        setCategories(categories.map(c => (c._id === editingCategoryId ? res.data : c)));
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/categories`, data);
        setCategories([...categories, res.data]);
      }
      setShowModal(false);
    } catch (error) {
      alert(`Failed to save category.`);
    }
  };
 
  const handleOpenModal = (category = null) => {
    if (category) {
      setCategoryName(category.name);
      setCategoryDescription(category.description || '');
      setEditingCategoryId(category._id);
    } else {
      setCategoryName('');
      setCategoryDescription('');
      setEditingCategoryId(null);
    }
    setShowModal(true);
  };

  

  const exportToCSV = () => {
    const headers = "CategoryName,Description,CategoryID\n";
    const rows = filteredCategories.map(c => `"${c.name}","${c.description || ''}","${c._id}"`).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `categories-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <div className="flex space-x-3">
          <button onClick={exportToCSV} className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} className="mr-2" /> Export CSV
          </button>
          <button onClick={() => handleOpenModal()} className="flex items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-emerald-500/25">
            <Plus size={16} className="mr-2" /> Add Category
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-emerald-400" size={32} /></div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-300 p-4 rounded-lg text-center flex items-center justify-center">
            <AlertCircle size={20} className="mr-3" /> {error}
        </div>
      ) : (
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden">
          {filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredCategories.map(cat => (
                    <tr key={cat._id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 font-medium text-white">{cat.name}</td>
                      <td className="px-6 py-4 text-slate-300">{cat.description || 'N/A'}</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button onClick={() => handleOpenModal(cat)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                        <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
                <AppWindow size={40} className="mx-auto text-slate-500"/>
                <h3 className="mt-4 text-lg font-medium text-white">No Categories Found</h3>
                <p className="mt-1 text-sm text-slate-400">{searchTerm ? 'Try a different search term.' : 'Get started by adding a category.'}</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Category Name*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
              <textarea value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)} placeholder="Description (optional)" rows="3" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold">{editingCategoryId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
