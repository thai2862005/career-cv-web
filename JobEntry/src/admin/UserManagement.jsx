import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Table } from '../components/Table';
import { Badge } from '../components/Forms';
import { Button } from '../components/Button';
import { Search, Lock, Unlock, Mail, Edit, Trash2, Loader } from 'lucide-react';
import { userAPI, getAuthToken } from '../services/api';

export const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showMessageModal, setShowMessageModal] = useState(null);
  const [messageText, setMessageText] = useState('');

  const token = getAuthToken();

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search or filters change
  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const result = await userAPI.getAllUsers(token);
    if (result.success) {
      // Safely extract array from potential nested API response formats
      const rawData = result.data;
      const dataArray = Array.isArray(rawData) ? rawData : 
                        (Array.isArray(rawData?.data) ? rawData.data : 
                        (Array.isArray(rawData?.items) ? rawData.items : 
                        (Array.isArray(rawData?.content) ? rawData.content : [])));
      setUsers(dataArray);
    } else {
      setError(result.error || 'Failed to fetch users');
    }
    setLoading(false);
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => user && (
        String(user.name || '').toLowerCase().includes(term) ||
        String(user.email || '').toLowerCase().includes(term) ||
        String(user.id || '').toLowerCase().includes(term)
      ));
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (!user) return false;
        let roleData = user.role || user.Role || user.roleName || '';
        if (typeof roleData === 'object' && roleData !== null) {
          roleData = roleData.name || roleData.roleName || '';
        }
        return String(roleData).toUpperCase() === roleFilter.toUpperCase();
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user && user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleLockUser = async (userId) => {
    setActionLoading(userId);
    const result = await userAPI.lockUser(userId, token);
    
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'Locked' } : u));
      alert('User locked successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleUnlockUser = async (userId) => {
    setActionLoading(userId);
    const result = await userAPI.unlockUser(userId, token);
    
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'Active' } : u));
      alert('User unlocked successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(userId);
    const result = await userAPI.deleteUser(userId, token);
    
    if (result.success) {
      setUsers(users.filter(u => u.id !== userId));
      alert('User deleted successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleSendMessage = async (userId) => {
    if (!messageText.trim()) {
      alert('Please enter a message');
      return;
    }

    setActionLoading(userId);
    const result = await userAPI.sendMessage(userId, messageText, token);
    
    if (result.success) {
      setMessageText('');
      setShowMessageModal(null);
      alert('Message sent successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'Candidate',
    });
  };

  const handleUpdateUser = async () => {
    if (!editFormData.name?.trim() || !editFormData.email?.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setActionLoading(editingUser);
    const result = await userAPI.updateUser(editingUser, editFormData, token);
    
    if (result.success) {
      setUsers(users.map(u => 
        u.id === editingUser 
          ? { ...u, ...editFormData }
          : u
      ));
      setEditingUser(null);
      setEditFormData({});
      alert('User updated successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setActionLoading(null);
  };

  const columns = [
    { 
      header: 'User', 
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-active)] flex items-center justify-center font-bold text-xs">
            {String(row?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm">{row?.name || 'Unknown'}</p>
            <p className="text-xs text-slate-500">{row?.email || 'No email'}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Role', 
      cell: (row) => {
        let variant = 'gray';
        let roleData = row?.role || row?.Role || row?.roleName || '';
        
        // If the backend returns role as an object {id, name, description}
        if (typeof roleData === 'object' && roleData !== null) {
          roleData = roleData.name || roleData.roleName || String(roleData);
        }
        
        const roleStr = String(roleData);
        const roleUpper = roleStr.toUpperCase();
        
        if (roleUpper === 'ADMIN') variant = 'primary';
        if (roleUpper === 'HR') variant = 'blue';
        return <Badge variant={variant}>{roleStr || 'Unknown'}</Badge>;
      }
    },
    { 
      header: 'Status', 
      cell: (row) => (
        <Badge variant={row?.status === 'Active' ? 'green' : 'red'}>{row?.status || 'Unknown'}</Badge>
      )
    },
    { header: 'Joined', accessorKey: 'joined' },
    { 
      header: 'Actions', 
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleEditUser(row)}
            className="text-slate-400 hover:text-blue-500 transition-colors" 
            title="Edit"
            disabled={!row || actionLoading === row?.id}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setShowMessageModal(row?.id)}
            className="text-slate-400 hover:text-green-500 transition-colors" 
            title="Message"
            disabled={!row || actionLoading === row?.id}
          >
            <Mail className="h-4 w-4" />
          </button>
          {row?.status === 'Active' ? (
            <button 
              onClick={() => handleLockUser(row?.id)}
              className="text-slate-400 hover:text-red-500 transition-colors" 
              title="Lock Account"
              disabled={!row || actionLoading === row?.id}
            >
              {actionLoading === row?.id ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>
          ) : (
            <button 
              onClick={() => handleUnlockUser(row?.id)}
              className="text-slate-400 hover:text-green-500 transition-colors" 
              title="Unlock Account"
              disabled={!row || actionLoading === row?.id}
            >
              {actionLoading === row?.id ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
            </button>
          )}
          <button 
            onClick={() => handleDeleteUser(row?.id)}
            className="text-slate-400 hover:text-red-600 transition-colors" 
            title="Delete User"
            disabled={!row || actionLoading === row?.id}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-500 mt-1">Manage accounts for candidates, recruiters, and admins.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search users by name, email or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] w-full md:w-auto"
        >
          <option value="all">All Roles</option>
          <option value="Candidate">Candidate</option>
          <option value="HR">HR</option>
          <option value="Admin">Admin</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] w-full md:w-auto"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Locked">Locked</option>
        </select>
      </div>

      <Card className="!p-0 overflow-hidden">
        <Table columns={columns} data={filteredUsers} />
      </Card>
      
      <div className="flex justify-center pt-2">
        <Button variant="secondary" size="sm" className="mr-2">Previous</Button>
        <Button variant="primary" size="sm">1</Button>
        <Button variant="secondary" size="sm" className="ml-2">Next</Button>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Send Message to User</h3>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter your message..."
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                rows="4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowMessageModal(null);
                    setMessageText('');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendMessage(showMessageModal)}
                  disabled={actionLoading === showMessageModal}
                  className="px-4 py-2 bg-[var(--color-primary)] hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-md transition-colors"
                >
                  {actionLoading === showMessageModal ? (
                    <Loader className="h-4 w-4 animate-spin inline mr-1" />
                  ) : null}
                  Send
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Edit User</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Enter user name"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="Enter user email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={editFormData.role || 'Candidate'}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                >
                  <option value="Candidate">Candidate</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setEditFormData({});
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={actionLoading === editingUser}
                  className="px-4 py-2 bg-[var(--color-primary)] hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-md transition-colors"
                >
                  {actionLoading === editingUser ? (
                    <Loader className="h-4 w-4 animate-spin inline mr-1" />
                  ) : null}
                  Save Changes
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
