import api from './api';

export interface RegisterRequest {
  full_name: string;
  email_address: string;
  password: string;
  mobile_number?: string;
  rank?: number; // Backend expects number (1,2,3)
}

export interface RegisterResponse {
  seafarer_id?: number;
  full_name: string;
  email_address: string;
  mobile_number: string | null;
  rank?: number;
}

export const registerUser = async (data: RegisterRequest, userType: 'seafarer' | 'vendor') => {
  // Prepare payload - backend expects exact field names
  const payload = userType === 'seafarer' 
    ? { ...data }  // Includes rank if seafarer
    : { 
        full_name: data.full_name,
        email_address: data.email_address,
        password: data.password,
        mobile_number: data.mobile_number
      }; // No rank for vendors
    
  console.log('📤 Sending payload to /register:', payload); // Debug log
  
  const response = await api.post<RegisterResponse>('/register', payload);
  return response.data;
};
