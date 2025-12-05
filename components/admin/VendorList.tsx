
// import React, { useState, useMemo } from 'react';
// import { DataTable, Column } from '../common/DataTable';
// import { Button, Card } from '../common/UI';
// import { MOCK_VENDORS } from '../../constants';
// import { Vendor } from '../../types';
// import { 
//     CheckCircle, 
//     XCircle, 
//     Eye, 
//     ArrowLeft, 
//     Filter, 
//     MapPin, 
//     Phone, 
//     Globe, 
//     Mail, 
//     Building2, 
//     Calendar,
//     Award,
//     FileText,
//     BookOpen,
//     Shield,
//     Download
// } from 'lucide-react';

// const VendorDetails = ({ vendor, onBack, onApprove, onReject }: { 
//     vendor: Vendor; 
//     onBack: () => void; 
//     onApprove: () => void;
//     onReject: () => void;
// }) => {
//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
//              {/* Header */}
//              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//                 <div className="flex items-center gap-4">
//                     <Button variant="outline" onClick={onBack} className="px-3">
//                         <ArrowLeft size={20} />
//                     </Button>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                             {vendor.companyName}
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
//                                 vendor.status === 'active' ? 'bg-green-100 text-green-700' :
//                                 vendor.status === 'pending' ? 'bg-amber-100 text-amber-700' :
//                                 'bg-red-100 text-red-700'
//                             }`}>
//                                 {vendor.status}
//                             </span>
//                         </h1>
//                         <p className="text-gray-500 text-sm mt-1">Vendor ID: <span className="font-mono">{vendor.id}</span></p>
//                     </div>
//                 </div>
                
//                 <div className="flex gap-3">
//                     {vendor.status === 'pending' && (
//                         <>
//                             <Button className="bg-green-600 hover:bg-green-700" onClick={onApprove}>
//                                 <CheckCircle size={18} /> Approve
//                             </Button>
//                             <Button className="bg-red-600 hover:bg-red-700" onClick={onReject}>
//                                 <XCircle size={18} /> Reject
//                             </Button>
//                         </>
//                     )}
//                     {vendor.status === 'active' && (
//                         <Button className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" onClick={onReject}>
//                             Suspend Account
//                         </Button>
//                     )}
//                      {vendor.status === 'rejected' && (
//                         <Button className="bg-green-50 text-green-600 hover:bg-green-100 border border-green-200" onClick={onApprove}>
//                             Reactivate Account
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
//                 {/* Left Column: Contact & Basic Info */}
//                 <div className="space-y-8">
//                     {/* Basic Info */}
//                     <Card>
//                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
//                             <Building2 className="text-blue-500" size={20}/> Institute Overview
//                         </h3>
//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                                 <span className="text-sm text-gray-500">Established</span>
//                                 <span className="font-medium text-gray-900">{vendor.foundedYear || 'N/A'}</span>
//                             </div>
//                             <div className="flex justify-between items-center py-2 border-b border-gray-50">
//                                 <span className="text-sm text-gray-500">Total Courses</span>
//                                 <span className="font-medium text-gray-900 bg-blue-50 px-2 py-0.5 rounded text-blue-700">{vendor.totalCourses}</span>
//                             </div>
//                             <div className="flex justify-between items-center py-2">
//                                 <span className="text-sm text-gray-500">Accreditation</span>
//                                 <span className="font-medium text-gray-900">{vendor.accreditation || 'Pending'}</span>
//                             </div>
//                         </div>
//                         <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 italic">
//                             {vendor.description || "No description provided."}
//                         </div>
//                     </Card>

//                     {/* Admin Contact */}
//                     <Card>
//                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
//                             <Shield className="text-indigo-500" size={20}/> Admin Contact
//                         </h3>
//                         <div className="space-y-3">
//                             <div>
//                                 <p className="text-xs text-gray-400 uppercase font-bold">Contact Person</p>
//                                 <p className="font-medium text-gray-900">{vendor.contactPerson || 'N/A'}</p>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Phone size={16}/></div>
//                                 <div>
//                                     <p className="text-xs text-gray-400">Phone</p>
//                                     <p className="font-medium text-sm">{vendor.phone || 'N/A'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Mail size={16}/></div>
//                                 <div>
//                                     <p className="text-xs text-gray-400">Email</p>
//                                     <p className="font-medium text-sm truncate w-48" title={vendor.email}>{vendor.email || 'N/A'}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Customer Care */}
//                     <Card>
//                          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
//                             <Phone className="text-teal-500" size={20}/> Customer Care
//                         </h3>
//                         <div className="space-y-3">
//                              <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Phone size={16}/></div>
//                                 <div>
//                                     <p className="text-xs text-gray-400">Support Phone</p>
//                                     <p className="font-medium text-sm">{vendor.customerCarePhone || 'N/A'}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Mail size={16}/></div>
//                                 <div>
//                                     <p className="text-xs text-gray-400">Support Email</p>
//                                     <p className="font-medium text-sm truncate w-48">{vendor.customerCareEmail || 'N/A'}</p>
//                                 </div>
//                             </div>
//                              <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Globe size={16}/></div>
//                                 <div>
//                                     <p className="text-xs text-gray-400">Website</p>
//                                     <a href={`https://${vendor.website}`} target="_blank" rel="noreferrer" className="font-medium text-sm text-blue-600 hover:underline">
//                                         {vendor.website || 'N/A'}
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>

//                 {/* Right Column: Detailed Info */}
//                 <div className="xl:col-span-2 space-y-8">
                    
//                     {/* Compliance & Location */}
//                     <Card>
//                         <h3 className="font-bold text-lg mb-6 border-b border-gray-100 pb-3 flex items-center gap-2">
//                              <Award className="text-amber-500" size={20}/> Compliance & Location
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                              {/* License */}
//                              <div className="space-y-4">
//                                 <h4 className="font-bold text-sm text-gray-700 uppercase">License Information</h4>
//                                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
//                                     <div className="mb-3">
//                                         <p className="text-xs text-gray-500">License Number</p>
//                                         <p className="font-mono font-medium text-gray-900">{vendor.licenseNumber || 'N/A'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500">Issuing Authority</p>
//                                         <p className="font-medium text-gray-900">{vendor.issuingAuthority || 'N/A'}</p>
//                                     </div>
//                                 </div>
//                              </div>

//                              {/* Location */}
//                              <div className="space-y-4">
//                                 <h4 className="font-bold text-sm text-gray-700 uppercase">Registered Address</h4>
//                                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-start gap-3">
//                                     <MapPin className="shrink-0 text-red-500 mt-1" size={18} />
//                                     <p className="text-sm text-gray-700 leading-relaxed">
//                                         {vendor.address || 'Address not provided'}
//                                     </p>
//                                 </div>
//                              </div>
//                         </div>
//                     </Card>

//                     {/* Courses Offered */}
//                     <Card>
//                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
//                             <BookOpen className="text-purple-500" size={20}/> Courses Offered
//                         </h3>
//                         {vendor.coursesOffered && vendor.coursesOffered.length > 0 ? (
//                             <div className="flex flex-wrap gap-2">
//                                 {vendor.coursesOffered.map((course, idx) => (
//                                     <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100">
//                                         {course}
//                                     </span>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 text-sm italic">No courses listed yet.</p>
//                         )}
//                     </Card>

//                     {/* Documents */}
//                     <Card>
//                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
//                             <FileText className="text-rose-500" size={20}/> Submitted Documents
//                         </h3>
//                         {vendor.documents && vendor.documents.length > 0 ? (
//                             <div className="space-y-3">
//                                 {vendor.documents.map((doc, idx) => (
//                                     <div key={idx} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
//                                         <div className="flex items-center gap-3">
//                                              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
//                                                 <FileText size={20} />
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium text-gray-900 text-sm">{doc.name}</p>
//                                                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                                                     <span>{doc.type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
//                                                     <span>•</span>
//                                                     <span>Uploaded: {doc.date}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Download">
//                                             <Download size={18} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p className="text-gray-500 text-sm italic">No documents uploaded.</p>
//                         )}
//                     </Card>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export const AdminVendorList = () => {
//   const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
//   const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
//   const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  
//   // Filter State
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filterStatus, setFilterStatus] = useState<string>('all');

//   const filteredVendors = useMemo(() => {
//       if (filterStatus === 'all') return vendors;
//       return vendors.filter(v => v.status === filterStatus);
//   }, [vendors, filterStatus]);

//   const handleView = (vendor: Vendor) => {
//       setSelectedVendor(vendor);
//       setViewMode('detail');
//       window.scrollTo(0,0);
//   };

//   const handleApprove = (id: string) => {
//       setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'active' } : v));
//       if (selectedVendor?.id === id) {
//           setSelectedVendor(prev => prev ? { ...prev, status: 'active' } : null);
//       }
//       if (viewMode === 'list') alert(`Vendor ${id} approved successfully.`);
//   };

//   const handleReject = (id: string) => {
//       setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
//       if (selectedVendor?.id === id) {
//           setSelectedVendor(prev => prev ? { ...prev, status: 'rejected' } : null);
//       }
//       if (viewMode === 'list') alert(`Vendor ${id} rejected.`);
//   };

//   const columns: Column<Vendor>[] = [
//       { key: 'companyName', header: 'Institution Name', sortable: true, render: (v) => <span className="font-medium text-gray-900">{v.companyName}</span> },
//       { key: 'status', header: 'Status', sortable: true, render: (v) => (
//           <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
//             v.status === 'active' ? 'bg-green-100 text-green-700' : 
//             v.status === 'pending' ? 'bg-amber-100 text-amber-700' :
//             'bg-red-100 text-red-700'
//           }`}>
//             {v.status}
//           </span>
//       )},
//       { key: 'totalCourses', header: 'Total Courses', sortable: true },
//       { key: 'email', header: 'Email', sortable: true, render: (v) => <span className="text-gray-500 text-sm">{v.email || '--'}</span> }
//   ];

//   if (viewMode === 'detail' && selectedVendor) {
//       return (
//           <VendorDetails 
//               vendor={selectedVendor} 
//               onBack={() => setViewMode('list')} 
//               onApprove={() => handleApprove(selectedVendor.id)}
//               onReject={() => handleReject(selectedVendor.id)}
//           />
//       );
//   }

//   return (
//     <DataTable<Vendor>
//         title="Vendor Management"
//         data={filteredVendors}
//         columns={columns}
//         searchKeys={['companyName', 'email']}
//         addLabel="Add New Vendor"
//         filterOptions={
//             <div className="relative">
//                 <Button 
//                     variant={isFilterOpen ? 'primary' : 'outline'} 
//                     className="px-3"
//                     onClick={() => setIsFilterOpen(!isFilterOpen)}
//                 >
//                     <Filter size={18} />
//                 </Button>
//                 {isFilterOpen && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
//                         <div className="p-2 text-xs font-bold text-gray-500 uppercase">Filter Status</div>
//                         {['all', 'active', 'pending', 'rejected'].map(status => (
//                             <button
//                                 key={status}
//                                 className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filterStatus === status ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
//                                 onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
//                             >
//                                 {status.charAt(0).toUpperCase() + status.slice(1)}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         }
//         actions={(vendor) => (
//              <div className="flex justify-end gap-2">
//                  <button 
//                     onClick={() => handleView(vendor)}
//                     className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                     title="View Details"
//                  >
//                     <Eye size={18} />
//                  </button>
//                 {vendor.status === 'pending' && (
//                   <>
//                     <button 
//                         onClick={() => handleApprove(vendor.id)}
//                         className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
//                         title="Approve"
//                     >
//                       <CheckCircle size={18} />
//                     </button>
//                     <button 
//                         onClick={() => handleReject(vendor.id)}
//                         className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
//                         title="Reject"
//                     >
//                       <XCircle size={18} />
//                     </button>
//                   </>
//                 )}
//              </div>
//         )}
//     />
//   );
// };


import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { Button, Card, Modal } from '../common/UI';
import { MOCK_VENDORS } from '../../constants';
import { Vendor } from '../../types';
import { 
    Filter, 
    Eye, 
    CheckCircle, 
    Phone, 
    Mail, 
    MapPin, 
    User, 
    Building2,
    Edit
} from 'lucide-react';

export const AdminVendorList = () => {
    const [institutes, setInstitutes] = useState<Vendor[]>(MOCK_VENDORS);
    const [selectedInstitute, setSelectedInstitute] = useState<Vendor | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredInstitutes = useMemo(() => {
        return institutes.filter(institute => {
            const statusMatch = filterStatus === 'all' || institute.status === filterStatus;
            return statusMatch;
        });
    }, [institutes, filterStatus]);

    const handleView = (institute: Vendor) => {
        setSelectedInstitute(institute);
        setIsDetailsOpen(true);
    };

    const columns: Column<Vendor>[] = [
        { 
            key: 'companyName', 
            header: 'Institute Name', 
            sortable: true, 
            render: (v) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="text-white" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{v.companyName}</p>
                        {/* <p className="text-xs text-gray-500">{v.id}</p> */}
                    </div>
                </div>
            )
        },
        { 
            key: 'totalCourses', 
            header: 'Total Courses', 
            sortable: true,
            render: (v) => (
                <span className="font-mono text-lg font-bold text-gray-900 bg-blue-50 px-3 py-1 rounded-full">
                    {v.totalCourses || 0}
                </span>
            )
        },
        { 
            key: 'contactPerson', 
            header: 'Institute Admin Contact Person', 
            sortable: true,
            render: (v) => (
                <div className="space-y-1 text-sm">
                    <div className="font-medium text-gray-900">{v.contactPerson || 'N/A'}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail size={12} /> {v.email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={12} /> {v.phone || 'N/A'}
                    </div>
                </div>
            )
        },
        { 
            key: 'customerCare', 
            header: 'Customer Care', 
            sortable: false,
            render: (v) => (
                <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail size={12} /> {v.customerCareEmail || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={12} /> {v.customerCarePhone || 'N/A'}
                    </div>
                </div>
            )
        },
        { 
            key: 'address', 
            header: 'Location', 
            sortable: true,
            render: (v) => (
                <div className="max-w-[250px] space-y-1">
            <div className="flex items-start gap-2 text-sm text-gray-700 leading-tight">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5 flex-shrink-0" />
                <span className="break-words leading-relaxed" title={v.address}>
                    {v.address || 'N/A'}
                </span>
            </div>
        </div>
            )
        },
        { 
            key: 'verifiedBy', 
            header: 'Docs Verified by', 
            sortable: false,
            render: (v) => (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User size={16} className="text-indigo-500" />
                    <span>{v.verifiedBy || 'SuperAdmin'}</span>
                </div>
            )
        }
    ];

    return (
        <>
            <DataTable<Vendor>
                title="Institute Management"
                data={filteredInstitutes}
                columns={columns}
                searchKeys={['companyName', 'contactPerson', 'email']}
                // addLabel="Add Institute (Disabled)"
                // onAdd={() => alert("Institute registration handled via vendor signup flow.")}
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
                                    <h4 className="font-bold text-sm text-gray-700">Filter Institutes</h4>
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
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                }
                actions={(institute) => (
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleView(institute)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                )}
            />

            {/* Institute Details Modal */}
            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Institute Details"
            >
                {selectedInstitute && (
                    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <Building2 className="text-white" size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedInstitute.companyName}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100`}>
                                        Institute
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        selectedInstitute.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        selectedInstitute.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedInstitute.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Admin Contact</label>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                                        <User size={16} className="text-indigo-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedInstitute.contactPerson}</p>
                                            <p className="text-xs text-gray-600">{selectedInstitute.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                                        <Phone size={16} className="text-indigo-500" />
                                        <span className="font-medium">{selectedInstitute.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Customer Care</label>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                                        <Mail size={16} className="text-teal-500" />
                                        <span className="font-medium">{selectedInstitute.customerCareEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                                        <Phone size={16} className="text-teal-500" />
                                        <span className="font-medium">{selectedInstitute.customerCarePhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Location</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-red-500 mt-0.5 shrink-0" />
                                        <p className="text-sm text-gray-700 leading-relaxed">{selectedInstitute.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Verification</label>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <span className="text-sm font-medium text-gray-900">Total Courses</span>
                                        <span className="text-lg font-bold text-emerald-700">{selectedInstitute.totalCourses}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <User size={16} className="text-indigo-500" />
                                        <span className="text-sm font-medium">Verified by: {selectedInstitute.verifiedBy || 'SuperAdmin'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
