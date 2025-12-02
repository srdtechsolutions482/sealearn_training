import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '../common/UI';
import { 
    Building2, 
    MapPin, 
    User, 
    Phone, 
    Mail, 
    FileText, 
    BookOpen, 
    UploadCloud, 
    CheckSquare, 
    Search,
    X,
    AlertCircle,
    CheckCircle,
    Trash2
} from 'lucide-react';
import { MOCK_COURSES } from '../../constants';
import { User as UserType } from '../../types';

// Extract unique course titles for the dropdown
const AVAILABLE_COURSES = Array.from(new Set(MOCK_COURSES.map(c => c.title)));

interface Props {
    user?: UserType | null;
}

export const VendorInstituteRegistration: React.FC<Props> = ({ user }) => {
    // --- State ---
    const [formData, setFormData] = useState({
        instituteName: user?.name || '',
        accreditationNumber: user?.details?.licenseNumber || '',
        // Address
        doorNo: '',
        street: user?.address || '',
        landmark: '',
        country: 'India',
        state: '',
        pincode: '',
        // Admin Contact
        adminName: '',
        adminPhone: user?.phone || '',
        adminEmail: user?.email || '',
        // Customer Care
        carePhone: '',
        careEmail: '',
        // License
        licenseNumber: '',
        issuingAuthority: 'DG Shipping',
        // Courses
        selectedCourses: [] as string[],
        otherCourse: '',
        // Documentation
        docFiles: [] as File[],
        declaration: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Multi-select State
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Helpers ---
    
    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFormData(prev => ({ 
                ...prev, 
                docFiles: [...prev.docFiles, ...newFiles] 
            }));
            
            if (errors.docFiles) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.docFiles;
                    return newErrors;
                });
            }
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            docFiles: prev.docFiles.filter((_, i) => i !== index)
        }));
    };

    const toggleCourse = (course: string) => {
        setFormData(prev => {
            const current = prev.selectedCourses;
            if (current.includes(course)) {
                return { ...prev, selectedCourses: current.filter(c => c !== course) };
            } else {
                return { ...prev, selectedCourses: [...current, course] };
            }
        });
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCourseDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Validation ---

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        // Profile
        if (!formData.instituteName.trim()) newErrors.instituteName = "Institute Name is required";
        if (!formData.accreditationNumber.trim()) newErrors.accreditationNumber = "Accreditation Number is required";
        
        // Address
        if (!formData.doorNo.trim()) newErrors.doorNo = "Door No is required";
        if (!formData.street.trim()) newErrors.street = "Street Address is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

        // Admin Contact
        if (!formData.adminName.trim()) newErrors.adminName = "Contact Person is required";
        if (!formData.adminPhone.trim()) newErrors.adminPhone = "Phone is required";
        if (!formData.adminEmail.trim()) newErrors.adminEmail = "Email is required";

        // Customer Care
        if (!formData.carePhone.trim()) newErrors.carePhone = "Care Phone is required";
        if (!formData.careEmail.trim()) newErrors.careEmail = "Care Email is required";

        // License
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License Number is required";
        if (!formData.issuingAuthority.trim()) newErrors.issuingAuthority = "Issuing Authority is required";

        // Courses
        if (formData.selectedCourses.length === 0) newErrors.selectedCourses = "Please select at least one course";
        if (formData.selectedCourses.includes('Other') && !formData.otherCourse.trim()) {
            newErrors.otherCourse = "Please specify the other course";
        }

        // Docs & Declaration
        if (formData.docFiles.length === 0) newErrors.docFiles = "Resolution Copy or Accreditation Certificate is required";
        if (!formData.declaration) newErrors.declaration = "You must agree to the declaration";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // API Call would go here
            console.log("Submitting Registration:", formData);
            alert("Registration Submitted Successfully!");
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.text-red-500');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const filteredCourses = AVAILABLE_COURSES.filter(c => 
        c.toLowerCase().includes(courseSearchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
            
            {/* Header */}
            <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Institute</h1>
                <p className="text-gray-600 text-lg">Join our platform to offer DG Shipping-approved courses to thousands of seafarers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 1. Institute Profile */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Building2 size={20}/></div>
                            Institute Profile
                        </h2>
                        
                        <div className="space-y-4">
                            <Input 
                                label="Institute Name *"
                                placeholder="e.g. Maritime Academy of India"
                                value={formData.instituteName}
                                onChange={(e: any) => handleInputChange('instituteName', e.target.value)}
                            />
                            {errors.instituteName && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.instituteName}</p>}

                            <Input 
                                label="Accreditation Number *"
                                placeholder="e.g. ACC-2024-001"
                                value={formData.accreditationNumber}
                                onChange={(e: any) => handleInputChange('accreditationNumber', e.target.value)}
                            />
                            {errors.accreditationNumber && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.accreditationNumber}</p>}

                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Address Details</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.doorNo ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="Door No *"
                                        value={formData.doorNo}
                                        onChange={(e) => handleInputChange('doorNo', e.target.value)}
                                    />
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="Street Address 1 *"
                                        value={formData.street}
                                        onChange={(e) => handleInputChange('street', e.target.value)}
                                    />
                                    <input 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Landmark"
                                        value={formData.landmark}
                                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                                    />
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="Country *"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                    />
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="State *"
                                        value={formData.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                    />
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.pincode ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="Pincode *"
                                        value={formData.pincode}
                                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                                    />
                                </div>
                                {(errors.doorNo || errors.street || errors.country || errors.state || errors.pincode) && (
                                    <p className="text-red-500 text-xs mt-2">Please complete all address fields.</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* 2 & 3. Contacts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Admin Contact */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><User size={20}/></div>
                                Admin Contact
                            </h2>
                            <div className="space-y-4">
                                <Input 
                                    label="Contact Person *"
                                    value={formData.adminName}
                                    onChange={(e: any) => handleInputChange('adminName', e.target.value)}
                                />
                                {errors.adminName && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.adminName}</p>}

                                <Input 
                                    label="Phone Number *"
                                    value={formData.adminPhone}
                                    onChange={(e: any) => handleInputChange('adminPhone', e.target.value)}
                                />
                                {errors.adminPhone && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.adminPhone}</p>}

                                <Input 
                                    label="Email *"
                                    type="email"
                                    value={formData.adminEmail}
                                    onChange={(e: any) => handleInputChange('adminEmail', e.target.value)}
                                />
                                {errors.adminEmail && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.adminEmail}</p>}
                            </div>
                        </Card>

                         {/* Customer Care */}
                         <Card>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-teal-100 rounded-lg text-teal-600"><Phone size={20}/></div>
                                Customer Care
                            </h2>
                            <div className="space-y-4">
                                <Input 
                                    label="Phone Number *"
                                    value={formData.carePhone}
                                    onChange={(e: any) => handleInputChange('carePhone', e.target.value)}
                                />
                                {errors.carePhone && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.carePhone}</p>}

                                <Input 
                                    label="Email *"
                                    type="email"
                                    value={formData.careEmail}
                                    onChange={(e: any) => handleInputChange('careEmail', e.target.value)}
                                />
                                {errors.careEmail && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.careEmail}</p>}
                            </div>
                        </Card>
                    </div>

                    {/* 4. License Details */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><FileText size={20}/></div>
                            License Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <Input 
                                    label="License Number *"
                                    value={formData.licenseNumber}
                                    onChange={(e: any) => handleInputChange('licenseNumber', e.target.value)}
                                />
                                {errors.licenseNumber && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.licenseNumber}</p>}
                             </div>
                             <div>
                                <Input 
                                    label="Issuing Authority *"
                                    value={formData.issuingAuthority}
                                    onChange={(e: any) => handleInputChange('issuingAuthority', e.target.value)}
                                />
                                {errors.issuingAuthority && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.issuingAuthority}</p>}
                             </div>
                        </div>
                    </Card>

                    {/* 5. Course Offerings */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><BookOpen size={20}/></div>
                            Course Offerings
                        </h2>
                        
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Select Courses Offered *
                            </label>
                            
                            {/* Selected Tags */}
                            <div 
                                className={`w-full min-h-[50px] px-2 py-2 bg-slate-50 border rounded-xl cursor-text flex flex-wrap gap-2 items-center ${errors.selectedCourses ? 'border-red-300' : 'border-slate-200'}`}
                                onClick={() => { setIsCourseDropdownOpen(true); }}
                            >
                                {formData.selectedCourses.map(course => (
                                    <span key={course} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        {course}
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleCourse(course); }}
                                            className="hover:text-blue-900"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input 
                                    type="text" 
                                    className="bg-transparent outline-none flex-1 min-w-[120px] px-2 py-1 text-sm"
                                    placeholder={formData.selectedCourses.length === 0 ? "Search and select courses..." : ""}
                                    value={courseSearchTerm}
                                    onChange={(e) => { setCourseSearchTerm(e.target.value); setIsCourseDropdownOpen(true); }}
                                    onFocus={() => setIsCourseDropdownOpen(true)}
                                />
                            </div>

                            {/* Dropdown */}
                            {isCourseDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                    {filteredCourses.map((course, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-between ${formData.selectedCourses.includes(course) ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                                            onClick={() => toggleCourse(course)}
                                        >
                                            {course}
                                            {formData.selectedCourses.includes(course) && <CheckCircle size={16} />}
                                        </div>
                                    ))}
                                    <div 
                                        className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm font-semibold text-blue-600 border-t border-gray-100 flex items-center justify-between ${formData.selectedCourses.includes('Other') ? 'bg-blue-50' : ''}`}
                                        onClick={() => toggleCourse('Other')}
                                    >
                                        Other
                                        {formData.selectedCourses.includes('Other') && <CheckCircle size={16} />}
                                    </div>
                                    {filteredCourses.length === 0 && (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No matching courses found. Select 'Other' to add manually.</div>
                                    )}
                                </div>
                            )}
                            {errors.selectedCourses && <p className="text-red-500 text-xs mt-1">{errors.selectedCourses}</p>}
                        </div>

                        {/* Other Course Input */}
                        {formData.selectedCourses.includes('Other') && (
                            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                <Input 
                                    label="Specify Other Course(s) *"
                                    placeholder="Enter course name..."
                                    value={formData.otherCourse}
                                    onChange={(e: any) => handleInputChange('otherCourse', e.target.value)}
                                />
                                {errors.otherCourse && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.otherCourse}</p>}
                            </div>
                        )}
                    </Card>

                    {/* 6. Documentation */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><UploadCloud size={20}/></div>
                            Documentation
                        </h2>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                            <input 
                                type="file" 
                                multiple
                                accept=".pdf,.png,.jpg,.jpeg" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <div className="text-center pointer-events-none">
                                <UploadCloud className="text-gray-400 mx-auto mb-3" size={40} />
                                <p className="text-base font-semibold text-gray-700">Upload Resolution Copy or Accreditation Certificate</p>
                                <p className="text-sm text-gray-500 mt-1">Supports PDF, PNG, JPG (Max 5MB)</p>
                                <Button variant="outline" className="mt-4 pointer-events-none">Browse Files</Button>
                            </div>
                        </div>

                        {/* File List */}
                        {formData.docFiles.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {formData.docFiles.map((file, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-white">
                                        <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFile(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.docFiles && <p className="text-red-500 text-xs mt-2 text-center">{errors.docFiles}</p>}
                    </Card>

                    {/* 7. Declaration */}
                    <Card className={`border-l-4 ${errors.declaration ? 'border-l-red-500' : 'border-l-blue-600'}`}>
                         <label className="flex items-start gap-4 cursor-pointer">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-1"
                                    checked={formData.declaration}
                                    onChange={(e) => handleInputChange('declaration', e.target.checked)}
                                />
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed">
                                <span className="font-bold text-gray-900 block mb-1">Self Declaration *</span>
                                I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that providing false information may lead to the rejection of this application or revocation of approval.
                            </div>
                        </label>
                        {errors.declaration && <p className="text-red-500 text-xs mt-2 ml-9">{errors.declaration}</p>}
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="outline" className="px-8">Cancel</Button>
                        <Button className="px-8 py-3 text-lg" onClick={handleSubmit}>Register Institute</Button>
                    </div>

                </div>

                {/* Right Sidebar: Guidelines */}
                <div className="hidden lg:block space-y-6">
                    <div className="sticky top-24">
                        <Card className="bg-blue-50 border-blue-100 mb-6">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} /> Why Register?
                            </h3>
                            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                                <li>Get listed on the largest maritime course platform.</li>
                                <li>Manage courses and batches efficiently.</li>
                                <li>Direct enrollment from seafarers.</li>
                                <li>Digital certificate verification integration.</li>
                            </ul>
                        </Card>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-gray-800 mb-4">Registration Steps</h3>
                            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-2">
                                {[
                                    { title: "Fill Details", desc: "Complete institute profile & contacts", active: true },
                                    { title: "Upload Docs", desc: "Valid accreditation certificates", active: true },
                                    { title: "Verification", desc: "Admin verifies details (24-48 hrs)", active: false },
                                    { title: "Go Live", desc: "Start listing your courses", active: false }
                                ].map((step, idx) => (
                                    <div key={idx} className="relative pl-8">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${step.active ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
                                        <h4 className={`text-sm font-bold ${step.active ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};