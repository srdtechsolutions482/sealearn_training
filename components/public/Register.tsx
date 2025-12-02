
import React, { useState } from 'react';
import { Button, Card, Input } from '../common/UI';
import { Anchor, Building2 } from 'lucide-react';

export const RegisterPage = () => {
  const [userType, setUserType] = useState<'seafarer' | 'vendor'>('seafarer');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join the largest maritime community</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div 
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${userType === 'seafarer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => setUserType('seafarer')}
          >
            <Anchor className={`mb-2 ${userType === 'seafarer' ? 'text-blue-500' : 'text-gray-400'}`} />
            <h3 className="font-bold">I am a Seafarer</h3>
            <p className="text-sm text-gray-500">Looking for courses and certifications</p>
          </div>
          <div 
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${userType === 'vendor' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => setUserType('vendor')}
          >
            <Building2 className={`mb-2 ${userType === 'vendor' ? 'text-teal-500' : 'text-gray-400'}`} />
            <h3 className="font-bold">I am a Vendor</h3>
            <p className="text-sm text-gray-500">Want to list courses and manage students</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" />
            <Input label="Last Name" placeholder="Doe" />
          </div>
          <Input label="Email" type="email" placeholder="john@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          
          <Button className="w-full mt-4">Create Account</Button>
        </form>
      </Card>
    </div>
  );
};
