import { useState } from 'react';
import { registerUser, RegisterRequest, RegisterResponse } from '../services/auth';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    formData: {
      fullName: string;
      email_address: string;
      password: string;
      mobile_number?: string;
      rank?: string;
    },
    userType: 'seafarer' | 'vendor'
  ): Promise<RegisterResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Build API payload matching backend expectations
      const data: RegisterRequest = {
        full_name: formData.fullName.trim(),
        email_address: formData.email_address.trim(),
        password: formData.password,
        mobile_number: formData.mobile_number?.trim() || undefined,
        ...(userType === 'seafarer' && formData.rank && { 
          rank: Number(formData.rank) // "1" → 1, "2" → 2, "3" → 3
        })
      };

      console.log('🔄 Register API Request:', { 
        data, 
        userType,
        finalPayload: data 
      }); // Debug log
      
      const response = await registerUser(data, userType);
      
      console.log('✅ Register API Response:', response); // Debug log
      
      // Success alerts as requested
      if (userType === 'seafarer' && response.seafarer_id) {
        alert(`Seafarer account created successfully! Seafarer ID: ${response.seafarer_id}`);
      } else {
        alert('Account created successfully!');
      }
      
      return response;
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.detail || 
                      err.message || 
                      'Registration failed. Please try again.';
      
      console.error('❌ Register API Error:', {
        message: errorMsg,
        status: err.response?.status,
        data: err.response?.data,
        fullError: err
      }); // Debug log
      
      setError(errorMsg);
      alert(`Registration failed: ${errorMsg}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, setError };
};
