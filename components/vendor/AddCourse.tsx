import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input, Modal } from '../common/UI';
import { Course } from '../../types';
import { 
    Image as ImageIcon, 
    Calendar, 
    MapPin, 
    Clock, 
    DollarSign, 
    AlertCircle, 
    CheckCircle, 
    RotateCcw,
    ChevronDown,
    Search,
    ArrowLeft,
    AlertTriangle,
    Ban
} from 'lucide-react';

// Predefined Standard Courses for the Dropdown
const STANDARD_COURSES = [
    { title: "Basic STCW Safety Training", type: "Safety", audience: "All Seafarers" },
    { title: "Advanced Fire Fighting", type: "Safety", audience: "Officers" },
    { title: "Medical First Aid", type: "Medical", audience: "All Seafarers" },
    { title: "GMDSS", type: "Communication", audience: "Radio Officers" },
    { title: "ECDIS Type Specific", type: "Navigation", audience: "Deck Officers" },
    { title: "Ship Security Officer", type: "Security", audience: "Officers" },
];

interface VendorCourseFormProps {
    initialData?: Course | null;
    mode?: 'create' | 'edit' | 'view';
    onBack?: () => void;
    onSubmit?: (data: any) => void;
}

export const VendorCourseForm = ({ initialData, mode = 'create', onBack, onSubmit }: VendorCourseFormProps) => {
    // --- State ---
    const [formData, setFormData] = useState({
        titleSelect: '',
        customTitle: '',
        courseType: '',
        targetAudience: '',
        description: '',
        thumbnail: null as File | null,
        thumbnailPreview: '',
        mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
        location: '',
        duration: '',
        currency: 'USD',
        price: '',
        startDate: '',
        endDate: '',
        instructor: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Suspend Modal State
    const [showSuspendModal, setShowSuspendModal] = useState(false);
    const [suspendConfirmation, setSuspendConfirmation] = useState('');

    const dropdownRef = useRef<HTMLDivElement>(null);

    // --- Derived State for Preview ---
    const displayTitle = formData.titleSelect === 'Other' ? formData.customTitle : formData.titleSelect;
    const fee = parseFloat(formData.price) || 0;
    const siteFee = (fee * 0.20).toFixed(2);
    const vendorFee = (fee * 0.80).toFixed(2);
    const isViewMode = mode === 'view';

    // --- Initialization Effect ---
    useEffect(() => {
        if (initialData) {
            const isStandard = STANDARD_COURSES.some(c => c.title === initialData.title);
            
            // Extract numeric duration if string contains text
            const durationVal = initialData.duration ? initialData.duration.replace(/\D/g, '') : '';

            setFormData({
                titleSelect: isStandard ? initialData.title : 'Other',
                customTitle: isStandard ? '' : initialData.title,
                courseType: initialData.courseType || '',
                targetAudience: initialData.targetAudience || '',
                description: initialData.courseOverview || '',
                thumbnail: null,
                thumbnailPreview: `https://picsum.photos/seed/${initialData.id}/400/200`, // Mock image
                mode: initialData.mode || 'Online',
                location: initialData.mode === 'Offline' ? 'Main Campus, Building A' : '', // Mock location if not in type
                duration: durationVal,
                currency: 'USD',
                price: initialData.price.toString(),
                startDate: new Date().toISOString().split('T')[0], // Mock dates
                endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
                instructor: 'Capt. John Doe' // Mock instructor
            });
        }
    }, [initialData]);

    // --- Effects ---

    // Auto-populate Type and Audience
    useEffect(() => {
        if (mode === 'view') return; // Don't auto-overwrite in view mode
        const standard = STANDARD_COURSES.find(c => c.title === formData.titleSelect);
        if (standard) {
            setFormData(prev => ({
                ...prev,
                courseType: standard.type,
                targetAudience: standard.audience
            }));
        } else if (formData.titleSelect === 'Other' && !initialData) {
            // Only clear if not editing/viewing existing data
             setFormData(prev => ({
                ...prev,
                courseType: '',
                targetAudience: ''
            }));
        }
    }, [formData.titleSelect, mode, initialData]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Handlers ---

    const handleInputChange = (key: string, value: any) => {
        if (isViewMode) return;
        setFormData(prev => ({ ...prev, [key]: value }));
        // Clear specific error when user types
        if (errors[key]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewMode) return;
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                thumbnail: file,
                thumbnailPreview: URL.createObjectURL(file)
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        // 1. Title Validation
        if (!formData.titleSelect) newErrors.titleSelect = "Course title is required";
        if (formData.titleSelect === 'Other' && !formData.customTitle.trim()) {
            newErrors.customTitle = "Please specify the course title";
        }

        // 4. Description Validation (No Phone/Email)
        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else {
            const phoneRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[0-9]{2,20}[-\s\.]?[0-9]{2,20}\b/g;
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            if (phoneRegex.test(formData.description) || emailRegex.test(formData.description)) {
                newErrors.description = "Description cannot contain contact details (Phone or Email).";
            }
        }

        // 6-7. Mode & Location
        if (formData.mode === 'Offline' && !formData.location.trim()) {
            newErrors.location = "Location is mandatory for offline courses";
        }

        // 8. Duration
        if (!formData.duration.trim()) newErrors.duration = "Duration is required";

        // 9. Fee
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid course fee is required";
        }

        // 10-11. Dates
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (formData.mode === 'Offline') {
            if (!formData.startDate) {
                newErrors.startDate = "Start date is mandatory for offline courses";
            } else {
                const start = new Date(formData.startDate);
                if (start < today) newErrors.startDate = "Start date cannot be in the past";
            }

            if (!formData.endDate) {
                newErrors.endDate = "End date is mandatory for offline courses";
            } else if (formData.startDate) {
                const start = new Date(formData.startDate);
                const end = new Date(formData.endDate);
                if (end <= start) newErrors.endDate = "End date must be after start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            if (onSubmit) {
                onSubmit(formData);
            } else {
                alert("Course Saved Successfully!");
            }
        } else {
            // Scroll to top error
            const firstError = document.querySelector('.text-red-500');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSuspend = () => {
        if (suspendConfirmation === 'SUSPEND') {
             if (onSubmit) {
                 // Pass status as 'suspended'
                 onSubmit({ ...formData, status: 'suspended' });
                 alert("Course has been suspended.");
             }
             setShowSuspendModal(false);
             if (onBack) onBack();
        }
    };

    const handleReset = () => {
        setFormData({
            titleSelect: '',
            customTitle: '',
            courseType: '',
            targetAudience: '',
            description: '',
            thumbnail: null,
            thumbnailPreview: '',
            mode: 'Online',
            location: '',
            duration: '',
            currency: 'USD',
            price: '',
            startDate: '',
            endDate: '',
            instructor: ''
        });
        setErrors({});
        setSearchTerm('');
    };

    const filteredCourses = STANDARD_COURSES.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-300 relative">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                {onBack && (
                    <Button variant="outline" onClick={onBack} className="px-3">
                        <ArrowLeft size={20} />
                    </Button>
                )}
                <h1 className="text-2xl font-bold text-gray-800">
                    {mode === 'create' ? 'Register New Course' : mode === 'edit' ? 'Edit Course' : 'Course Details'}
                </h1>
                {isViewMode && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">Read Only</span>}
                {mode === 'edit' && initialData?.status === 'suspended' && (
                     <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                        <Ban size={12}/> Suspended
                     </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Course Details</h2>
                            {!isViewMode && <span className="text-xs text-gray-400">* Required Fields</span>}
                        </div>

                        <div className="space-y-6">
                            {/* 1. Course Title (Searchable Dropdown) */}
                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Course Title {!isViewMode && <span className="text-red-500">*</span>}
                                </label>
                                {isViewMode ? (
                                    <input 
                                        type="text" 
                                        value={displayTitle} 
                                        readOnly 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
                                    />
                                ) : (
                                    <div 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl cursor-pointer flex justify-between items-center ${errors.titleSelect ? 'border-red-300' : 'border-slate-200'}`}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className={!formData.titleSelect ? 'text-gray-400' : 'text-gray-900'}>
                                            {formData.titleSelect || "Select Course Title"}
                                        </span>
                                        <ChevronDown size={18} className="text-gray-400" />
                                    </div>
                                )}
                                
                                {isDropdownOpen && !isViewMode && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                                                <input 
                                                    type="text" 
                                                    placeholder="Search..." 
                                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        {filteredCourses.map((course, idx) => (
                                            <div 
                                                key={idx} 
                                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                                onClick={() => {
                                                    handleInputChange('titleSelect', course.title);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {course.title}
                                            </div>
                                        ))}
                                        <div 
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm font-semibold text-blue-600 border-t border-gray-100"
                                            onClick={() => {
                                                handleInputChange('titleSelect', 'Other');
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            Other
                                        </div>
                                    </div>
                                )}
                                {errors.titleSelect && <p className="text-red-500 text-xs mt-1">{errors.titleSelect}</p>}
                            </div>

                            {/* Custom Title Input if 'Other' */}
                            {formData.titleSelect === 'Other' && !isViewMode && (
                                <Input 
                                    label="Specify Course Title *"
                                    value={formData.customTitle}
                                    onChange={(e: any) => handleInputChange('customTitle', e.target.value)}
                                    placeholder="Enter custom course name"
                                />
                            )}
                            {errors.customTitle && <p className="text-red-500 text-xs mt-1 -translate-y-4">{errors.customTitle}</p>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 2. Course Type (Locked) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Course Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        value={formData.courseType}
                                        readOnly
                                        placeholder="Auto-populated"
                                    />
                                </div>

                                {/* 3. Target Audience (Locked) */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Target Audience</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        value={formData.targetAudience}
                                        readOnly
                                        placeholder="Auto-populated"
                                    />
                                </div>
                            </div>

                            {/* 4. Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Course Description {!isViewMode && <span className="text-red-500">*</span>}
                                </label>
                                <textarea 
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all h-32 ${errors.description ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'} ${isViewMode ? 'bg-gray-50 text-gray-500' : ''}`}
                                    placeholder="Enter detailed course description..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    readOnly={isViewMode}
                                />
                                {errors.description ? (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.description}</p>
                                ) : !isViewMode && (
                                    <p className="text-xs text-gray-400 mt-1">Note: Do not include phone numbers or email addresses.</p>
                                )}
                            </div>

                            {/* 5. Thumbnail */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Thumbnail</label>
                                <div className={`border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 ${!isViewMode && 'hover:bg-gray-100 cursor-pointer'} transition-colors relative`}>
                                    {!isViewMode && (
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                        />
                                    )}
                                    {formData.thumbnailPreview ? (
                                        <div className="relative w-full h-32">
                                            <img src={formData.thumbnailPreview} alt="Preview" className="w-full h-full object-contain" />
                                            {!isViewMode && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity">Change Image</div>}
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="text-gray-400 mb-2" size={32} />
                                            <p className="text-sm text-gray-500">
                                                {isViewMode ? 'No image available' : 'Click to upload image'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-xl font-bold text-gray-800">Logistical Information</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {/* 6. Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mode {!isViewMode && <span className="text-red-500">*</span>}</label>
                                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200 w-fit">
                                    <button 
                                        disabled={isViewMode}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${formData.mode === 'Online' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'} ${isViewMode && 'cursor-default'}`}
                                        onClick={() => handleInputChange('mode', 'Online')}
                                    >
                                        Online
                                    </button>
                                    <button 
                                        disabled={isViewMode}
                                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${formData.mode === 'Offline' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'} ${isViewMode && 'cursor-default'}`}
                                        onClick={() => handleInputChange('mode', 'Offline')}
                                    >
                                        Offline
                                    </button>
                                </div>
                            </div>

                            {/* 7. Location (Conditional) */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Location {formData.mode === 'Offline' && !isViewMode && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="text"
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-300' : 'border-slate-200'} ${isViewMode ? 'bg-gray-50 text-gray-500' : ''}`}
                                        placeholder={formData.mode === 'Online' ? "Optional for Online courses" : "Enter complete address"}
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        readOnly={isViewMode}
                                    />
                                </div>
                                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                            </div>

                            {/* 8. Duration */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Duration {!isViewMode && <span className="text-red-500">*</span>}</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration ? 'border-red-300' : 'border-slate-200'} ${isViewMode ? 'bg-gray-50 text-gray-500' : ''}`}
                                            placeholder="e.g. 5"
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                            readOnly={isViewMode}
                                        />
                                        <span className="absolute right-4 top-3.5 text-gray-500 text-sm font-medium">Days</span>
                                    </div>
                                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                                </div>

                                {/* 9. Course Fee */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Course Fee {!isViewMode && <span className="text-red-500">*</span>}</label>
                                    <div className="flex gap-2">
                                        <select 
                                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 outline-none disabled:opacity-60"
                                            value={formData.currency}
                                            onChange={(e) => handleInputChange('currency', e.target.value)}
                                            disabled={isViewMode}
                                        >
                                            <option value="USD">USD</option>
                                            <option value="INR">INR</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                        <div className="relative w-full">
                                            <input 
                                                type="number" 
                                                step="0.01"
                                                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-300' : 'border-slate-200'} ${isViewMode ? 'bg-gray-50 text-gray-500' : ''}`}
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange('price', e.target.value)}
                                                readOnly={isViewMode}
                                            />
                                        </div>
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            {/* 10-11. Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Start Date {formData.mode === 'Offline' && !isViewMode && <span className="text-red-500">*</span>}
                                    </label>
                                    <input 
                                        type="date" 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-300' : 'border-slate-200'} ${isViewMode ? 'bg-gray-50 text-gray-500' : ''}`}
                                        value={formData.startDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        readOnly={isViewMode}
                                    />
                                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        End Date {formData.mode === 'Offline' && !isViewMode && <span className="text-red-500">*</span>}
                                    </label>
                                    <input 
                                        type="date" 
                                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-300' : 'border-slate-200'} ${isViewMode ? 'bg-gray-50 text-gray-500' : ''}`}
                                        value={formData.endDate}
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        readOnly={isViewMode}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                                </div>
                            </div>

                            {/* 12. Instructor */}
                            <Input 
                                label="Instructor Name"
                                placeholder="Optional"
                                value={formData.instructor}
                                onChange={(e: any) => handleInputChange('instructor', e.target.value)}
                                disabled={isViewMode}
                            />

                            {/* 13. Buttons */}
                            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                {mode === 'edit' && (
                                    <Button 
                                        variant="danger" 
                                        className="mr-auto" 
                                        onClick={() => {
                                            setSuspendConfirmation('');
                                            setShowSuspendModal(true);
                                        }}
                                    >
                                        <Ban size={18}/> Suspend Course
                                    </Button>
                                )}
                                <div className="flex gap-4 ml-auto">
                                    {isViewMode ? (
                                        <Button onClick={onBack} variant="outline">Close View</Button>
                                    ) : (
                                        <>
                                            {onBack && <Button variant="outline" onClick={onBack}>Cancel</Button>}
                                            <Button variant="outline" onClick={handleReset}><RotateCcw size={18}/> Reset</Button>
                                            <Button onClick={handleSubmit}><CheckCircle size={18}/> {mode === 'create' ? 'Create Course' : 'Save Changes'}</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Live Preview */}
                <div className="lg:col-span-1 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Live Preview</h3>
                    <Card className="p-0 overflow-hidden border-0 shadow-xl">
                        {/* Preview Image */}
                        <div className="h-48 bg-gray-200 relative">
                            {formData.thumbnailPreview ? (
                                <img src={formData.thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                                    <ImageIcon size={48} className="opacity-50" />
                                    <span className="text-xs mt-2">No Thumbnail</span>
                                </div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                                {formData.courseType && (
                                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm text-gray-800">
                                        {formData.courseType}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border ${
                                    formData.mode === 'Online' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                }`}>
                                    {formData.mode}
                                </span>
                                <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                                    <span className="text-gray-400 font-normal">Rating:</span> {initialData?.rating || 'New'}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg leading-tight mb-2 text-gray-900 min-h-[1.5em]">
                                {displayTitle || "Course Title"}
                            </h3>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <Clock size={14}/> {formData.duration ? `${formData.duration} Days` : '-- Days'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={14}/> {formData.mode === 'Online' ? 'Remote' : (formData.location || 'Location')}
                                </span>
                            </div>

                            <div className="flex items-end justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Course Fee</p>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {formData.price ? `${formData.currency} ${formData.price}` : `${formData.currency} 0.00`}
                                    </span>
                                </div>
                                <Button className="py-2 px-4 text-sm h-auto shadow-none">Enroll</Button>
                            </div>
                        </div>
                        
                        {/* Fee Breakdown (Vendor View Only) */}
                        <div className="bg-slate-900 text-slate-300 p-4 text-xs space-y-2">
                            <p className="font-bold text-white mb-2 border-b border-slate-700 pb-2">Fee Breakdown</p>
                            <div className="flex justify-between">
                                <span>Site Owner (20%)</span>
                                <span className="text-white">{formData.currency} {siteFee}</span>
                            </div>
                            <div className="flex justify-between text-teal-400 font-bold">
                                <span>Vendor Amount (80%)</span>
                                <span>{formData.currency} {vendorFee}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Suspend Confirmation Modal */}
            <Modal 
                isOpen={showSuspendModal} 
                onClose={() => setShowSuspendModal(false)} 
                title="Suspend Course Confirmation"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex gap-3 items-start">
                        <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                        <div className="text-sm">
                            <p className="font-bold mb-1">Warning: Irreversible Action</p>
                            <p>Suspending this course will prevent any new students from enrolling. Existing students will still have access to the course materials.</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Type <span className="font-mono bg-gray-100 px-1 rounded text-red-600">SUSPEND</span> to confirm
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                            value={suspendConfirmation}
                            onChange={(e) => setSuspendConfirmation(e.target.value)}
                            placeholder="SUSPEND"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setShowSuspendModal(false)}>Cancel</Button>
                        <Button 
                            variant="danger" 
                            disabled={suspendConfirmation !== 'SUSPEND'}
                            onClick={handleSuspend}
                        >
                            Confirm Suspension
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// Wrapper for the standard "Add Course" route
export const VendorAddCourse = () => <VendorCourseForm mode="create" />;