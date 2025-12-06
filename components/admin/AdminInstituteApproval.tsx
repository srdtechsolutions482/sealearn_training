import React, { useState, useMemo, useEffect } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { Button, Card, Modal, Input } from '../common/UI';
import { API_CONFIG } from '../../apiconfig'; 
import { 
    Filter, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Calendar, 
    User,  
    Building2, 
    MessageCircle,
    FileText,
    Edit
} from 'lucide-react';

interface Institute {
    id: string | number;  // Maps to institute_id
    institute_id: number;
    institute_name: string;
    accreditation_no: string;
    house_no: string;
    street_name: string;
    landmark: string;
    country: string;
    state: string;
    postcode: string;
    admin_contact_person_name: string;
    admin_contact_person_phone: string;
    admin_contact_person_email: string;
    customer_care_phone: string;
    customer_care_email: string;
    license_number: string;
    issuing_authority: string;
    created_by: string;
    created_at: string;
    updated_by: string | null;
    updated_at: string | null;
    is_approved: number; // 0=pending, 1=approved, 2=rejected, 3=suspended

}

export const AdminInstituteApproval = () => {
    const [pendingInstitutes, setPendingInstitutes] = useState<Institute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [comments, setComments] = useState('');
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'suspend'>('approve');
    
    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    // Fetch institutes data
    useEffect(() => {
        const fetchInstitutes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_INSTITUTE_DETAILS}`, {
                    method: 'GET',
                    headers: API_CONFIG.HEADERS,
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data: Institute[] = await response.json();
                setPendingInstitutes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch institutes');
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutes();
    }, []);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    const getStatusText = (status: number): string => {
        switch(status) {
            case 1: return 'approved';
            case 2: return 'rejected';
            case 3: return 'suspended';
            default: return 'pending';
        }
    };

    const getStatusColor = (status: number): string => {
        switch(status) {
            case 1: return 'bg-green-100 text-green-800 border-green-200';
            case 2: return 'bg-red-100 text-red-800 border-red-200';
            case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const filteredInstitutes = useMemo(() => {
        return pendingInstitutes.filter(institute => {
            const status = getStatusText(institute.is_approved);
            if (filterStatus === 'all') return true;
            if (filterStatus === 'approved' && status === 'approved') return true;
            if (filterStatus === 'pending' && status === 'pending') return true;
            if (filterStatus === 'rejected' && status === 'rejected') return true;
            if (filterStatus === 'suspended' && status === 'suspended') return true;
            return false;
        });
    }, [pendingInstitutes, filterStatus]);

    // Pagination logic
    const paginatedInstitutes = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredInstitutes.slice(startIndex, endIndex);
    }, [filteredInstitutes, currentPage, rowsPerPage]);

    const totalPages = Math.max(1, Math.ceil(filteredInstitutes.length / rowsPerPage));

    const handleViewApproval = (institute: Institute) => {
        setSelectedInstitute(institute);
        setComments('');
        setSelectedAction('approve');
        setIsApprovalModalOpen(true);
    };

    const handleApprovalAction = async () => {
        if (!selectedInstitute) return;

        try {
            // Map action to is_approved value (0,1,2,3)
            const statusMap: Record<string, number> = {
                approve: 1,
                reject: 2,
                suspend: 3
            };
            const newStatus = statusMap[selectedAction];

            // ✅ FIXED URL - passes correct is_approved value (0,1,2,3)
            const response = await fetch(
                `${API_CONFIG.BASE_URL}institutes/${selectedInstitute.institute_id}/approve?is_approved=${newStatus}`, 
                {
                    method: 'PUT',
                    headers: {
                        ...API_CONFIG.HEADERS,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        is_approved: newStatus,
                        comments: comments
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }

            alert('Institute status updated successfully!');
            window.location.reload();
        } catch (err) {
            console.error('Approval action failed:', err);
            alert('Failed to update institute status');
        }

        setIsApprovalModalOpen(false);
        setSelectedInstitute(null);
    };

    const columns: Column<Institute>[] = [
        { 
            key: 'institute_name', 
            header: 'Institute Name', 
            sortable: true, 
            render: (institute) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="text-white" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{institute.institute_name || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        { 
            key: 'created_at', 
            header: 'Registration Date', 
            sortable: true,
            render: (institute) => (
                <div className="text-sm text-gray-900 font-mono">
                    <Calendar size={16} className="inline mr-1 text-gray-400" />
                    {institute.created_at ? new Date(institute.created_at).toLocaleDateString() : 'N/A'}
                </div>
            )
        },
        { 
            key: 'admin_contact_person_name', 
            header: 'Contact Person', 
            sortable: true,
            render: (institute) => (
                <div className="space-y-1 text-sm">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                        <User size={14} /> {institute.admin_contact_person_name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">{institute.admin_contact_person_email || 'N/A'}</div>
                </div>
            )
        },
        { 
            key: 'is_approved', 
            header: 'Status', 
            sortable: true, 
            render: (institute) => {
                const status = getStatusText(institute.is_approved);
                const statusColor = getStatusColor(institute.is_approved);
                
                return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColor}`}>
                        {institute.is_approved === 1 && <CheckCircle size={12} />}
                        {institute.is_approved === 0 && <Clock size={12} />}
                        {institute.is_approved === 2 && <XCircle size={12} />}
                        {institute.is_approved === 3 && <Clock size={12} className="rotate-180" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            }
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-gray-500">Loading institutes for approval...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-red-500 text-center">
                    <div className="text-lg font-medium mb-2">Failed to load institutes</div>
                    <div className="text-sm mb-4">{error}</div>
                    <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <DataTable<Institute>
                title="Institute Approval"
                data={paginatedInstitutes.map((institute: Institute) => ({ 
        ...institute, 
        id: institute.institute_id  // ✅ Maps institute_id to required id field
    }))}
                columns={columns}
                searchKeys={['institute_name', 'admin_contact_person_name']}
                addLabel="No Add Action"
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
                                    <h4 className="font-bold text-sm text-gray-700">Filter Status</h4>
                                    <button onClick={() => setFilterStatus('all')} className="text-xs text-blue-600 hover:underline">Reset</button>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                }
                actions={(institute) => (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleViewApproval(institute)}
                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all shadow-sm border border-gray-100 hover:shadow-md"
                            title="Review & Approve"
                        >
                            <Edit size={18} />
                        </button>
                    </div>
                )}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-lg">
                <div className="text-sm text-gray-700">
                    Showing {(filteredInstitutes.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1)}–
                    {Math.min(currentPage * rowsPerPage, filteredInstitutes.length)} of {filteredInstitutes.length} institutes
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border rounded-md">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Approval Modal */}
            <Modal
                isOpen={isApprovalModalOpen}
                onClose={() => setIsApprovalModalOpen(false)}
                title="Institute Approval Action"
            >
                {selectedInstitute && (
                    <div className="space-y-6 max-h-[80vh]">
                        {/* Header */}
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Building2 className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedInstitute.institute_name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar size={14} /> Registered: {new Date(selectedInstitute.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MessageCircle size={16} /> Comments <span className="text-orange-600">*</span>
                            </label>
                            <Input
                                as="textarea"
                                rows={4}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Enter your comments or reasons (max 2000 characters)..."
                                className="resize-none"
                                maxLength={2000}
                            />
                            <p className="text-xs text-gray-500 mt-1">{comments.length}/2000 characters</p>
                        </div>

                        {/* Action Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                Action <span className="text-orange-600">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'approve' as const, label: 'Approve', icon: CheckCircle, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                                    { value: 'reject' as const, label: 'Reject', icon: XCircle, color: 'bg-red-50 text-red-700 hover:bg-red-100' },
                                    { value: 'suspend' as const, label: 'Suspend', icon: Clock, color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' }
                                ].map(({ value, label, icon: Icon, color }) => (
                                    <Button
                                        key={value}
                                        variant="outline"
                                        className={`${color} border-2 ${selectedAction === value ? 'border-green-300 bg-green-100 ring-2 ring-green-200' : 'border-gray-200'}`}
                                        onClick={() => setSelectedAction(value)}
                                    >
                                        <Icon size={16} className="mr-2" />
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100 pb-3">
                            <Button 
                                variant={selectedAction === 'approve' ? 'secondary' : 'danger'}
                                className="flex-1"
                                onClick={handleApprovalAction}
                                disabled={!comments.trim()}
                            >
                                {selectedAction === 'approve' ? <CheckCircle size={18} className="mr-2" /> : <XCircle size={18} className="mr-2" />}
                                {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
                            </Button>
                            <Button 
                                variant="outline"
                                className="px-6"
                                onClick={() => setIsApprovalModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
