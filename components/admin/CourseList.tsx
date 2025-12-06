
// import React, { useState, useMemo } from 'react';
// import { DataTable, Column } from '../common/DataTable';
// import { MOCK_COURSE_MASTERS } from '../../constants';
// import { CourseMaster } from '../../types';
// import { Button, Modal, Input } from '../common/UI';
// import { Edit, Eye, Filter, Plus, CheckCircle, XCircle } from 'lucide-react';

// // --- Sub-components ---

// const CourseMasterForm = ({ initialData, onSave, onCancel }: { initialData?: CourseMaster; onSave: (data: CourseMaster) => void; onCancel: () => void }) => {
//     const [formData, setFormData] = useState<Partial<CourseMaster>>(initialData || {
//         title: '',
//         category: 'Basic',
//         targetAudience: '',
//         entryRequirements: '',
//         courseOverview: '',
//         additionalNotes: '',
//         status: 'active',
//         // Code is auto-generated or hidden if not needed, but good to keep in state
//         code: ''
//     });

//     const handleChange = (key: keyof CourseMaster, value: string) => {
//         setFormData(prev => ({ ...prev, [key]: value }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSave({
//             id: initialData?.id || Math.random().toString(36).substr(2, 9),
//             // Ensure code exists if not provided
//             code: formData.code || `CRS-${Math.floor(Math.random() * 1000)}`,
//             ...formData
//         } as CourseMaster);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <Input 
//                 label="Course Title" 
//                 value={formData.title} 
//                 onChange={(e: any) => handleChange('title', e.target.value)} 
//                 placeholder="e.g. Advanced Fire Fighting" 
//             />
            
//             <div className="grid grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
//                     <select 
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                         value={formData.category}
//                         onChange={(e) => handleChange('category', e.target.value)}
//                     >
//                         <option value="Basic">Basic</option>
//                         <option value="Advanced">Advanced</option>
//                         <option value="Simulator">Simulator</option>
//                         <option value="Refresher">Refresher</option>
//                     </select>
//                 </div>
//                 <Input 
//                     label="Target Audience" 
//                     value={formData.targetAudience} 
//                     onChange={(e: any) => handleChange('targetAudience', e.target.value)} 
//                     placeholder="e.g. Officers, Ratings"
//                 />
//             </div>

//             <div>
//                  <label className="block text-sm font-semibold text-slate-700 mb-2">Entry Requirements</label>
//                  <textarea 
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                     rows={2}
//                     placeholder="e.g. Valid Medical Certificate, CDC..."
//                     value={formData.entryRequirements}
//                     onChange={(e) => handleChange('entryRequirements', e.target.value)}
//                  />
//             </div>

//             <div>
//                  <label className="block text-sm font-semibold text-slate-700 mb-2">Course Overview</label>
//                  <textarea 
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                     rows={3}
//                     placeholder="Brief description of the course curriculum..."
//                     value={formData.courseOverview}
//                     onChange={(e) => handleChange('courseOverview', e.target.value)}
//                  />
//             </div>

//             <div>
//                  <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
//                  <textarea 
//                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                     rows={2}
//                     placeholder="e.g. Bring safety shoes, passport size photos..."
//                     value={formData.additionalNotes}
//                     onChange={(e) => handleChange('additionalNotes', e.target.value)}
//                  />
//             </div>

//             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
//                 <Button variant="outline" onClick={onCancel}>Cancel</Button>
//                 <Button type="submit">{initialData ? 'Update Template' : 'Create Template'}</Button>
//             </div>
//         </form>
//     );
// };


// // --- Main Component ---

// export const AdminCourseList = () => {
//   // Only managing Master Courses now
//   const [masters, setMasters] = useState<CourseMaster[]>(MOCK_COURSE_MASTERS);
//   const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
//   const [selectedMaster, setSelectedMaster] = useState<CourseMaster | undefined>(undefined);

//   // Filter State
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');

//   // Filter Logic
//   const filteredMasters = useMemo(() => {
//       return masters.filter(master => {
//           const categoryMatch = filterCategory === 'all' || master.category === filterCategory;
//           const statusMatch = filterStatus === 'all' || master.status === filterStatus;
//           return categoryMatch && statusMatch;
//       });
//   }, [masters, filterCategory, filterStatus]);

//   // -- Handlers --

//   const handleSaveMaster = (data: CourseMaster) => {
//       if (selectedMaster) {
//           setMasters(prev => prev.map(m => m.id === data.id ? data : m));
//       } else {
//           setMasters(prev => [...prev, data]);
//       }
//       setIsMasterModalOpen(false);
//       setSelectedMaster(undefined);
//   };

//   const handleEditMaster = (master: CourseMaster) => {
//       setSelectedMaster(master);
//       setIsMasterModalOpen(true);
//   };

//   // -- Columns --

//   const masterColumns: Column<CourseMaster>[] = [
//       { key: 'title', header: 'Course Template', sortable: true, render: (m) => (
//           <div>
//               <p className="font-medium text-gray-900">{m.title}</p>
//               <p className="text-xs text-gray-500">{m.code || 'NO-CODE'}</p>
//           </div>
//       )},
//       { key: 'category', header: 'Category', sortable: true },
//       { key: 'targetAudience', header: 'Audience', sortable: true },
//       { key: 'status', header: 'Status', sortable: true, render: (m) => (
//           <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.status}</span>
//       )}
//   ];

//   return (
//     <div className="space-y-6">
//         <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
//         </div>

//         <DataTable<CourseMaster>
//             title="Course Templates"
//             data={filteredMasters}
//             columns={masterColumns}
//             searchKeys={['title', 'category']}
//             onAdd={() => { setSelectedMaster(undefined); setIsMasterModalOpen(true); }}
//             addLabel="Create New Template"
//             filterOptions={
//                 <div className="relative">
//                     <Button 
//                         variant={isFilterOpen ? 'primary' : 'outline'} 
//                         className="px-3"
//                         onClick={() => setIsFilterOpen(!isFilterOpen)}
//                     >
//                         <Filter size={18} />
//                     </Button>
//                     {isFilterOpen && (
//                         <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
//                             <div className="flex justify-between items-center mb-3">
//                                 <h4 className="font-bold text-sm text-gray-700">Filter Templates</h4>
//                                 <button 
//                                     onClick={() => { setFilterCategory('all'); setFilterStatus('all'); }} 
//                                     className="text-xs text-blue-600 hover:underline"
//                                 >
//                                     Reset
//                                 </button>
//                             </div>
                            
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
//                                     <select 
//                                         className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
//                                         value={filterCategory}
//                                         onChange={(e) => setFilterCategory(e.target.value)}
//                                     >
//                                         <option value="all">All Categories</option>
//                                         <option value="Basic">Basic</option>
//                                         <option value="Advanced">Advanced</option>
//                                         <option value="Simulator">Simulator</option>
//                                         <option value="Refresher">Refresher</option>
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
//                                     <select 
//                                         className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
//                                         value={filterStatus}
//                                         onChange={(e) => setFilterStatus(e.target.value)}
//                                     >
//                                         <option value="all">All Statuses</option>
//                                         <option value="active">Active</option>
//                                         <option value="archived">Archived</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             }
//             actions={(master) => (
//                 <div className="flex justify-end gap-2">
//                     <button 
//                         onClick={() => handleEditMaster(master)} 
//                         className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Edit Template"
//                     >
//                         <Edit size={18} />
//                     </button>
//                 </div>
//             )}
//         />

//         {/* Master Modal */}
//         <Modal 
//             isOpen={isMasterModalOpen} 
//             onClose={() => setIsMasterModalOpen(false)}
//             title={selectedMaster ? "Edit Course Template" : "New Course Template"}
//         >
//             <CourseMasterForm 
//                 initialData={selectedMaster} 
//                 onSave={handleSaveMaster}
//                 onCancel={() => setIsMasterModalOpen(false)}
//             />
//         </Modal>
//     </div>
//   );
// };


import React, { useState, useMemo, ChangeEvent } from 'react';
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
// import { useNavigate } from 'react-router-dom';



interface CourseAction {
    courseId: string;
    action: 'approve' | 'reject' | 'suspend';
    comments: string;
}

type CourseMode = 'online' | 'inperson';

export const AdminCourseList = ({ onNavigate }: { onNavigate: (v: string) => void }) => {

    // const navigate = useNavigate();

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

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterInstitute, setFilterInstitute] = useState<string>('all');

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const statusMatch = filterStatus === 'all' || course.status === filterStatus;
            const instituteMatch = filterInstitute === 'all' || course.instituteName === filterInstitute;
            return statusMatch && instituteMatch;
        });
    }, [courses, filterStatus, filterInstitute]);

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
                <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">{c.enrolmentCount || 0}</span>
                    <div className="text-xs text-gray-500">enrolled</div>
                </div>
            )
        },
        { 
    key: 'location', 
    header: 'Location', 
    sortable: true,
    render: (c) => (
        <div className="w-[280px]"> {/* Fixed width for consistent column */}
            <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span 
                    className="break-all leading-relaxed max-h-[60px] overflow-hidden hover:overflow-visible hover:max-h-none" 
                    title={c.location}
                >
                    {c.location || 'N/A'}
                </span>
            </div>
        </div>
    )
}
,
        { 
            key: 'batchInfo', 
            header: 'Batch Info', 
            sortable: false,
            render: (c) => (
                <div className="text-sm">
                    {c.isOnline ? (
                        <span className="text-gray-900 font-medium">{c.enrolmentCount || 0} enrolled</span>
                    ) : (
                        <span className="text-gray-900">
                            {c.availableSeats} ({c.bookedSeats} vs {c.totalSeats})
                        </span>
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
                data={filteredCourses}
                columns={columns}
                searchKeys={['title', 'instituteName', 'code']}
                // removed add button as requested
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
                                    <h4 className="font-bold text-sm text-gray-700">Filter Courses</h4>
                                    <button 
                                        onClick={() => { setFilterStatus('all'); setFilterInstitute('all'); }} 
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Reset
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
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
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Institute</label>
                                        <select 
                                            className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                            value={filterInstitute}
                                            onChange={(e) => setFilterInstitute(e.target.value)}
                                        >
                                            <option value="all">All Institutes</option>
                                            <option value="Ocean Academy">Ocean Academy</option>
                                            <option value="Maritime Institute">Maritime Institute</option>
                                            <option value="SeaTech Training">SeaTech Training</option>
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

            {/* Course Action Modal (unchanged) */}
            <Modal
                isOpen={isActionModalOpen}
                onClose={() => setIsActionModalOpen(false)}
                title="Course Action"
            >
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

            {/* New Course Registration Modal */}
         
            {/* Put AddCourse component HERE as children */}
                
    

            {/* Bulk Upload Modal */}
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
                                // API call for bulk upload here
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
