
import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { Button, Card, Modal } from '../common/UI';
import { MOCK_USER_LIST } from '../../constants';
import { User, UserRole } from '../../types';
import { 
    Filter, 
    Eye, 
    Lock, 
    Unlock, 
    User as UserIcon, 
    Building2, 
    Shield,
    Phone,
    Mail,
    MapPin,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

export const AdminUserList = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USER_LIST);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const roleMatch = filterRole === 'all' || user.role === filterRole;
            const statusMatch = filterStatus === 'all' || user.status === filterStatus;
            return roleMatch && statusMatch;
        });
    }, [users, filterRole, filterStatus]);

    const handleToggleStatus = (id: string) => {
        setUsers(prev => prev.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'active' ? 'disabled' : 'active' };
            }
            return u;
        }));
    };

    const handleView = (user: User) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    const columns: Column<User>[] = [
        { 
            key: 'name', 
            header: 'User Name', 
            sortable: true, 
            render: (u) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                         <img 
                            src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.name}`} 
                            alt={u.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.id}</p>
                    </div>
                </div>
            ) 
        },
        { 
            key: 'email', 
            header: 'Email Address', 
            sortable: true,
            render: (u) => <span className="text-sm text-gray-600">{u.email}</span>
        },
        { 
            key: 'role', 
            header: 'Role', 
            sortable: true, 
            render: (u) => (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    u.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    u.role === UserRole.VENDOR ? 'bg-teal-50 text-teal-700 border-teal-100' :
                    'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                    {u.role === UserRole.ADMIN && <Shield size={12}/>}
                    {u.role === UserRole.VENDOR && <Building2 size={12}/>}
                    {u.role === UserRole.SEAFARER && <UserIcon size={12}/>}
                    {u.role.toUpperCase()}
                </span>
            )
        },
        { 
            key: 'status', 
            header: 'Status', 
            sortable: true, 
            render: (u) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {u.status === 'active' ? 'Active' : 'Disabled'}
                </span>
            )
        }
    ];

    return (
        <>
            <DataTable<User>
                title="User Management"
                data={filteredUsers}
                columns={columns}
                searchKeys={['name', 'email']}
                addLabel="Add User (Disabled)" 
                // Creating users manually is usually disabled in this context or handled via invites
                onAdd={() => alert("Manual user creation is not enabled in this demo.")}
                filterOptions={
                    <div className="relative">
                        <Button 
                            variant={isFilterOpen ? 'primary' : 'outline'} 
                            className="px-3"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter size={18} />
                        </Button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-sm text-gray-700">Filter Users</h4>
                                    <button 
                                        onClick={() => { setFilterRole('all'); setFilterStatus('all'); }} 
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Reset
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">User Role</label>
                                        <select 
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                            value={filterRole}
                                            onChange={(e) => setFilterRole(e.target.value)}
                                        >
                                            <option value="all">All Roles</option>
                                            <option value={UserRole.SEAFARER}>Seafarer</option>
                                            <option value={UserRole.VENDOR}>Vendor</option>
                                            <option value={UserRole.ADMIN}>Admin</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Account Status</label>
                                        <select 
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="disabled">Disabled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                actions={(user) => (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleView(user)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                        >
                            <Eye size={18} />
                        </button>
                        
                        {user.role !== UserRole.ADMIN && (
                            <button 
                                onClick={() => handleToggleStatus(user.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    user.status === 'active' 
                                        ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                }`}
                                title={user.status === 'active' ? 'Disable Login' : 'Enable Login'}
                            >
                                {user.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                            </button>
                        )}
                    </div>
                )}
            />

            {/* User Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="User Profile Details"
            >
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                             <img 
                                src={selectedUser.avatarUrl || `https://ui-avatars.com/api/?name=${selectedUser.name}`} 
                                alt={selectedUser.name}
                                className="w-20 h-20 rounded-full object-cover border-4 border-gray-50"
                            />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                                        selectedUser.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        selectedUser.role === UserRole.VENDOR ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {selectedUser.role}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                        selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Contact Information</label>
                                <div className="mt-3 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Mail size={16} className="text-gray-400" />
                                        {selectedUser.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <Phone size={16} className="text-gray-400" />
                                        {selectedUser.phone || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <MapPin size={16} className="text-gray-400" />
                                        {selectedUser.address || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Account Details</label>
                                <div className="mt-3 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">User ID</span>
                                        <span className="font-mono text-gray-900">{selectedUser.id}</span>
                                    </div>
                                    
                                    {/* Role Specific Details */}
                                    {selectedUser.role === UserRole.SEAFARER && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Rank</span>
                                                <span className="font-medium text-gray-900">{selectedUser.details?.rank || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Nationality</span>
                                                <span className="font-medium text-gray-900">{selectedUser.details?.nationality || 'N/A'}</span>
                                            </div>
                                        </>
                                    )}

                                    {selectedUser.role === UserRole.VENDOR && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Website</span>
                                                <a href={`https://${selectedUser.details?.website}`} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">
                                                    Open Link
                                                </a>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-3">Account Actions</h4>
                            <div className="flex gap-3">
                                {selectedUser.status === 'active' ? (
                                    <Button 
                                        variant="danger" 
                                        className="w-full"
                                        onClick={() => {
                                            handleToggleStatus(selectedUser.id);
                                            setIsDetailsOpen(false);
                                        }}
                                        disabled={selectedUser.role === UserRole.ADMIN}
                                    >
                                        <Lock size={16} /> Disable Login Access
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="secondary" 
                                        className="w-full"
                                        onClick={() => {
                                            handleToggleStatus(selectedUser.id);
                                            setIsDetailsOpen(false);
                                        }}
                                    >
                                        <Unlock size={16} /> Enable Login Access
                                    </Button>
                                )}
                            </div>
                            {selectedUser.role === UserRole.ADMIN && (
                                <p className="text-xs text-center text-gray-400 mt-2">Admin accounts cannot be disabled.</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
