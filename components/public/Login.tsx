import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Button, Card, Input } from '../common/UI';
import { MOCK_USERS } from '../../constants';
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';

export const LoginPage = ({ onLogin }: { onLogin: (r: UserRole) => void }) => {
  const [activeTab, setActiveTab] = useState<'seafarer' | 'vendor'>('seafarer');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let targetUser;
    let targetRole;

    if (isAdmin) {
      targetUser = MOCK_USERS.admin;
      targetRole = UserRole.ADMIN;
    } else if (activeTab === 'vendor') {
      targetUser = MOCK_USERS.vendor;
      targetRole = UserRole.VENDOR;
    } else {
      targetUser = MOCK_USERS.seafarer;
      targetRole = UserRole.SEAFARER;
    }

    if (email === targetUser.email && password === targetUser.password) {
      onLogin(targetRole);
    } else {
      setError('Invalid email or password. Please check the demo credentials below.');
    }
  };

  const fillCredentials = (roleKey: string) => {
    const user = MOCK_USERS[roleKey];
    setEmail(user.email);
    setPassword(user.password || '');
    setError('');
    
    if (roleKey === 'admin') {
      setIsAdmin(true);
    } else if (roleKey === 'vendor') {
      setIsAdmin(false);
      setActiveTab('vendor');
    } else {
      setIsAdmin(false);
      setActiveTab('seafarer');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        
        {/* Login Form */}
        <Card className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'seafarer' && !isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              onClick={() => { setActiveTab('seafarer'); setIsAdmin(false); setError(''); }}
            >
              Seafarer
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'vendor' && !isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              onClick={() => { setActiveTab('vendor'); setIsAdmin(false); setError(''); }}
            >
              Vendor
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm mb-4 border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              label="Email Address" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 focus:ring-blue-500" 
                  checked={isAdmin} 
                  onChange={(e) => { setIsAdmin(e.target.checked); setError(''); }} 
                />
                <span className="text-gray-600">Login as Admin (Demo)</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full">
              Login as {isAdmin ? 'Admin' : activeTab === 'seafarer' ? 'Seafarer' : 'Vendor'}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials Helper */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-600"/> Demo Credentials
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Click any user below to autofill the login form.
            </p>

            <div className="space-y-3">
              {/* Seafarer Creds */}
              <div 
                onClick={() => fillCredentials('seafarer')}
                className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-800">Seafarer User</span>
                  <Copy size={14} className="text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="text-xs text-gray-500 space-y-1 font-mono">
                  <p>Email: <span className="text-gray-800">{MOCK_USERS.seafarer.email}</span></p>
                  <p>Pass: <span className="text-gray-800">{MOCK_USERS.seafarer.password}</span></p>
                </div>
              </div>

              {/* Vendor Creds */}
              <div 
                onClick={() => fillCredentials('vendor')}
                className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-all group"
              >
                 <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-800">Vendor (Institution)</span>
                  <Copy size={14} className="text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="text-xs text-gray-500 space-y-1 font-mono">
                  <p>Email: <span className="text-gray-800">{MOCK_USERS.vendor.email}</span></p>
                  <p>Pass: <span className="text-gray-800">{MOCK_USERS.vendor.password}</span></p>
                </div>
              </div>

              {/* Admin Creds */}
              <div 
                onClick={() => fillCredentials('admin')}
                className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-all group"
              >
                 <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-800">System Admin</span>
                  <Copy size={14} className="text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="text-xs text-gray-500 space-y-1 font-mono">
                  <p>Email: <span className="text-gray-800">{MOCK_USERS.admin.email}</span></p>
                  <p>Pass: <span className="text-gray-800">{MOCK_USERS.admin.password}</span></p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};