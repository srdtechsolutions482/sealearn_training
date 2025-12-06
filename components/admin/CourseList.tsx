import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { MOCK_COURSE_MASTERS } from '../../constants';
import { CourseMaster } from '../../types';
import { Button, Modal, Input, Card } from '../common/UI';
import { 
    Filter, CheckCircle, XCircle, Clock, Calendar, 
    Building2, MapPin, BookOpen, MessageCircle,
    Plus, Upload, Edit, Download
} from 'lucide-react';
import { downloadSampleCourseExcel } from './utils/excelDownload.ts';
import {VendorAddCourse} from "../vendor/AddCourse"

interface CourseAction {
    courseId: string;
    action: 'approve' | 'reject' | 'suspend';
    comments: string;
}

type CourseMode = 'online' | 'inperson';

export const AdminCourseList = ({ onNavigate }: { onNavigate: (v: string) => void }) => {
    const [courses, setCourses] = useState<CourseMaster[]>(MOCK_COURSE_MASTERS);
    const [selectedCourse, setSelectedCourse] = useState<CourseMaster | null>(null);
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [comments, setComments] = useState('');
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'suspend'>('approve');

    const [courseFormErrors, setCourseFormErrors] = useState<Record<string, string>>({});

    // New Course modal
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [courseMode, setCourseMode] = useState<CourseMode>('online');
    const [courseForm, setCourseForm] = useState({
        courseTitle: '',
        courseTitleOther: '',
        category: '',
        targetAudience: '',
        entryRequirement: '',
        courseOverview: '',
        additionalNotes: '',
        validity: '',
        seatsPerBatch: '',
        city: '',
        startDate: '',
        endDate: '',
        duration: '',
        instructorName: '',
        courseFee: '',
        currency: 'INR',
        thumbnail: null as File | null,
    });

    // Bulk upload modal
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [bulkFile, setBulkFile] = useState<File | null>(null);

    // Filter State - REMOVED institute filter as requested
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'active' && course.status === 'active') return true;
            if (filterStatus === 'pending' && course.status === 'pending') return true;
            if (filterStatus === 'closed' && course.status === 'closed') return true;
            if (filterStatus === 'suspended' && course.status === 'suspended') return true;
            return false;
        });
    }, [courses, filterStatus]);

    // Pagination logic
    const paginatedCourses = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredCourses.slice(startIndex, endIndex);
    }, [filteredCourses, currentPage, rowsPerPage]);

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / rowsPerPage));

    const handleCourseAction = (course: CourseMaster) => {
        setSelectedCourse(course);
        setComments('');
        setSelectedAction('approve');
        setIsActionModalOpen(true);
    };

    const submitCourseAction = () => {
        if (!selectedCourse) return;

        setCourses(prev => prev.map(c => 
            c.id === selectedCourse.id 
                ? { ...c, status: selectedAction }
                : c
        ));
        
        setIsActionModalOpen(false);
        setSelectedCourse(null);
    };

    const handleCourseFormChange = (field: keyof typeof courseForm, value: string | File | null) => {
        setCourseForm(prev => ({ ...prev, [field]: value as any }));
    };

    const handleCourseModeChange = (mode: CourseMode) => {
        setCourseMode(mode);
    };

    const handleBulkFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (!file) {
            setBulkFile(null);
            return;
        }
        const allowed = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
        if (!allowed.includes(file.type) && !file.name.match(/\.(xls|xlsx|csv)$/i)) {
            alert('Please upload an Excel file (.xls, .xlsx, .csv) only.');
            e.target.value = '';
            setBulkFile(null);
            return;
        }
        setBulkFile(file);
    };

    const columns: Column<CourseMaster>[] = [
        { 
            key: 'title', 
            header: 'Course Name', 
            sortable: true, 
            render: (c) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="text-white" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{c.title}</p>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{c.code}</p>
                    </div>
                </div>
            )
        },
        { 
            key: 'instituteName', 
            header: 'Course Institute', 
            sortable: true,
            render: (c) => (
                <div className="flex items-center gap-2 text-sm">
                    <Building2 size={16} className="text-indigo-500" />
                    <span className="font-medium">{c.instituteName}</span>
                </div>
            )
        },
        { 
            key: 'category', 
            header: 'Course Category', 
            sortable: true,
            render: (c) => (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                    {c.category}
                </span>
            )
        },
        { 
            key: 'targetAudience', 
            header: 'Target Audience', 
            sortable: true,
            render: (c) => <span className="text-sm text-gray-700">{c.targetAudience}</span>
        },
        { 
            key: 'courseDates', 
            header: 'Course Date', 
            sortable: true,
            render: (c) => (
                <div className="text-sm text-gray-900">
                    <div>{c.startDate ? new Date(c.startDate).toLocaleDateString() : 'TBD'}</div>
                    <div className="text-xs text-gray-500">
                        {c.endDate ? `to ${new Date(c.endDate).toLocaleDateString()}` : ''}
                    </div>
                </div>
            )
        },
        { 
            key: 'enrolmentCount', 
            header: 'Enrolment Count', 
            sortable: true,
            render: (c) => (
                <div className="text-center"> {/* CENTERED - moved from text-right */}
                    <span className="text-2xl font-bold text-gray-900 block">{c.enrolmentCount || 0}</span>
                    <div className="text-xs text-gray-500">enrolled</div>
                </div>
            )
        },
        { 
            key: 'location', 
            header: 'Location', 
            sortable: true,
            render: (c) => (
                <div className="w-[320px]"> {/* INCREASED WIDTH for better visibility */}
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                        <span 
                            className="break-words leading-relaxed max-w-full line-clamp-3 hover:line-clamp-none" 
                            title={c.location}
                        >
                            {c.location || 'N/A'}
                        </span>
                    </div>
                </div>
            )
        },
        { 
            key: 'batchInfo', 
            header: 'Batch Info', 
            sortable: false,
            render: (c) => (
                <div className="text-sm space-y-1">
                    {c.isOnline ? (
                        <div className="text-center">
                            <span className="text-lg font-bold text-blue-600 block">{c.enrolmentCount || 0}</span>
                            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-0.5 rounded-full">Online</span>
                        </div>
                    ) : (
                        <div className="text-center">
                            <span className="text-sm font-semibold text-gray-900">
                                {c.availableSeats} ({c.bookedSeats} vs {c.totalSeats})
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full block mt-1">In-person</span>
                        </div>
                    )}
                </div>
            )
        },
        { 
            key: 'status', 
            header: 'Status', 
            sortable: true, 
            render: (c) => (
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    c.status === 'active' ? 'bg-green-100 text-green-800' :
                    c.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    c.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header + Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => onNavigate('vendor-add-course')}>
                        <Plus size={18} className="mr-2" /> Course Addition
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setIsBulkModalOpen(true)}>
                            <Upload size={18} className="mr-2" /> Bulk Upload
                        </Button>
                        <a
                            onClick={downloadSampleCourseExcel}
                            className="
                                inline-flex items-center gap-2 
                                text-sm font-medium 
                                text-blue-600 hover:text-blue-800 
                                underline hover:no-underline
                                transition-colors duration-200
                                cursor-pointer
                            "
                        >
                            <Download size={16} className="opacity-80 group-hover:opacity-100" />
                            Download Sample Excel
                        </a>
                    </div>
                </div>
            </div>

            {/* Course Table */}
            <DataTable<CourseMaster>
                title="Published Courses"
                data={paginatedCourses}
                columns={columns}
                searchKeys={['title', 'instituteName', 'code']}
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
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-sm text-gray-700">Filter Courses</h4>
                                    <button 
                                        onClick={() => setFilterStatus('all')} 
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Reset
                                    </button>
                                </div>
                                
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                                        <select 
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="closed">Closed</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                actions={(course) => (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleCourseAction(course)}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all shadow-sm border border-gray-100 hover:shadow-md"
                            title="Manage Course"
                        >
                            <Edit size={18} />
                        </button>
                    </div>
                )}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-lg">
                <div className="text-sm text-gray-700">
                    Showing {(filteredCourses.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1)}–
                    {Math.min(currentPage * rowsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
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

            {/* Course Action Modal (unchanged) */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                title="Course Action"
            >
                {/* Modal content remains exactly the same - unchanged */}
                {selectedCourse && (
                    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="text-white" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedCourse.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedCourse.code}</span>
                                        <span>•</span>
                                        {selectedCourse.instituteName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <MessageCircle size={16} /> Comments <span className="text-red-500">*</span>
                            </label>
                            <Input
                                as="textarea"
                                rows={4}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Enter comments or reasons (max 2000 characters)..."
                                className="resize-none"
                                maxLength={2000}
                            />
                            <p className="text-xs text-gray-500 mt-1">{comments.length}/2000</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Action <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'approve' as const, label: 'Approve', icon: CheckCircle, color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' },
                                    { value: 'reject' as const, label: 'Reject', icon: XCircle, color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' },
                                    { value: 'suspend' as const, label: 'Suspend', icon: Clock, color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' }
                                ].map(({ value, label, icon: Icon, color }) => (
                                    <Button
                                        key={value}
                                        variant="outline"
                                        className={`border-2 h-12 ${color} ${selectedAction === value ? 'ring-2 ring-blue-300 shadow-md' : ''}`}
                                        onClick={() => setSelectedAction(value)}
                                    >
                                        <Icon size={18} className="mr-2" />
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button 
                                variant={selectedAction === 'approve' ? 'secondary' : 'danger'}
                                className="flex-1"
                                onClick={submitCourseAction}
                                disabled={!comments.trim()}
                            >
                                {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => setIsActionModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Bulk Upload Modal - unchanged */}
            <Modal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                title="Bulk Course Upload"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Upload an Excel file containing multiple courses. Allowed formats: <strong>.xls, .xlsx, .csv</strong>.
                        Please use the sample format for correct column mapping.
                    </p>
                    <a
                        onClick={downloadSampleCourseExcel}
                        className="
                            inline-flex items-center gap-2 
                            text-sm font-medium 
                            text-blue-600 hover:text-blue-800 
                            underline hover:no-underline
                            transition-colors duration-200
                            cursor-pointer
                        "
                    >
                        <Download size={16} className="opacity-80 group-hover:opacity-100" />
                        Download Sample Excel
                    </a>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload File <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept=".xls,.xlsx,.csv"
                            onChange={handleBulkFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {bulkFile && (
                            <p className="mt-2 text-xs text-gray-600">
                                Selected file: <span className="font-medium">{bulkFile.name}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 pt-3 border-t border-gray-100">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={() => {
                                setIsBulkModalOpen(false);
                            }}
                            disabled={!bulkFile}
                        >
                            Upload
                        </Button>
                        <Button
                            variant="outline"
                            className="px-6"
                            onClick={() => setIsBulkModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
