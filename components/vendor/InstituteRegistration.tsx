import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input } from '../common/UI';
import { Country, State } from 'country-state-city';
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

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VendorInstituteRegistration: React.FC<Props> = ({ user }) => {
    // --- State ---
    const [formData, setFormData] = useState({
        instituteName: user?.name || '',
        accreditationNumber: user?.details?.licenseNumber || '',
        // Address
        doorNo: '',
        street: user?.address || '',
        landmark: '',
        country: user?.country || '',
        state: '',
        pincode: '',
        // Admin Contact
        adminName: '',
        adminPhone: user?.phone || '',
        adminEmail: user?.email || '',
        adminDialCode: '',
        // Customer Care
        carePhone: '',
        careEmail: '',
        careDialCode: '',

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
    const [countries, setCountries] = useState<{ isoCode: string; name: string }[]>([]);
    const [states, setStates] = useState<{ isoCode: string; name: string }[]>([]);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Country Search State
    const [countrySearchTerm, setCountrySearchTerm] = useState('');
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [selectedCountryName, setSelectedCountryName] = useState('');

    // State Search State
    const [stateSearchTerm, setStateSearchTerm] = useState('');
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const [selectedStateName, setSelectedStateName] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);
    const countryDropdownRef = useRef<HTMLDivElement>(null);
    const stateDropdownRef = useRef<HTMLDivElement>(null);

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

    // Only allow numbers for phone fields
    const handlePhoneInput = (key: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        handleInputChange(key, numericValue);
    };

    // Only allow numbers for flat/door number
    const handleNumberOnlyInput = (key: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        handleInputChange(key, numericValue);
    };

    // Email validation
    const isValidEmail = (email: string): boolean => {
        return EMAIL_REGEX.test(email);
    };

    const handleCountryChange = (isoCode: string) => {
        handleInputChange('country', isoCode);
        setStates([]);  
        setFormData(prev => ({ ...prev, state: '' }));
        setSelectedStateName('');
        setStateSearchTerm('');
        
        if (isoCode) {
            setStates(State.getStatesOfCountry(isoCode));
        }
    };

    const handleCountrySelect = (isoCode: string) => {
        const country = countries.find(c => c.isoCode === isoCode);
        handleCountryChange(isoCode);
        setSelectedCountryName(country?.name || '');
        setCountrySearchTerm('');
        setIsCountryDropdownOpen(false);
    };

    const handleStateChange = (isoCode: string) => {
        handleInputChange('state', isoCode);
    };

    const handleStateSelect = (isoCode: string) => {
        const state = states.find(s => s.isoCode === isoCode);
        handleStateChange(isoCode);
        setSelectedStateName(state?.name || '');
        setStateSearchTerm('');
        setIsStateDropdownOpen(false);
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.isoCode.toLowerCase().includes(countrySearchTerm.toLowerCase())
    );

    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
        state.isoCode.toLowerCase().includes(stateSearchTerm.toLowerCase())
    );

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

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        setFormData({
            instituteName: '',
            accreditationNumber: '',
            doorNo: '',
            street: '',
            landmark: '',
            country: '',
            state: '',
            pincode: '',
            adminName: '',
            adminPhone: '', // Keep admin phone on reset
            adminEmail: '',
            adminDialCode: '',
            carePhone: '',
            careEmail: '',
            careDialCode: '',
            licenseNumber: '',
            issuingAuthority: '',
            selectedCourses: [],
            otherCourse: '',
            docFiles: [],
            declaration: false
        });
        
        setErrors({});
        setCourseSearchTerm('');
        setIsCourseDropdownOpen(false);
        setCountrySearchTerm('');
        setSelectedCountryName('');
        setIsCountryDropdownOpen(false);
        setStateSearchTerm('');
        setSelectedStateName('');
        setIsStateDropdownOpen(false);
        setStates([]);
        
        setShowResetConfirm(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCourseDropdownOpen(false);
            }
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
                setIsCountryDropdownOpen(false);
            }
            if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
                setIsStateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        setCountries(Country.getAllCountries());

        // Sync country name on mount
        if (formData.country) {
            const country = Country.getAllCountries().find(c => c.isoCode === formData.country);
            if (country) {
                setSelectedCountryName(country.name);
                setStates(State.getStatesOfCountry(formData.country));
            }
        }

        // Sync state name on mount
        if (formData.state && states.length > 0) {
            const state = states.find(s => s.isoCode === formData.state);
            if (state) {
                setSelectedStateName(state.name);
            }
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync state name when states change
    useEffect(() => {
        if (formData.state && states.length > 0) {
            const state = states.find(s => s.isoCode === formData.state);
            if (state && selectedStateName !== state.name) {
                setSelectedStateName(state.name);
            }
        }
    }, [states, formData.state, selectedStateName]);

    // --- Validation ---

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        // Profile
        if (!formData.instituteName.trim()) newErrors.instituteName = "Institute Name is required";
        if (!formData.accreditationNumber.trim()) newErrors.accreditationNumber = "Accreditation Number is required";
        
        // Address
        if (!formData.doorNo.trim()) newErrors.doorNo = "Door No is required";
        if (!formData.street.trim()) newErrors.street = "Street Address is required";
        if (!formData.landmark.trim()) newErrors.landmark = "Landmark is required"; 
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";

        // Admin Contact
        if (!formData.adminName.trim()) newErrors.adminName = "Contact Person is required";
        if (!formData.adminPhone.trim()) newErrors.adminPhone = "Phone is required";
        else if (formData.adminPhone.length !== 10) newErrors.adminPhone = "Phone number must be at least 10 digits";
        if (!formData.adminDialCode.trim()) {
    newErrors.adminDialCode = "Dial Code is required";
}
        
        if (!formData.adminEmail.trim()) newErrors.adminEmail = "Email is required";
        else if (!isValidEmail(formData.adminEmail)) newErrors.adminEmail = "Invalid email format";

        // Customer Care
        if (!formData.carePhone.trim()) newErrors.carePhone = "Care Phone is required";
        else if (formData.carePhone.length !== 10) newErrors.carePhone = "Phone number must be at least 10 digits";
        if (!formData.careDialCode.trim()) {
    newErrors.careDialCode = "Dial Code is required";
}
        
        if (!formData.careEmail.trim()) newErrors.careEmail = "Care Email is required";
        else if (!isValidEmail(formData.careEmail)) newErrors.careEmail = "Invalid email format";

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
            console.log("Submitting Registration:", formData);
            alert("Registration Submitted Successfully!");
        } else {
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
                                <label className="block text-sm font-semibold text-slate-700 mb-4">Address Details</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    
                                    {/* 1. House/Flat No - Alphanumeric */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">House/Flat No *</label>
                                        <input 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.doorNo ? 'border-red-300' : 'border-slate-200'}`}
                                            placeholder="12A, 5B, 101"
                                            value={formData.doorNo}
                                            onChange={(e) => {
                                                const alphaNumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                                handleInputChange('doorNo', alphaNumericValue);
                                            }}
                                        />
                                        {/* {errors.doorNo && <p className="text-red-500 text-xs mt-1">{errors.doorNo}</p>} */}
                                    </div>

                                    {/* 2. Street Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Street Name *</label>
                                        <input 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-300' : 'border-slate-200'}`}
                                            placeholder="Main Road, Park Street"
                                            value={formData.street}
                                            onChange={(e) => handleInputChange('street', e.target.value)}
                                        />
                                        {/* {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>} */}
                                    </div>

                                    {/* 3. Landmark */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Landmark *</label>
                                        <input 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.landmark ? 'border-red-300' : 'border-slate-200'}`}
                                            placeholder="Near XYZ Mall, Opp. Park"
                                            value={formData.landmark}
                                            onChange={(e) => handleInputChange('landmark', e.target.value)}
                                        />
                                        {/* {errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>} */}
                                    </div>

                                    {/* 4. Country Dropdown */}
                                    <div className="relative" ref={countryDropdownRef}>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Country *</label>
                                        <div className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus-within:ring-2 focus-within:ring-blue-500 ${errors.country ? 'border-red-300' : 'border-slate-200'}`}>
                                            <input
                                                type="text"
                                                placeholder="Search countries..."
                                                value={isCountryDropdownOpen ? countrySearchTerm : selectedCountryName}
                                                onChange={(e) => {
                                                    setCountrySearchTerm(e.target.value);
                                                    setIsCountryDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsCountryDropdownOpen(true)}
                                                className="w-full bg-transparent outline-none text-sm"
                                            />
                                            
                                        </div>
                                        
                                        {/* Country Dropdown */}
                                        {isCountryDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map(country => (
                                                        <div
                                                            key={country.isoCode}
                                                            onMouseDown={() => handleCountrySelect(country.isoCode)}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
                                                        >
                                                            {country.name}
                                                            {selectedCountryName === country.name && <CheckCircle size={14} className="text-blue-600" />}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-sm text-slate-500">No countries found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 5. State Dropdown */}
                                    <div className="relative" ref={stateDropdownRef}>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">State *</label>
                                        <div className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus-within:ring-2 focus-within:ring-blue-500 ${errors.state ? 'border-red-300' : 'border-slate-200'}`}>
                                            <input
                                                type="text"
                                                placeholder={formData.country ? "Search states..." : "Select Country first"}
                                                value={isStateDropdownOpen ? stateSearchTerm : selectedStateName}
                                                onChange={(e) => {
                                                    setStateSearchTerm(e.target.value);
                                                    setIsStateDropdownOpen(true);
                                                }}
                                                onFocus={() => {
                                                    if (formData.country) setIsStateDropdownOpen(true);
                                                }}
                                                className="w-full bg-transparent outline-none text-sm disabled:text-gray-400"
                                                disabled={!formData.country}
                                            />
                                            {/* {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>} */}
                                        </div>
                                        
                                        {/* State Dropdown */}
                                        {isStateDropdownOpen && formData.country && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                {filteredStates.length > 0 ? (
                                                    filteredStates.map(state => (
                                                        <div
                                                            key={state.isoCode}
                                                            onMouseDown={() => handleStateSelect(state.isoCode)}
                                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
                                                        >
                                                            {state.name}
                                                            {selectedStateName === state.name && <CheckCircle size={14} className="text-blue-600" />}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-sm text-slate-500">No states found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 6. Postcode - Digits Only */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Postcode *</label>
                                        <input 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.pincode ? 'border-red-300' : 'border-slate-200'}`}
                                            placeholder="400001"
                                            value={formData.pincode}
                                            onChange={(e) => {
                                                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                                handleInputChange('pincode', numericValue);
                                            }}
                                            inputMode="numeric"
                                            maxLength={6}
                                        />
                                        {/* {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>} */}
                                    </div>
                                </div>
                                
                                {/* Summary Error */}
                                {(errors.doorNo || errors.street || errors.landmark || errors.country || errors.state || errors.pincode) && (
                                    <p className="text-red-500 text-xs mt-3 font-medium">Please complete all address fields correctly.</p>
                                )}
                            </div>

                        </div>
                    </Card>

                    {/* 2 & 3. Contacts - FULL WIDTH STACKED */}
                    <div className="space-y-8">
                        {/* Admin Contact - Full Width */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><User size={20}/></div>
                                Admin Contact
                            </h2>
                            <div className="space-y-4">
                                <Input 
                                    label="Contact Person Name *"
                                    value={formData.adminName}
                                    onChange={(e: any) => handleInputChange('adminName', e.target.value)}
                                />
                                {errors.adminName && <p className="text-red-500 text-xs -mt-3 mb-3">{errors.adminName}</p>}

                                {/* Dial Code + Phone Number Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Dial Code */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Dial Code</label>
                                        <input 
                                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="+91"
                                            value={formData.adminDialCode || ''}
                                            onChange={(e) => handleInputChange('adminDialCode', e.target.value)}
                                            maxLength={5}
                                        />
                                        {errors.adminDialCode && <p className="text-red-500 text-xs mt-1">{errors.adminDialCode}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number * (10 digits)</label>
                                        <input 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.adminPhone ? 'border-red-300' : 'border-slate-200'}`}
                                            placeholder="9876543210"
                                            value={formData.adminPhone}
                                            onChange={(e) => handlePhoneInput('adminPhone', e.target.value)}
                                            inputMode="numeric"
                                            maxLength={10}
                                        />
                                        {errors.adminPhone && <p className="text-red-500 text-xs mt-1">{errors.adminPhone}</p>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.adminEmail ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="admin@example.com"
                                        type="email"
                                        value={formData.adminEmail}
                                        onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                                    />
                                    {errors.adminEmail && <p className="text-red-500 text-xs mt-1">{errors.adminEmail}</p>}
                                </div>
                            </div>
                        </Card>


                        {/* Customer Care - Full Width */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-teal-100 rounded-lg text-teal-600"><Phone size={20}/></div>
                                Customer Care
                            </h2>
                            <div className="space-y-4">
                                {/* Dial Code + Phone Number Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Dial Code */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Dial Code</label>
                                        <input 
                                            className="w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="+91"
                                            value={formData.careDialCode || ''}
                                            onChange={(e) => handleInputChange('careDialCode', e.target.value)}
                                            maxLength={5}
                                        />
                                        {errors.careDialCode && <p className="text-red-500 text-xs mt-1">{errors.careDialCode}</p>}

                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number * (10 digits)</label>
                                        <input 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.carePhone ? 'border-red-300' : 'border-slate-200'}`}
                                            placeholder="9876543210"
                                            value={formData.carePhone}
                                            onChange={(e) => handlePhoneInput('carePhone', e.target.value)}
                                            inputMode="numeric"
                                            maxLength={10}
                                        />
                                        {errors.carePhone && <p className="text-red-500 text-xs mt-1">{errors.carePhone}</p>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                                    <input 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.careEmail ? 'border-red-300' : 'border-slate-200'}`}
                                        placeholder="care@example.com"
                                        type="email"
                                        value={formData.careEmail}
                                        onChange={(e) => handleInputChange('careEmail', e.target.value)}
                                    />
                                    {errors.careEmail && <p className="text-red-500 text-xs mt-1">{errors.careEmail}</p>}
                                </div>
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

                    {/* 5. Course Offerings - SEARCHABLE */}
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
                            <div className="text-center pointer-events-none flex flex-col items-center">
                                <UploadCloud className="text-gray-400 mx-auto mb-3" size={40} />
                                <p className="text-base font-semibold text-gray-700 text-center">Upload Resolution Copy or Accreditation Certificate</p>
                                <p className="text-sm text-gray-500 mt-1 text-center">Supports PDF, PNG, JPG (Max 5MB)</p>
                                <div className="mt-4">
                                    <Button variant="outline" className="pointer-events-none mx-auto block">Browse Files</Button>
                                </div>
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

                    {/* Reset Confirmation Modal */}
                    {showResetConfirm && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                                <div className="text-center mb-6">
                                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Clear All Fields?</h3>
                                    <p className="text-gray-600">
                                        This action will reset all form data (except admin phone). This cannot be undone.
                                    </p>
                                </div>
                                
                                <div className="flex gap-3 justify-end pt-4">
                                    <Button 
                                        variant="outline" 
                                        className="px-6"
                                        onClick={() => setShowResetConfirm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        className="px-6 bg-red-600 hover:bg-red-700 text-white"
                                        onClick={confirmReset}
                                    >
                                        Yes, Reset All
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-4">
                        <Button 
                            variant="outline" 
                            className="px-8 hover:bg-red-50 hover:text-red-600 border-red-200"
                            onClick={handleReset}
                        >
                            Reset All Fields
                        </Button>
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
