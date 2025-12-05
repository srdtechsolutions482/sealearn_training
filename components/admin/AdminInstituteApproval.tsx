import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { Button, Card, Modal, Input } from '../common/UI';
import { MOCK_VENDORS } from '../../constants';
import { Vendor} from '../../types';
import { 
    Filter, 
    Eye, 
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

export const AdminInstituteApproval = () => {
    const [pendingInstitutes, setPendingInstitutes] = useState<Vendor[]>(
        MOCK_VENDORS.filter(v => ['pending', 'rejected', 'approved', 'suspended'].includes(v.status))
    );
    const [selectedInstitute, setSelectedInstitute] = useState<Vendor | null>(null);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [comments, setComments] = useState('');
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'suspend'>('approve');
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredInstitutes = useMemo(() => {
        return pendingInstitutes.filter(institute => {
            const statusMatch = filterStatus === 'all' || institute.status === filterStatus;
            return statusMatch;
        });
    }, [pendingInstitutes, filterStatus]);

    const handleViewApproval = (institute: Vendor) => {
        setSelectedInstitute(institute);
        setSelectedCourses([]);
        setComments('');
        setSelectedAction('approve');
        setIsApprovalModalOpen(true);
    };

    const handleApprovalAction = () => {
        if (!selectedInstitute) return;

        // Map action to status
        const statusMap: Record<string, string> = {
            approve: 'approved',
            reject: 'rejected',
            suspend: 'suspended'
        };
        const newStatus = statusMap[selectedAction];

        // Update institute status
        setPendingInstitutes(prev => prev.map(inst => 
            inst.id === selectedInstitute.id 
                ? { ...inst, status: newStatus }
                : inst
        ));

        // Close modal and reset
        setIsApprovalModalOpen(false);
        setSelectedInstitute(null);
    };

    const toggleCourseSelection = (course: string) => {
        setSelectedCourses(prev => 
            prev.includes(course)
                ? prev.filter(c => c !== course)
                : [...prev, course]
        );
    };

    const columns: Column<Vendor>[] = [
        { 
            key: 'companyName', 
            header: 'Institute Name', 
            sortable: true, 
            render: (v) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="text-white" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{v.companyName}</p>
                    </div>
                </div>
            )
        },
        { 
            key: 'createdAt', 
            header: 'Registration Date', 
            sortable: true,
            render: (v) => (
                <div className="text-sm text-gray-900 font-mono">
                    <Calendar size={16} className="inline mr-1 text-gray-400" />
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A'}
                </div>
            )
        },
        { 
            key: 'contactPerson', 
            header: 'Contact Person', 
            sortable: true,
            render: (v) => (
                <div className="space-y-1 text-sm">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                        <User size={14} /> {v.contactPerson || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">{v.email}</div>
                </div>
            )
        },
        { 
            key: 'status', 
            header: 'Status', 
            sortable: true, 
            render: (v) => {
                const getStatusStyle = (status: string) => {
                    switch(status) {
                        case 'approved':
                            return 'bg-green-100 text-green-800 border-green-200';
                        case 'pending':
                            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                        case 'rejected':
                            return 'bg-red-100 text-red-800 border-red-200';
                        case 'suspended':
                            return 'bg-orange-100 text-orange-800 border-orange-200';
                        default:
                            return 'bg-gray-100 text-gray-800 border-gray-200';
                    }
                };

                return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(v.status)}`}>
                        {v.status === 'approved' && <CheckCircle size={12} />}
                        {v.status === 'pending' && <Clock size={12} />}
                        {v.status === 'rejected' && <XCircle size={12} />}
                        {v.status === 'suspended' && <Clock size={12} className="rotate-180" />}
                        {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </span>
                );
            }
        }
    ];

    return (
        <>
            <DataTable<Vendor>
                title="Institute Approval"
                data={filteredInstitutes}
                columns={columns}
                searchKeys={['companyName', 'contactPerson']}
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
                                    <button 
                                        onClick={() => setFilterStatus('all')} 
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Reset
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
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

            {/* Institute Approval Modal - UNCHANGED */}
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
                                <h3 className="text-xl font-bold text-gray-900">{selectedInstitute.companyName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar size={14} /> Registered: {selectedInstitute.createdAt ? new Date(selectedInstitute.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Course Selection */}
                        <Card className="p-6">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
                                <FileText size={20} /> Select Courses to Approve
                            </h4>
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {selectedInstitute.coursesOffered && selectedInstitute.coursesOffered.length > 0 ? (
                                    selectedInstitute.coursesOffered.map((course, idx) => (
                                        <label key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedCourses.includes(course)}
                                                onChange={() => toggleCourseSelection(course)}
                                                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                            />
                                            <span className="text-sm font-medium text-gray-900">{course}</span>
                                            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                                                selectedCourses.includes(course)
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {selectedCourses.includes(course) ? 'Selected' : 'Pending'}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic py-4 text-center">No courses available for approval</p>
                                )}
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                                <span>{selectedCourses.length} of {selectedInstitute.coursesOffered?.length || 0} courses selected</span>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedCourses(selectedInstitute.coursesOffered || [])}
                                >
                                    Select All
                                </Button>
                            </div>
                        </Card>

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
                            <p className="text-xs text-gray-500 mt-1">
                                {comments.length}/2000 characters
                            </p>
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
                                disabled={!comments.trim() || selectedCourses.length === 0}
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
