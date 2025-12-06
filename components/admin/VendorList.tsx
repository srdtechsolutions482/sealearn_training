
// import React, { useState, useMemo, useEffect } from 'react';
// import { DataTable, Column } from '../common/DataTable';
// import { Button, Card, Modal } from '../common/UI';
// import { API_CONFIG } from '../../apiconfig'; // Adjust path as needed
// import { 
//     Filter, 
//     CheckCircle, 
//     Phone, 
//     Mail, 
//     MapPin, 
//     User, 
//     Building2
// } from 'lucide-react';

// interface Institute{
//     institute_id: number;
//     institute_name: string;
//     accreditation_no: string;
//     house_no: string;
//     street_name: string;
//     landmark: string;
//     country: string;
//     state: string;
//     postcode: string;
//     admin_contact_person_name: string;
//     admin_contact_person_phone: string;
//     admin_contact_person_email: string;
//     customer_care_phone: string;
//     customer_care_email: string;
//     license_number: string;
//     issuing_authority: string;
//     created_by: string;
//     created_at: string;
//     updated_by: string | null;
//     updated_at: string | null;
//     is_approved: number;
// }

// export const AdminVendorList = () => {
//     const [institutes, setInstitutes] = useState<Institute[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
//     const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
//     // Filter State
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [filterStatus, setFilterStatus] = useState<string>('all');

//     // Fetch institutes data
//     useEffect(() => {
//         const fetchInstitutes = async () => {
//             try {
//                 setLoading(true);
//                 const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_INSTITUTE_DETAILS}`, {
//                     method: 'GET',
//                     headers: API_CONFIG.HEADERS,
//                 });
                
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
                
//                 const data: Institute[] = await response.json();
//                 setInstitutes(data);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'Failed to fetch institutes');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstitutes();
//     }, []);

//     const filteredInstitutes = useMemo(() => {
//         return institutes.filter(institute => {
//             const statusMatch = filterStatus === 'all' || 
//                 (filterStatus === 'approved' && institute.is_approved === 1) ||
//                 (filterStatus === 'pending' && institute.is_approved === 0);
//             return statusMatch;
//         });
//     }, [institutes, filterStatus]);

//     const handleView = (institute: Institute) => {
//         setSelectedInstitute(institute);
//         setIsDetailsOpen(true);
//     };

//     const columns: Column<Institute>[] = [
//         { 
//             key: 'institute_name', 
//             header: 'Institute Name', 
//             sortable: true, 
//             render: (institute) => (
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
//                         <Building2 className="text-white" size={20} />
//                     </div>
//                     <div>
//                         <p className="font-semibold text-gray-900">{institute.institute_name || 'N/A'}</p>
//                     </div>
//                 </div>
//             )
//         },
//         { 
//             key: 'accreditation_no', 
//             header: 'Accreditation No', 
//             sortable: true,
//             render: (institute) => (
//                 <span className="font-mono text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
//                     {institute.accreditation_no || 'N/A'}
//                 </span>
//             )
//         },
//         { 
//             key: 'admin_contact_person_name', 
//             header: 'Institute Admin Contact Person', 
//             sortable: true,
//             render: (institute) => (
//                 <div className="space-y-1 text-sm">
//                     <div className="font-medium text-gray-900">{institute.admin_contact_person_name || 'N/A'}</div>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Mail size={12} /> {institute.admin_contact_person_email || 'N/A'}
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Phone size={12} /> {institute.admin_contact_person_phone || 'N/A'}
//                     </div>
//                 </div>
//             )
//         },
//         { 
//             key: 'customer_care_email', 
//             header: 'Customer Care', 
//             sortable: false,
//             render: (institute) => (
//                 <div className="space-y-1 text-sm">
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Mail size={12} /> {institute.customer_care_email || 'N/A'}
//                     </div>
//                     <div className="flex items-center gap-1 text-xs text-gray-600">
//                         <Phone size={12} /> {institute.customer_care_phone || 'N/A'}
//                     </div>
//                 </div>
//             )
//         },
//         { 
//             key: 'country', 
//             header: 'Location', 
//             sortable: true,
//             render: (institute) => (
//                 <div className="max-w-[250px] space-y-1">
//                     <div className="flex items-start gap-2 text-sm text-gray-700 leading-tight">
//                         <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5 flex-shrink-0" />
//                         <span className="break-words leading-relaxed" title={`${institute.house_no || ''} ${institute.street_name || ''}${institute.landmark ? ', ' + institute.landmark : ''}, ${institute.state || ''}, ${institute.country || ''} ${institute.postcode || ''}`}>
//                             {`${institute.house_no || ''} ${institute.street_name || ''}${institute.landmark ? ', ' + institute.landmark : ''}, ${institute.state || ''}, ${institute.country || ''} ${institute.postcode || ''}`.trim() || 'N/A'}
//                         </span>
//                     </div>
//                 </div>
//             )
//         },
//         { 
//             key: 'issuing_authority', 
//             header: 'Docs Verified by ', 
//             sortable: false,
//             render: (institute) => (
//                 <div className="flex items-center gap-2 text-sm text-gray-700">
//                     <User size={16} className="text-indigo-500" />
//                     <span>{institute.issuing_authority || 'N/A'}</span>
//                 </div>
//             )
//         }
//     ];

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="text-lg text-gray-500">Loading institutes...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="text-red-500 text-center">
//                     <div className="text-lg font-medium mb-2">Failed to load institutes</div>
//                     <div className="text-sm mb-4">{error}</div>
//                     <Button 
//                         onClick={() => window.location.reload()}
//                         variant="outline"
//                     >
//                         Retry
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <DataTable<Institute>
//                 title="Institute Management"
//                 data={filteredInstitutes}
//                 columns={columns}
//                 searchKeys={['institute_name', 'admin_contact_person_name', 'admin_contact_person_email']}
//                 filterOptions={
//                     <div className="relative">
//                         <Button 
//                             variant={isFilterOpen ? 'primary' : 'outline'} 
//                             className="px-3"
//                             onClick={() => setIsFilterOpen(!isFilterOpen)}
//                         >
//                             <Filter size={18} />
//                         </Button>
//                         {isFilterOpen && (
//                             <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
//                                 <div className="flex justify-between items-center mb-3">
//                                     <h4 className="font-bold text-sm text-gray-700">Filter Institutes</h4>
//                                     <button 
//                                         onClick={() => setFilterStatus('all')} 
//                                         className="text-xs text-blue-600 hover:underline"
//                                     >
//                                         Reset
//                                     </button>
//                                 </div>
                                
//                                 <div className="space-y-2">
//                                     <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
//                                     <select 
//                                         className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
//                                         value={filterStatus}
//                                         onChange={(e) => setFilterStatus(e.target.value)}
//                                     >
//                                         <option value="all">All Statuses</option>
//                                         <option value="approved">Approved</option>
//                                         <option value="pending">Pending</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 }
//                 // actions={(institute) => (
//                 //     <div className="flex justify-end gap-2">
//                 //         <button 
//                 //             onClick={() => handleView(institute)}
//                 //             className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 //             title="View Details"
//                 //         >
//                 //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                 //                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                 //                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 //             </svg>
//                 //         </button>
//                 //     </div>
//                 // )}
//             />

//             {/* Institute Details Modal */}
//             <Modal
//                 isOpen={isDetailsOpen}
//                 onClose={() => setIsDetailsOpen(false)}
//                 title="Institute Details"
//             >
//                 {selectedInstitute && (
//                     <div className="space-y-6 max-h-[80vh] overflow-y-auto">
//                         <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
//                             <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
//                                 <Building2 className="text-white" size={28} />
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-bold text-gray-900">{selectedInstitute.institute_name}</h3>
//                                 <div className="flex gap-2 mt-1">
//                                     <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100`}>
//                                         Institute
//                                     </span>
//                                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
//                                         selectedInstitute.is_approved === 1 ? 'bg-green-100 text-green-700' :
//                                         'bg-amber-100 text-amber-700'
//                                     }`}>
//                                         {selectedInstitute.is_approved === 1 ? 'Approved' : 'Pending'}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Admin Contact</label>
//                                 <div className="space-y-3 text-sm">
//                                     <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
//                                         <User size={16} className="text-indigo-500" />
//                                         <div>
//                                             <p className="font-medium text-gray-900">{selectedInstitute.admin_contact_person_name || 'N/A'}</p>
//                                             <p className="text-xs text-gray-600">{selectedInstitute.admin_contact_person_email || 'N/A'}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
//                                         <Phone size={16} className="text-indigo-500" />
//                                         <span className="font-medium">{selectedInstitute.admin_contact_person_phone || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Customer Care</label>
//                                 <div className="space-y-3 text-sm">
//                                     <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
//                                         <Mail size={16} className="text-teal-500" />
//                                         <span className="font-medium">{selectedInstitute.customer_care_email || 'N/A'}</span>
//                                     </div>
//                                     <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
//                                         <Phone size={16} className="text-teal-500" />
//                                         <span className="font-medium">{selectedInstitute.customer_care_phone || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Location</label>
//                                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
//                                     <div className="flex items-start gap-3">
//                                         <MapPin size={18} className="text-red-500 mt-0.5 shrink-0" />
//                                         <p className="text-sm text-gray-700 leading-relaxed">
//                                             {`${selectedInstitute.house_no || ''} ${selectedInstitute.street_name || ''}${selectedInstitute.landmark ? ', ' + selectedInstitute.landmark : ''}, ${selectedInstitute.state || ''}, ${selectedInstitute.country || ''} ${selectedInstitute.postcode || ''}`.trim() || 'N/A'}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Licensing</label>
//                                 <div className="space-y-3">
//                                     <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                                         <span className="text-sm font-medium text-gray-900">License No</span>
//                                         <span className="text-lg font-bold text-emerald-700">{selectedInstitute.license_number || 'N/A'}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
//                                         <User size={16} className="text-indigo-500" />
//                                         <span className="text-sm font-medium">Docs Verified by: {selectedInstitute.issuing_authority || 'N/A'}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </Modal>
//         </>
//     );
// };

import React, { useState, useMemo, useEffect } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { Button, Card, Modal } from '../common/UI';
import { API_CONFIG } from '../../apiconfig'; // Adjust path as needed
import { 
    Filter, 
    CheckCircle, 
    Phone, 
    Mail, 
    MapPin, 
    User, 
    Building2
} from 'lucide-react';

interface Institute {
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
    is_approved: number;
}

export const AdminVendorList = () => {
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
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
                setInstitutes(data);
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

    const filteredInstitutes = useMemo(() => {
        return institutes.filter(institute => {
            const statusMatch = filterStatus === 'all' || 
                (filterStatus === 'approved' && institute.is_approved === 1) ||
                (filterStatus === 'pending' && institute.is_approved === 0);
            return statusMatch;
        });
    }, [institutes, filterStatus]);

    // Pagination logic
    const paginatedInstitutes = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredInstitutes.slice(startIndex, endIndex);
    }, [filteredInstitutes, currentPage, rowsPerPage]);

    const totalPages = Math.max(1, Math.ceil(filteredInstitutes.length / rowsPerPage));

    const handleView = (institute: Institute) => {
        setSelectedInstitute(institute);
        setIsDetailsOpen(true);
    };

    const columns: Column<Institute>[] = [
        { 
            key: 'institute_name', 
            header: 'Institute Name', 
            sortable: true, 
            render: (institute) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="text-white" size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{institute.institute_name || 'N/A'}</p>
                    </div>
                </div>
            )
        },
        { 
            key: 'accreditation_no', 
            header: 'Accreditation No', 
            sortable: true,
            render: (institute) => (
                <span className="font-mono text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                    {institute.accreditation_no || 'N/A'}
                </span>
            )
        },
        { 
            key: 'admin_contact_person_name', 
            header: 'Institute Admin Contact Person', 
            sortable: true,
            render: (institute) => (
                <div className="space-y-1 text-sm">
                    <div className="font-medium text-gray-900">{institute.admin_contact_person_name || 'N/A'}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail size={12} /> {institute.admin_contact_person_email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={12} /> {institute.admin_contact_person_phone || 'N/A'}
                    </div>
                </div>
            )
        },
        { 
            key: 'customer_care_email', 
            header: 'Customer Care', 
            sortable: false,
            render: (institute) => (
                <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail size={12} /> {institute.customer_care_email || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={12} /> {institute.customer_care_phone || 'N/A'}
                    </div>
                </div>
            )
        },
        { 
            key: 'country', 
            header: 'Location', 
            sortable: true,
            render: (institute) => (
                <div className="max-w-[250px] space-y-1">
                    <div className="flex items-start gap-2 text-sm text-gray-700 leading-tight">
                        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5 flex-shrink-0" />
                        <span className="break-words leading-relaxed" title={`${institute.house_no || ''} ${institute.street_name || ''}${institute.landmark ? ', ' + institute.landmark : ''}, ${institute.state || ''}, ${institute.country || ''} ${institute.postcode || ''}`}>
                            {`${institute.house_no || ''} ${institute.street_name || ''}${institute.landmark ? ', ' + institute.landmark : ''}, ${institute.state || ''}, ${institute.country || ''} ${institute.postcode || ''}`.trim() || 'N/A'}
                        </span>
                    </div>
                </div>
            )
        },
        { 
            key: 'issuing_authority', 
            header: 'Docs Verified by ', 
            sortable: false,
            render: (institute) => (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User size={16} className="text-indigo-500" />
                    <span>{institute.issuing_authority || 'N/A'}</span>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-gray-500">Loading institutes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-red-500 text-center">
                    <div className="text-lg font-medium mb-2">Failed to load institutes</div>
                    <div className="text-sm mb-4">{error}</div>
                    <Button 
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <DataTable<Institute>
                title="Institute Management"
                data={paginatedInstitutes}
                columns={columns}
                searchKeys={['institute_name', 'admin_contact_person_name', 'admin_contact_person_email']}
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
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                }
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
                                <h3 className="text-xl font-bold text-gray-900">{selectedInstitute.institute_name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100`}>
                                        Institute
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        selectedInstitute.is_approved === 1 ? 'bg-green-100 text-green-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {selectedInstitute.is_approved === 1 ? 'Approved' : 'Pending'}
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
                                            <p className="font-medium text-gray-900">{selectedInstitute.admin_contact_person_name || 'N/A'}</p>
                                            <p className="text-xs text-gray-600">{selectedInstitute.admin_contact_person_email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                                        <Phone size={16} className="text-indigo-500" />
                                        <span className="font-medium">{selectedInstitute.admin_contact_person_phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Customer Care</label>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                                        <Mail size={16} className="text-teal-500" />
                                        <span className="font-medium">{selectedInstitute.customer_care_email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                                        <Phone size={16} className="text-teal-500" />
                                        <span className="font-medium">{selectedInstitute.customer_care_phone || 'N/A'}</span>
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
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {`${selectedInstitute.house_no || ''} ${selectedInstitute.street_name || ''}${selectedInstitute.landmark ? ', ' + selectedInstitute.landmark : ''}, ${selectedInstitute.state || ''}, ${selectedInstitute.country || ''} ${selectedInstitute.postcode || ''}`.trim() || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-3 block">Licensing</label>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <span className="text-sm font-medium text-gray-900">License No</span>
                                        <span className="text-lg font-bold text-emerald-700">{selectedInstitute.license_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                                        <User size={16} className="text-indigo-500" />
                                        <span className="text-sm font-medium">Docs Verified by: {selectedInstitute.issuing_authority || 'N/A'}</span>
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
