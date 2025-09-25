
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, X, Plus, Search, Filter, Download, Users, UserCheck, UserCog, Shield } from 'lucide-react';

function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', email: '', password: '', role: 'Staff' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

    const fetchUsers = () => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/users`)
      .then(response => setUsers(response.data))
      .catch(() => setError('Failed to load users. Please try again.'))
      .finally(() => setLoading(false));
  };
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!userToDelete) return;
    axios.delete(`${import.meta.env.VITE_API_URL}/users/${userToDelete._id}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== userToDelete._id));
        setShowDeleteModal(false);
        setUserToDelete(null);
      })
      .catch(() => {
        setError('Failed to delete user.');
        setShowDeleteModal(false);
      });
  };

  const openAddUserModal = () => {
    setCurrentUser({ username: '', email: '', password: '', role: 'Staff' });
    setIsEditing(false);
    setShowUserModal(true);
    setFormError('');
  };

  const openEditUserModal = (user) => {
    setCurrentUser({ ...user, password: '' });
    setIsEditing(true);
    setShowUserModal(true);
    setFormError('');
  };

  const handleInputChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    if (!currentUser.username || !currentUser.email || (!isEditing && !currentUser.password)) {
      setFormError('Please fill in all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentUser.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    const apiCall = isEditing 
      ? axios.put(`${import.meta.env.VITE_API_URL}/users/${currentUser._id}`, currentUser)
      : axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, currentUser);

    apiCall
      .then(response => {
        if (isEditing) {
          setUsers(users.map(u => (u._id === currentUser._id ? response.data : u)));
        } else {
          setUsers([...users, response.data]);
        }
        setShowUserModal(false);

      })
      .catch(error => {
        setFormError(error.response?.data?.message || 'Operation failed. Please try again.');
      });
  };

  const filteredUsers = users.filter(user => 
    (user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === '' || user.role === roleFilter)
  );

  const getRoleBadge = (role) => {
    const roles = {
      Admin: 'bg-red-500/20 text-red-300 border-red-500/30',
      Manager: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      Staff: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roles[role] || 'bg-slate-700 text-slate-300'}`}>{role}</span>;
  };

  const exportToCSV = () => {
    const headers = "Username,Email,Role,UserID\n";
    const rows = filteredUsers.map(u => `"${u.username}","${u.email}","${u.role}","${u._id}"`).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <div className="flex space-x-3">
          <button onClick={exportToCSV} className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} className="mr-2" /> Export CSV
          </button>
          <button onClick={openAddUserModal} className="flex items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-emerald-500/25">
            <Plus size={16} className="mr-2" /> Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users size={20}/>} label="Total Users" value={users.length} gradient="from-emerald-500 to-cyan-500" />
          <StatCard icon={<Shield size={20}/>} label="Admins" value={users.filter(u => u.role === 'Admin').length} gradient="from-red-500 to-rose-500" />
          <StatCard icon={<UserCog size={20}/>} label="Managers" value={users.filter(u => u.role === 'Manager').length} gradient="from-blue-500 to-purple-500" />
          <StatCard icon={<UserCheck size={20}/>} label="Staff" value={users.filter(u => u.role === 'Staff').length} gradient="from-amber-500 to-orange-500" />
      </div>

      <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-slate-700/50 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
          <button onClick={() => { setSearchTerm(''); setRoleFilter(''); }} className="flex items-center text-slate-400 hover:text-white transition-colors">
            <Filter size={14} className="mr-1.5" /> Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader className="animate-spin text-emerald-400" size={32} /></div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-300 p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-800">
                <tr>
                  {['User', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.username}</div>
                          <div className="text-sm text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-500/20 text-emerald-300">Active</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => openEditUserModal(user)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                      <button onClick={() => confirmDelete(user)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-12 text-slate-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-slate-300">Are you sure you want to delete <span className="font-semibold text-white">{userToDelete?.username}</span>? This is irreversible.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700/50 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{isEditing ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            {formError && <div className="mb-4 p-3 bg-red-500/10 text-red-300 rounded-lg">{formError}</div>}
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <input name="username" value={currentUser.username} onChange={handleInputChange} placeholder="Username*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
              <input name="email" type="email" value={currentUser.email} onChange={handleInputChange} placeholder="Email*" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" required />
              <input name="password" type="password" value={currentUser.password} onChange={handleInputChange} placeholder={isEditing ? 'New Password (optional)' : 'Password*'} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" required={!isEditing} />
              <select name="role" value={currentUser.role} onChange={handleInputChange} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>Staff</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold">{isEditing ? 'Update User' : 'Add User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUserPage;
