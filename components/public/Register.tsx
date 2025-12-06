import React, { useState } from 'react';
import { Button, Card, Input } from '../common/UI';
import { Anchor, Eye, EyeOff, Search, ChevronDown } from 'lucide-react';
import {API_CONFIG} from '../../apiconfig';

const dialCodes = [
  { code: "+91", label: "India" },
  { code: "+1", label: "USA" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "Australia" },
  { code: "+81", label: "Japan" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+7", label: "Russia" },
  { code: "+55", label: "Brazil" },
  { code: "+27", label: "South Africa" },
  { code: "+86", label: "China" },
  { code: "+39", label: "Italy" },
  { code: "+34", label: "Spain" },
  { code: "+31", label: "Netherlands" },
  { code: "+64", label: "New Zealand" },
  { code: "+82", label: "South Korea" },
  { code: "+48", label: "Poland" },
  { code: "+46", label: "Sweden" },
  { code: "+41", label: "Switzerland" },
  { code: "+351", label: "Portugal" }
];

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email_address: '',
    password: '',
    dialCode: '+91',
    mobile_number: '',
    rank: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [dialCodeOpen, setDialCodeOpen] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email_address: '',
    password: '',
    mobile_number: '',
    rank: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fullNameRegex = /^[A-Za-z\s]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const mobileRegex = /^[0-9]{10}$/;

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || fullNameRegex.test(value)) {
      setFormData({ ...formData, fullName: value });
      setFieldErrors({ ...fieldErrors, fullName: '' });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email_address: e.target.value });
    setFieldErrors({ ...fieldErrors, email_address: '' });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    setFieldErrors({ ...fieldErrors, password: '' });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, mobile_number: value });
      setFieldErrors({ ...fieldErrors, mobile_number: '' });
    }
  };

  const handleRankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, rank: e.target.value });
    setFieldErrors({ ...fieldErrors, rank: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const filteredDialCodes = dialCodes.filter(({ label, code }) =>
    label.toLowerCase().includes(dialCodeSearch.toLowerCase()) ||
    code.includes(dialCodeSearch)
  );

  const selectDialCode = (code: string) => {
    setFormData({ ...formData, dialCode: code });
    setDialCodeOpen(false);
    setDialCodeSearch('');
  };

  const validateForm = (): boolean => {
    const newErrors: any = { 
      fullName: '', 
      email_address: '', 
      password: '', 
      mobile_number: '',
      rank: ''
    };
    let isValid = true;

    if (formData.fullName.trim() === '') {
      newErrors.fullName = 'Full Name is required.';
      isValid = false;
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
      isValid = false;
    }

    if (!emailRegex.test(formData.email_address.trim())) {
      newErrors.email_address = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 6+ chars with uppercase, lowercase, number & special character.';
      isValid = false;
    }

    // ✅ MOBILE NUMBER OPTIONAL - only validate format if provided
    if (formData.mobile_number && !mobileRegex.test(formData.mobile_number)) {
    newErrors.mobile_number = 'Mobile number must be exactly 10 digits.';
    isValid = false;
  }

  // ✅ RANK OPTIONAL - only validate if provided (backend defaults to 0)
  if (formData.rank && formData.rank === '') {
    newErrors.rank = 'Please select your rank or leave empty.';
    isValid = false;
  }

    setFieldErrors(newErrors);
    setSubmitError('');
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      const registerPayload = {
        full_name: formData.fullName.trim(),
        email_address: formData.email_address.trim(),
        password: formData.password
      };

      if (formData.mobile_number) {
      registerPayload.mobile_number = formData.dialCode + formData.mobile_number;
    }

    // ✅ RANK OPTIONAL - send 0 if empty (backend expects number)
    registerPayload.rank = formData.rank ? parseInt(formData.rank) : 0;

      console.log('🚀 Sending seafarer registration:', registerPayload);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER_SEAFARER}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(registerPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Registration successful:', result);

      // Reset form
      setFormData({
        fullName: '',
        email_address: '',
        password: '',
        dialCode: '+91',
        mobile_number: '',
        rank: ''
      });
      setShowPassword(false);
      setDialCodeOpen(false);
      setFieldErrors({ 
        fullName: '', 
        email_address: '', 
        password: '', 
        mobile_number: '',
        rank: '' 
      });

      alert('Registration successful! Welcome aboard.');
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Anchor className="mx-auto mb-4 w-16 h-16 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2">Seafarer Registration</h2>
          <p className="text-gray-500">Join the largest maritime community</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-1">
            <Input
              label="Full Name *"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleFullNameChange}
              className={fieldErrors.fullName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              required
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-sm text-red-600 min-h-[20px] flex items-center">
                <span className="w-4 h-4 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Input
              label="Email Address *"
              type="email"
              placeholder="Enter your email address"
              value={formData.email_address}
              onChange={handleEmailChange}
              className={fieldErrors.email_address ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              required
            />
            {fieldErrors.email_address && (
              <p className="mt-1 text-sm text-red-600 min-h-[20px] flex items-center">
                <span className="w-4 h-4 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                {fieldErrors.email_address}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handlePasswordChange}
                className={`block w-full rounded-md border shadow-sm focus:ring-2 focus:ring-offset-2 sm:text-sm pr-10 py-2 px-3 ${
                  fieldErrors.password
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 min-h-[20px] flex items-center">
                <span className="w-4 h-4 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Mobile Number with Dial Code */}
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">Dial Code</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white text-sm h-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  onClick={() => setDialCodeOpen(!dialCodeOpen)}
                  disabled={loading}
                >
                  <span className="font-mono">{formData.dialCode}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${dialCodeOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dialCodeOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-hidden" style={{ minWidth: '200px' }}>
                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100 z-10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search country..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                          value={dialCodeSearch}
                          onChange={(e) => setDialCodeSearch(e.target.value)}
                          autoFocus
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {filteredDialCodes.length > 0 ? (
                        filteredDialCodes.map(({ code, label }) => (
                          <button
                            key={code}
                            type="button"
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 text-sm transition-colors first:rounded-t-md"
                            onClick={() => selectDialCode(code)}
                            disabled={loading}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-semibold text-gray-900">{code}</span>
                              <span className="text-gray-700">{label}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          <div className="w-12 h-12 mx-auto mb-2 text-gray-300">
                            <Search className="w-full h-full" />
                          </div>
                          No countries found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-9">
              <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number</label>
              <Input
                placeholder="Enter 10 digit mobile number (optional)"
                type="tel"
                value={formData.mobile_number}
                onChange={handleMobileChange}
                maxLength={10}
                pattern="\d{10}"
                className={`!h-11 !text-sm ${fieldErrors.mobile_number ? '!border-red-300 !bg-red-50 focus:!border-red-500 focus:!ring-red-500' : ''}`}
                disabled={loading}
              />
              {fieldErrors.mobile_number && (
                <p className="mt-1 text-xs text-red-600 min-h-[16px] flex items-center ml-1">
                  <span className="w-3 h-3 mr-1 flex-shrink-0">
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {fieldErrors.mobile_number}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Rank</label>
            <select
              className={`mt-1 block w-full rounded-md border shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                fieldErrors.rank ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 bg-white'
              }`}
              value={formData.rank}
              onChange={handleRankChange}
              disabled={loading}
            >
              <option value="">Select your rank</option>
              <option value="1">Deck Cadet</option>
              <option value="2">Captain</option>
              <option value="3">Chief Engineer</option>
            </select>
            {fieldErrors.rank && (
              <p className="mt-1 text-sm text-red-600 min-h-[20px] flex items-center">
                <span className="w-4 h-4 mr-2">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                {fieldErrors.rank}
              </p>
            )}
          </div>

          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          {Object.values(fieldErrors).some(error => error) && !loading && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">Please fix the errors above before submitting.</p>
            </div>
          )}

          <Button className="w-full mt-4" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Seafarer Account'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
