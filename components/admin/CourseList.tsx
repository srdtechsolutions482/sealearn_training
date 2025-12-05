
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


interface CourseAction {
    courseId: string;
    action: 'approve' | 'reject' | 'suspend';
    comments: string;
}

type CourseMode = 'online' | 'inperson';

export const AdminCourseList = () => {
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
                <div className="flex items-center gap-2 text-sm max-w-[120px] truncate">
                    <MapPin size={16} className="text-gray-400" />
                    <span title={c.location}>{c.location}</span>
                </div>
            )
        },
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
                    <Button variant="outline" onClick={() => setIsAddCourseOpen(true)}>
                        <Plus size={18} className="mr-2" /> Course Addition
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setIsBulkModalOpen(true)}>
                            <Upload size={18} className="mr-2" /> Bulk Upload
                        </Button>
                        <button
                            type="button"
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800 underline"
                            onClick={downloadSampleCourseExcel}
                        >
                            <Download size={14} className="mr-1" />
                            Download Sample Excel
                        </button>
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
            <Modal
                isOpen={isAddCourseOpen}
                onClose={() => setIsAddCourseOpen(false)}
                title="New Course Registration"
            >
                <div className="space-y-5 max-h-[80vh]">
                    <Card className="p-4 bg-slate-50 border border-slate-100">
                        <p className="text-xs text-slate-500">
                            Please fill the following details to register a new course. Fields marked with <span className="text-red-500">*</span> are mandatory.
                        </p>
                    </Card>

                    {/* 1. Course Title */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
            Course Title <span className="text-red-500">*</span>
        </label>
        <select
            className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:border-blue-500 ${
                courseFormErrors.courseTitle ? 'border-red-500' : 'border-gray-200'
            }`}
            value={courseForm.courseTitle}
            onChange={(e) => {
                handleCourseFormChange('courseTitle', e.target.value);
                setCourseFormErrors(prev => ({ ...prev, courseTitle: '' }));
            }}
        >
            <option value="">Select Course</option>
            <option value="Basic Safety Training">Basic Safety Training</option>
            <option value="Advanced Fire Fighting">Advanced Fire Fighting</option>
            <option value="Medical First Aid">Medical First Aid</option>
            <option value="Others">Others</option>
        </select>
        {courseFormErrors.courseTitle && (
            <p className="text-xs text-red-500 mt-1">⚠️ {courseFormErrors.courseTitle}</p>
        )}
    </div>
    {courseForm.courseTitle === 'Others' && (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                Specify Course Title (if Others) <span className="text-red-500">*</span>
            </label>
            <Input
                value={courseForm.courseTitleOther}
                onChange={(e) => {
                    handleCourseFormChange('courseTitleOther', e.target.value);
                    setCourseFormErrors(prev => ({ ...prev, courseTitleOther: '' }));
                }}
                placeholder="Enter custom course title"
                className={courseFormErrors.courseTitleOther ? 'border-red-500' : ''}
            />
            {courseFormErrors.courseTitleOther && (
                <p className="text-xs text-red-500 mt-1">⚠️ {courseFormErrors.courseTitleOther}</p>
            )}
        </div>
    )}
</div>


                    {/* 3,4,5,8 Category / Target Audience / Entry Req / Validity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={courseForm.category}
                                onChange={(e) => handleCourseFormChange('category', e.target.value)}
                                placeholder="Auto-populated / NAMAC Course List"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Target Audience <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={courseForm.targetAudience}
                                onChange={(e) => handleCourseFormChange('targetAudience', e.target.value)}
                                placeholder="e.g. Officers, Ratings"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Entry Requirement <span className="text-red-500">*</span>
                            </label>
                            <Input
                                as="textarea"
                                rows={2}
                                value={courseForm.entryRequirement}
                                onChange={(e) => handleCourseFormChange('entryRequirement', e.target.value)}
                                placeholder="List requirements (students can check-off)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Validity <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={courseForm.validity}
                                onChange={(e) => handleCourseFormChange('validity', e.target.value)}
                                placeholder="e.g. 5 Years"
                            />
                        </div>
                    </div>

                    {/* 6,7 Course Overview / Additional Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Course Overview <span className="text-red-500">*</span>
                        </label>
                        <Input
                            as="textarea"
                            rows={3}
                            value={courseForm.courseOverview}
                            onChange={(e) => handleCourseFormChange('courseOverview', e.target.value)}
                            placeholder="Brief description of the course curriculum"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Additional Notes <span className="text-red-500">*</span>
                        </label>
                        <Input
                            as="textarea"
                            rows={2}
                            value={courseForm.additionalNotes}
                            onChange={(e) => handleCourseFormChange('additionalNotes', e.target.value)}
                            placeholder="Additional instructions (e.g. documents, dress code)"
                        />
                    </div>

                    {/* 9 Course Mode */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Course Mode <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <Button
                                variant={courseMode === 'online' ? 'secondary' : 'outline'}
                                className="flex-1"
                                onClick={() => handleCourseModeChange('online')}
                            >
                                Online
                            </Button>
                            <Button
                                variant={courseMode === 'inperson' ? 'secondary' : 'outline'}
                                className="flex-1"
                                onClick={() => handleCourseModeChange('inperson')}
                            >
                                In-person
                            </Button>
                        </div>
                    </div>

                    {/* 10 Seats per Batch + 11 City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                No of Seats per Batch <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={courseForm.seatsPerBatch}
                                onChange={(e) => handleCourseFormChange('seatsPerBatch', e.target.value)}
                                placeholder={courseMode === 'online' ? 'Total users (e.g. 250)' : 'e.g. 25'}
                            />
                            <p className="text-[11px] text-gray-500 mt-1">
                                For online: total users enrolled. For in-person: used for available vs total display.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                City {courseMode === 'inperson' && <span className="text-red-500">*</span>}
                            </label>
                            <Input
                                value={courseForm.city}
                                onChange={(e) => handleCourseFormChange('city', e.target.value)}
                                placeholder="City name (custom allowed)"
                            />
                        </div>
                    </div>

                    {/* 12,13,14 Dates & Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                value={courseForm.startDate}
                                onChange={(e) => handleCourseFormChange('startDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                End Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="date"
                                value={courseForm.endDate}
                                onChange={(e) => handleCourseFormChange('endDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Duration <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={courseForm.duration}
                                onChange={(e) => handleCourseFormChange('duration', e.target.value)}
                                placeholder="Auto / editable, e.g. 5 days"
                            />
                        </div>
                    </div>

                    {/* 15 Instructor, 16 Fee, 17 Thumbnail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Instructor Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={courseForm.instructorName}
                                onChange={(e) => handleCourseFormChange('instructorName', e.target.value)}
                                placeholder="Instructor full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Course Fee <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={courseForm.courseFee}
                                    onChange={(e) => handleCourseFormChange('courseFee', e.target.value)}
                                    placeholder="Amount"
                                />
                                <select
                                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                    value={courseForm.currency}
                                    onChange={(e) => handleCourseFormChange('currency', e.target.value)}
                                >
                                    <option value="USD">USD</option>
                                    <option value="INR">INR</option>
                                    <option value="EUR">EUR</option>
                                    <option value="AED">AED</option>
                                </select>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">
                                Note: Platform commission percentage will be shown based on admin settings.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Thumbnail <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (file && file.size > 20 * 1024 * 1024) {
                                    alert('Max thumbnail size is 20 MB.');
                                    e.target.value = '';
                                    handleCourseFormChange('thumbnail', null);
                                } else {
                                    handleCourseFormChange('thumbnail', file);
                                }
                            }}
                            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                            Allowed formats: JPEG, JPG, PNG, GIF. Max 20 MB.
                        </p>
                    </div>

                    {/* Submit Actions */}
<div className="flex gap-3 pt-3 border-t border-gray-100">
    <Button
        variant="secondary"
        className="flex-1"
        onClick={() => {
            // Validation
            const errors: Record<string, string> = {};

            if (!courseForm.courseTitle.trim()) {
                errors.courseTitle = 'Course Title is required';
            }
            if (courseForm.courseTitle === 'Others' && !courseForm.courseTitleOther.trim()) {
                errors.courseTitleOther = 'Please specify the custom course title';
            }
            if (!courseForm.category.trim()) {
                errors.category = 'Category is required';
            }
            if (!courseForm.targetAudience.trim()) {
                errors.targetAudience = 'Target Audience is required';
            }
            if (!courseForm.entryRequirement.trim()) {
                errors.entryRequirement = 'Entry Requirement is required';
            }
            if (!courseForm.courseOverview.trim()) {
                errors.courseOverview = 'Course Overview is required';
            }
            if (!courseForm.additionalNotes.trim()) {
                errors.additionalNotes = 'Additional Notes is required';
            }
            if (!courseForm.validity.trim()) {
                errors.validity = 'Validity is required';
            }
            if (!courseForm.seatsPerBatch.trim()) {
                errors.seatsPerBatch = 'Seats per Batch is required';
            }
            if (courseMode === 'inperson' && !courseForm.city.trim()) {
                errors.city = 'City is required for In-person courses';
            }
            if (!courseForm.startDate) {
                errors.startDate = 'Start Date is required';
            }
            if (!courseForm.endDate) {
                errors.endDate = 'End Date is required';
            }
            if (courseForm.startDate && courseForm.endDate && new Date(courseForm.startDate) > new Date(courseForm.endDate)) {
                errors.dates = 'End Date must be after Start Date';
            }
            if (!courseForm.duration.trim()) {
                errors.duration = 'Duration is required';
            }
            if (!courseForm.instructorName.trim()) {
                errors.instructorName = 'Instructor Name is required';
            }
            if (!courseForm.courseFee.trim()) {
                errors.courseFee = 'Course Fee is required';
            }
            if (courseForm.courseFee && isNaN(parseFloat(courseForm.courseFee))) {
                errors.courseFee = 'Course Fee must be a valid number';
            }
            if (!courseForm.thumbnail) {
                errors.thumbnail = 'Thumbnail is required';
            }

            setCourseFormErrors(errors);

            // If no errors, save
            if (Object.keys(errors).length === 0) {
                alert('✅ Course saved successfully!');
                setIsAddCourseOpen(false);
                // Reset form
                setCourseForm({
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
                    thumbnail: null,
                });
            }
        }}
    >
        Save Course
    </Button>
    <Button
        variant="outline"
        className="px-6"
        onClick={() => {
            setIsAddCourseOpen(false);
            setCourseFormErrors({});
        }}
    >
        Cancel
    </Button>
</div>

                </div>
            </Modal>

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
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        <Download size={16} className="mr-2" />
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
