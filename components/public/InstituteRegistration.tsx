import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Input } from "../common/UI";
import {
  Building2,
  User,
  Phone,
  FileText,
  BookOpen,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle,
  Trash2,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { API_CONFIG } from "../../apiconfig";

// --- API Types ---
interface ApiCourse {
  id: number;
  course_title: string;
}

interface ApiCountry {
  id: number;
  name: string;
  iso: string;
  phone_code: string;
  sortname?: string;
}

interface ApiState {
  id: number;
  name: string;
}

// Updated Phone Option Interface
interface PhoneCodeOption {
  id: number;
  value: number; // ID is the value
  label: string; // Visible text in dropdown: "ISO + Phone Code" (e.g., "IN +91")
  code: string; // The actual code string (e.g., "+91") for display in collapsed state
  countryName: string;
  iso: string; // Helper for auto-selection
}

interface DropdownOption {
  label: string;
  value: string;
}

// --- Reusable Searchable Dropdown Component ---
interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label.includes("*") ? (
          <>
            {label.split("*")[0]}
            <span className="text-red-500">*</span>
            {label.split("*")[1]}
          </>
        ) : (
          label
        )}
      </label>

      {/* Trigger Area */}
      <div
        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none transition-all flex justify-between items-center cursor-pointer 
                    ${
                      error
                        ? "border-red-300"
                        : isOpen
                        ? "ring-2 ring-blue-500 border-transparent"
                        : "border-slate-200"
                    }
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-300"
                    }
                `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`block truncate ${
            selectedOption ? "text-slate-900" : "text-gray-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100 bg-slate-50">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                autoFocus
                type="text"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between
                                        ${
                                          opt.value === value
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : "text-slate-700 hover:bg-slate-50"
                                        }
                                    `}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                  {opt.value === value && (
                    <CheckCircle size={14} className="text-blue-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                <p>No matches found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Updated Phone Input Component (ID based) ---
interface PhoneInputProps {
  label: string;
  selectedId: number; // Expecting the Country ID as value
  numberValue: string;
  onIdChange: (val: number) => void;
  onNumberChange: (val: string) => void;
  phoneCodes: PhoneCodeOption[];
  error?: string;
  readOnlyCode?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  selectedId,
  numberValue,
  onIdChange,
  onNumberChange,
  phoneCodes,
  error,
  readOnlyCode = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the currently selected option
  const selectedOption = phoneCodes.find((p) => p.value === selectedId);

  const filteredCodes = phoneCodes.filter(
    (c) =>
      c.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.countryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleIdSelect = (id: number) => {
    onIdChange(id);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    onNumberChange(val);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label.includes("*") ? (
          <>
            {label.split("*")[0]}
            <span className="text-red-500">*</span>
            {label.split("*")[1]}
          </>
        ) : (
          label
        )}
      </label>
      <div className="flex gap-2" ref={dropdownRef}>
        {/* Searchable Code Dropdown */}
        <div className="relative w-[130px] flex-shrink-0">
          <div
            className={`w-full px-3 py-3 bg-slate-50 border rounded-xl outline-none flex justify-between items-center transition-all 
            ${
              readOnlyCode
                ? "cursor-default bg-slate-100"
                : "cursor-pointer hover:border-blue-300"
            }
            ${
              isDropdownOpen
                ? "ring-2 ring-blue-500 border-transparent"
                : "border-slate-200"
            }`}
            onClick={() => !readOnlyCode && setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Display code (e.g., +91) when collapsed, or default if nothing selected */}
            <span
              className={`font-medium truncate ${
                readOnlyCode ? "text-slate-500" : "text-slate-800"
              }`}
            >
              {selectedOption ? selectedOption.code : "+ --"}
            </span>
            {!readOnlyCode && (
              <ChevronDown
                size={14}
                className={`text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            )}
          </div>

          {isDropdownOpen && !readOnlyCode && (
            <div className="absolute z-30 w-[200px] mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-gray-100 bg-slate-50">
                <div className="relative">
                  <Search
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={12}
                  />
                  <input
                    autoFocus
                    type="text"
                    className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto">
                {filteredCodes.length > 0 ? (
                  filteredCodes.map((c) => (
                    <div
                      key={c.id}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 flex justify-between items-center ${
                        c.value === selectedId
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-700"
                      }`}
                      onClick={() => handleIdSelect(c.value)}
                    >
                      {/* Visible text in dropdown: ISO + Code */}
                      <span>{c.label}</span>
                      {c.value === selectedId && <CheckCircle size={14} />}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-gray-500">
                    No results
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Number Input */}
        <input
          className={`flex-1 px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            error ? "border-red-300" : "border-slate-200"
          }`}
          value={numberValue}
          onChange={handleNumberInput}
          placeholder="e.g. 98765 43210"
          type="tel"
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
};

export const VendorInstituteRegistration: React.FC = () => {
  // --- UI State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Dynamic Data State ---
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);

  // Options for Dropdowns
  const [countryOptions, setCountryOptions] = useState<DropdownOption[]>([]);
  const [stateOptions, setStateOptions] = useState<DropdownOption[]>([]);
  const [phoneCodes, setPhoneCodes] = useState<PhoneCodeOption[]>([]);

  // --- Form State ---
  const [formData, setFormData] = useState({
    instituteName: "",
    accreditationNumber: "",
    // Address
    doorNo: "",
    street: "",
    landmark: "",
    country: "", // Stores ISO Code (e.g., 'IN')
    state: "", // Stores State Name
    pincode: "",
    // Admin Contact
    adminName: "",
    adminPhoneCodeId: 0, // Stores ID
    adminPhone: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    // Customer Care
    carePhoneCodeId: 0, // Stores ID
    carePhone: "",
    careEmail: "",
    // License
    licenseNumber: "",
    issuingAuthority: "DG Shipping",
    // Courses
    selectedCourses: [] as string[],
    otherCourse: "",
    // Documentation
    docFiles: [] as File[],
    declaration: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Multi-select State
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Helper for URLs ---
  const getUrl = (endpoint: string) => {
    const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
    const path = endpoint.replace(/^\//, "");
    return `${base}/${path}`;
  };

  // --- API Fetching ---
  const fetchStates = async (countryIso: string) => {
    if (!countryIso) return;
    try {
      // API call: /states/{iso} (e.g., /states/IN)
      const url = `${getUrl(API_CONFIG.ENDPOINTS.GET_STATES)}/${countryIso}`;
      const response = await fetch(url, { headers: API_CONFIG.HEADERS });
      const data = await response.json();
      const statesArray = Array.isArray(data) ? data : data.data || [];

      const options: DropdownOption[] = statesArray.map((s: ApiState) => ({
        label: s.name,
        value: s.name, // Using name as value for now as per previous context
      }));
      setStateOptions(options);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStateOptions([]);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      // Run all initial fetches in parallel
      const [coursesRes, countriesRes] = await Promise.allSettled([
        fetch(getUrl(API_CONFIG.ENDPOINTS.GET_COURSES), {
          headers: API_CONFIG.HEADERS,
        }),
        // Fetch Countries from the specific API for Phone Code data
        fetch(getUrl(API_CONFIG.ENDPOINTS.GET_COUNTRIES), {
          headers: API_CONFIG.HEADERS,
        }),
      ]);

      // 1. Process Courses
      if (coursesRes.status === "fulfilled") {
        try {
          const data = await coursesRes.value.json();
          const courses = Array.isArray(data) ? data : data.data || [];
          const uniqueTitles = Array.from(
            new Set(courses.map((c: ApiCourse) => c.course_title))
          ) as string[];
          setAvailableCourses(uniqueTitles);
        } catch (e) {
          console.error("Error parsing courses", e);
        }
      }

      // 2. Process Countries
      if (countriesRes.status === "fulfilled") {
        try {
          const data = await countriesRes.value.json();
          const countries = Array.isArray(data) ? data : data.data || [];

          // Map for Address Dropdown (Value = ISO, Label = Name)
          const addressOptions = countries.map((c: ApiCountry) => ({
            label: c.name,
            value: c.iso,
          }));
          setCountryOptions(addressOptions);

          // Map for Phone Dropdown (Value = ID, Label = "ISO + Code")
          const phoneOptions: PhoneCodeOption[] = countries.map(
            (c: ApiCountry) => ({
              id: c.id,
              value: c.id,
              label: `${c.iso} ${c.phone_code}`, // Requirement: ISO + phone_code visible text
              code: c.phone_code,
              countryName: c.name,
              iso: c.iso,
            })
          );
          setPhoneCodes(phoneOptions);

          // Set Default to India if available
          const india = countries.find(
            (c: ApiCountry) => c.iso === "IN" || c.name === "India"
          );

          if (india) {
            setFormData((prev) => ({
              ...prev,
              country: india.iso,
              adminPhoneCodeId: india.id,
              carePhoneCodeId: india.id,
            }));
            fetchStates(india.iso);
          }
        } catch (e) {
          console.error("Error parsing countries", e);
        }
      }
    };

    fetchInitialData();
  }, []);

  // --- Helpers ---

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleCountryChange = (isoCode: string) => {
    // 1. Update Address Country
    setFormData((prev) => {
      // 2. Auto-select Phone Code based on Country Selection
      // Find the phone code option with the same ISO
      const matchedPhoneOption = phoneCodes.find((p) => p.iso === isoCode);

      return {
        ...prev,
        country: isoCode, // Value is ISO
        state: "", // Reset state
        // If match found, update phone codes; otherwise keep existing or reset?
        // Keeping existing prevents annoying resets if country doesn't match perfectly,
        // but updating is usually desired behavior.
        adminPhoneCodeId: matchedPhoneOption
          ? matchedPhoneOption.id
          : prev.adminPhoneCodeId,
        carePhoneCodeId: matchedPhoneOption
          ? matchedPhoneOption.id
          : prev.carePhoneCodeId,
      };
    });

    fetchStates(isoCode); // Fetch states using ISO

    if (errors.country) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.country;
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        docFiles: [...prev.docFiles, ...newFiles],
      }));

      if (errors.docFiles) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.docFiles;
          return newErrors;
        });
      }
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      docFiles: prev.docFiles.filter((_, i) => i !== index),
    }));
  };

  const toggleCourse = (course: string) => {
    setFormData((prev) => {
      const current = prev.selectedCourses;
      if (current.includes(course)) {
        return {
          ...prev,
          selectedCourses: current.filter((c) => c !== course),
        };
      } else {
        return { ...prev, selectedCourses: [...current, course] };
      }
    });
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCourseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Validation ---

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Profile
    if (!formData.instituteName.trim())
      newErrors.instituteName = "Institute Name is required";
    if (!formData.accreditationNumber.trim())
      newErrors.accreditationNumber = "Accreditation Number is required";

    // Address
    if (!formData.doorNo.trim())
      newErrors.doorNo = "House / Flat No.  is required";
    if (!formData.street.trim()) newErrors.street = "Street Name is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Postalcode is required";

    // Admin Contact
    if (!formData.adminName.trim())
      newErrors.adminName = "Contact Person is required";
    if (!formData.adminPhone.trim()) newErrors.adminPhone = "Phone is required";

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = "Email is required";
    } else if (!emailRegex.test(formData.adminEmail)) {
      newErrors.adminEmail = "Invalid email format";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Must be at least 8 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Must contain an uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Must contain a lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Must contain a number";
      } else if (!/[!@#$%^&*]/.test(formData.password)) {
        newErrors.password = "Must contain a special character (!@#$%^&*)";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Customer Care
    if (!formData.carePhone.trim())
      newErrors.carePhone = "Care Phone is required";

    if (!formData.careEmail.trim()) {
      newErrors.careEmail = "Care Email is required";
    } else if (!emailRegex.test(formData.careEmail)) {
      newErrors.careEmail = "Invalid email format";
    }

    // License
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License Number is required";
    if (!formData.issuingAuthority.trim())
      newErrors.issuingAuthority = "Issuing Authority is required";

    // Courses
    if (formData.selectedCourses.length === 0)
      newErrors.selectedCourses = "Please select at least one course";
    if (
      formData.selectedCourses.includes("Other") &&
      !formData.otherCourse.trim()
    ) {
      newErrors.otherCourse = "Please specify the other course";
    }

    // Docs & Declaration
    if (formData.docFiles.length === 0)
      newErrors.docFiles =
        "Resolution Copy or Accreditation Certificate is required";
    if (!formData.declaration)
      newErrors.declaration = "You must agree to the declaration";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Find country name from ISO code
        const selectedCountryOption = countryOptions.find(
          (opt) => opt.value === formData.country
        );
        const countryName = selectedCountryOption
          ? selectedCountryOption.label
          : formData.country;

        // Resolve IDs to Code Strings for Payload
        const adminCodeStr =
          phoneCodes.find((p) => p.value === formData.adminPhoneCodeId)?.code ||
          "";
        const careCodeStr =
          phoneCodes.find((p) => p.value === formData.carePhoneCodeId)?.code ||
          "";

        // Construct payload according to API requirements
        const payload = {
          institute_name: formData.instituteName,
          accreditation_no: formData.accreditationNumber,
          house_no: formData.doorNo,
          street_name: formData.street,
          landmark: formData.landmark,
          country: countryName,
          state: formData.state,
          postcode: formData.pincode,
          admin_contact_person_name: formData.adminName,
          // Format: "+91 9876543210"
          admin_contact_person_phone: `${adminCodeStr} ${formData.adminPhone}`,
          admin_contact_person_email: formData.adminEmail,
          password: formData.password,
          customer_care_phone: `${careCodeStr} ${formData.carePhone}`,
          customer_care_email: formData.careEmail,
          license_number: formData.licenseNumber,
          issuing_authority: formData.issuingAuthority,
          created_by: "system",
        };

        const response = await fetch(
          getUrl(API_CONFIG.ENDPOINTS.CREATE_INSTITUTE),
          {
            method: "POST",
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to register institute");
        }

        const responseData = await response.json();
        console.log("Registration Success:", responseData);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Submission Error:", error);
        alert("Registration failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstError = document.querySelector(".text-red-500");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const filteredCourses = availableCourses.filter((c) =>
    c.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 animate-in fade-in zoom-in-95 duration-500">
        <Card className="text-center py-12 border-blue-100 bg-white shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed mb-8">
            Your institute register successfully after admin approval you can
            able to login using your email and password.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()}>
              Register Another Institute
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Register Your Institute
        </h1>
        <p className="text-gray-600 text-lg">
          Join our platform to offer DG Shipping-approved courses to thousands
          of seafarers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Institute Profile */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Building2 size={20} />
              </div>
              Institute Profile
            </h2>

            <div className="space-y-4">
              <Input
                label="Institute Name *"
                placeholder="e.g. Maritime Academy of India"
                value={formData.instituteName}
                onChange={(e: any) =>
                  handleInputChange("instituteName", e.target.value)
                }
                error={errors.instituteName}
              />

              <Input
                label="Accreditation Number *"
                placeholder="e.g. ACC-2024-001"
                value={formData.accreditationNumber}
                onChange={(e: any) =>
                  handleInputChange("accreditationNumber", e.target.value)
                }
                error={errors.accreditationNumber}
              />

              {/* Address Details with Labels and Dropdowns */}
              <div className="pt-2">
                <label className="block text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-gray-100">
                  Address Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Door No */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      House / Flat No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.doorNo ? "border-red-300" : "border-slate-200"
                      }`}
                      placeholder="e.g. 101, Sea View Tower"
                      value={formData.doorNo}
                      onChange={(e) =>
                        handleInputChange("doorNo", e.target.value)
                      }
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Street Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.street ? "border-red-300" : "border-slate-200"
                      }`}
                      placeholder="e.g. MG Road, Fort"
                      value={formData.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Landmark <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="e.g. Near Clock Tower"
                      value={formData.landmark}
                      onChange={(e) =>
                        handleInputChange("landmark", e.target.value)
                      }
                    />
                  </div>

                  {/* Country Searchable Dropdown */}
                  <div>
                    <SearchableSelect
                      label="Country *"
                      value={formData.country}
                      onChange={handleCountryChange}
                      options={countryOptions}
                      placeholder="Select Country"
                      error={errors.country}
                    />
                  </div>

                  {/* State Searchable Dropdown */}
                  <div>
                    <SearchableSelect
                      label="State *"
                      value={formData.state}
                      onChange={(val) => handleInputChange("state", val)}
                      options={stateOptions}
                      placeholder={
                        formData.country
                          ? stateOptions.length > 0
                            ? "Select State"
                            : "No states / Loading..."
                          : "Select Country First"
                      }
                      disabled={!formData.country}
                      error={errors.state}
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Postalcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.pincode ? "border-red-300" : "border-slate-200"
                      }`}
                      placeholder="e.g. 400001"
                      value={formData.pincode}
                      onChange={(e) =>
                        handleInputChange(
                          "pincode",
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                    />
                  </div>
                </div>
                {(errors.doorNo ||
                  errors.street ||
                  errors.country ||
                  errors.state ||
                  errors.pincode) && (
                  <p className="text-red-500 text-xs mt-2">
                    Please complete all address fields.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* 2. Admin Contact */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <User size={20} />
              </div>
              Admin Contact
            </h2>
            <div className="space-y-4">
              <Input
                label="Contact Person Name *"
                value={formData.adminName}
                onChange={(e: any) =>
                  handleInputChange("adminName", e.target.value)
                }
                error={errors.adminName}
              />

              <PhoneInput
                label="Phone Number *"
                selectedId={formData.adminPhoneCodeId}
                numberValue={formData.adminPhone}
                onIdChange={(val) => handleInputChange("adminPhoneCodeId", val)}
                onNumberChange={(val) => handleInputChange("adminPhone", val)}
                phoneCodes={phoneCodes}
                error={errors.adminPhone}
                readOnlyCode={true}
              />

              <Input
                label="Email *"
                type="email"
                value={formData.adminEmail}
                onChange={(e: any) =>
                  handleInputChange("adminEmail", e.target.value)
                }
                error={errors.adminEmail}
              />

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Password *"
                    type="password"
                    value={formData.password}
                    onChange={(e: any) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter strong password"
                    error={errors.password}
                  />
                  {!errors.password && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      Min 8 chars, mixed case, numbers & symbols.
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="Confirm Password *"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e: any) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Re-enter password"
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Customer Care */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                <Phone size={20} />
              </div>
              Customer Care
            </h2>
            <div className="space-y-4">
              <PhoneInput
                label="Phone Number *"
                selectedId={formData.carePhoneCodeId}
                numberValue={formData.carePhone}
                onIdChange={(val) => handleInputChange("carePhoneCodeId", val)}
                onNumberChange={(val) => handleInputChange("carePhone", val)}
                phoneCodes={phoneCodes}
                error={errors.carePhone}
                readOnlyCode={true}
              />

              <Input
                label="Email *"
                type="email"
                value={formData.careEmail}
                onChange={(e: any) =>
                  handleInputChange("careEmail", e.target.value)
                }
                error={errors.careEmail}
              />
            </div>
          </Card>

          {/* 4. License Details */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <FileText size={20} />
              </div>
              License Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="License Number *"
                  value={formData.licenseNumber}
                  onChange={(e: any) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  error={errors.licenseNumber}
                />
              </div>
              <div>
                <Input
                  label="Issuing Authority *"
                  value={formData.issuingAuthority}
                  onChange={(e: any) =>
                    handleInputChange("issuingAuthority", e.target.value)
                  }
                  error={errors.issuingAuthority}
                />
              </div>
            </div>
          </Card>

          {/* 5. Course Offerings */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <BookOpen size={20} />
              </div>
              Course Offerings
            </h2>

            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Courses Offered <span className="text-red-500">*</span>
              </label>

              {/* Selected Tags */}
              <div
                className={`w-full min-h-[50px] px-2 py-2 bg-slate-50 border rounded-xl cursor-text flex flex-wrap gap-2 items-center ${
                  errors.selectedCourses ? "border-red-300" : "border-slate-200"
                }`}
                onClick={() => {
                  setIsCourseDropdownOpen(true);
                }}
              >
                {formData.selectedCourses.map((course) => (
                  <span
                    key={course}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {course}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCourse(course);
                      }}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  className="bg-transparent outline-none flex-1 min-w-[120px] px-2 py-1 text-sm"
                  placeholder={
                    formData.selectedCourses.length === 0
                      ? availableCourses.length > 0
                        ? "Search and select courses..."
                        : "Loading courses..."
                      : ""
                  }
                  value={courseSearchTerm}
                  onChange={(e) => {
                    setCourseSearchTerm(e.target.value);
                    setIsCourseDropdownOpen(true);
                  }}
                  onFocus={() => setIsCourseDropdownOpen(true)}
                />
              </div>

              {/* Dropdown */}
              {isCourseDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredCourses.map((course, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center justify-between ${
                        formData.selectedCourses.includes(course)
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : ""
                      }`}
                      onClick={() => toggleCourse(course)}
                    >
                      {course}
                      {formData.selectedCourses.includes(course) && (
                        <CheckCircle size={16} />
                      )}
                    </div>
                  ))}
                  <div
                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm font-semibold text-blue-600 border-t border-gray-100 flex items-center justify-between ${
                      formData.selectedCourses.includes("Other")
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => toggleCourse("Other")}
                  >
                    Other
                    {formData.selectedCourses.includes("Other") && (
                      <CheckCircle size={16} />
                    )}
                  </div>
                  {filteredCourses.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No matching courses found. Select 'Other' to add manually.
                    </div>
                  )}
                </div>
              )}
              {errors.selectedCourses && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.selectedCourses}
                </p>
              )}
            </div>

            {/* Other Course Input */}
            {formData.selectedCourses.includes("Other") && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <Input
                  label="Specify Other Course(s) *"
                  placeholder="Enter course name..."
                  value={formData.otherCourse}
                  onChange={(e: any) =>
                    handleInputChange("otherCourse", e.target.value)
                  }
                  error={errors.otherCourse}
                />
              </div>
            )}
          </Card>

          {/* 6. Documentation */}
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <UploadCloud size={20} />
              </div>
              Accreditation / Resolution Documents
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
                <p className="text-base font-semibold text-gray-700">
                  Upload Resolution Copy or Accreditation Certificate
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, PNG, JPG (Max 20 MB)
                </p>
                <Button variant="outline" className="mt-4 pointer-events-none">
                  Browse Files
                </Button>
              </div>
            </div>

            {/* File List */}
            {formData.docFiles.length > 0 && (
              <div className="mt-4 space-y-3">
                {formData.docFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
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

            {errors.docFiles && (
              <p className="text-red-500 text-xs mt-2 text-center">
                {errors.docFiles}
              </p>
            )}
          </Card>

          {/* 7. Declaration */}
          <Card
            className={`border-l-4 ${
              errors.declaration ? "border-l-red-500" : "border-l-blue-600"
            }`}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500 mt-1"
                  checked={formData.declaration}
                  onChange={(e) =>
                    handleInputChange("declaration", e.target.checked)
                  }
                />
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900 block mb-1">
                  Self Declaration <span className="text-red-500">*</span>
                </span>
                I hereby declare that the information provided above is true and
                correct to the best of my knowledge. I understand that providing
                false information may lead to the rejection of this application
                or revocation of approval.
              </div>
            </label>
            {errors.declaration && (
              <p className="text-red-500 text-xs mt-2 ml-9">
                {errors.declaration}
              </p>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" className="px-8" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              className="px-8 py-3 text-lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Submitting...
                </>
              ) : (
                "Register Institute"
              )}
            </Button>
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
              <h3 className="font-bold text-gray-800 mb-4">
                Registration Steps
              </h3>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-2">
                {[
                  {
                    title: "Fill Details",
                    desc: "Complete institute profile & contacts",
                    active: true,
                  },
                  {
                    title: "Upload Docs",
                    desc: "Valid accreditation certificates",
                    active: true,
                  },
                  {
                    title: "Verification",
                    desc: "Admin verifies details (24-48 hrs)",
                    active: false,
                  },
                  {
                    title: "Go Live",
                    desc: "Start listing your courses",
                    active: false,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div
                      className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                        step.active
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    ></div>
                    <h4
                      className={`text-sm font-bold ${
                        step.active ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h4>
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
