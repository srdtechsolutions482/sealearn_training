import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button, Card, Input } from './Shared';
import { Anchor, Search, MapPin, Phone, Mail, Building2 } from 'lucide-react';
import { MOCK_COURSES } from '../constants';

interface PublicProps {
  onNavigate: (view: string) => void;
  onLogin: (role: UserRole) => void;
}

export const PublicHeader = ({ onNavigate }: { onNavigate: (v: string) => void }) => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <Anchor className="text-blue-600" size={28} />
          <span className="font-bold text-xl text-gray-900">Seafarer Connect</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          {['Home', 'Institutions', 'About', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => onNavigate(item.toLowerCase() === 'home' ? 'home' : item.toLowerCase())}
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('login')}>Login</Button>
          <Button onClick={() => onNavigate('register')}>Sign Up</Button>
        </div>
      </div>
    </div>
  </header>
);

export const HomePage = ({ onNavigate }: { onNavigate: (v: string) => void }) => (
  <div className="space-y-16 pb-12">
    {/* Hero Section */}
    <div className="relative bg-blue-900 text-white py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/50 z-10"></div>
      <img src="https://picsum.photos/1920/600" alt="Ocean" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Navigate Your Maritime Career</h1>
        <p className="text-xl text-blue-100 mb-8">Find the best STCW courses, connect with top maritime institutions, and manage your seafarer profile all in one place.</p>
        <div className="flex justify-center gap-4">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search for courses (e.g., Fire Fighting)..." 
              className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
            <Search className="absolute left-4 top-4 text-gray-400" />
          </div>
          <Button onClick={() => onNavigate('register')} className="rounded-full px-8 py-4 text-lg">Get Started</Button>
        </div>
      </div>
    </div>

    {/* Featured Courses */}
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MOCK_COURSES.slice(0, 3).map(course => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <div className="h-48 -mx-6 -mt-6 mb-4 bg-gray-200">
               <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-t-xl" />
            </div>
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{course.category}</span>
              <span className="text-green-600 font-bold">${course.price}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{course.vendorName}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{course.duration}</span>
              <span>⭐ {course.rating}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export const LoginPage = ({ onLogin }: { onLogin: (r: UserRole) => void }) => {
  const [activeTab, setActiveTab] = useState<'seafarer' | 'vendor'>('seafarer');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) onLogin(UserRole.ADMIN);
    else if (activeTab === 'vendor') onLogin(UserRole.VENDOR);
    else onLogin(UserRole.SEAFARER);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'seafarer' && !isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('seafarer'); setIsAdmin(false); }}
          >
            Seafarer
          </button>
          <button 
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'vendor' && !isAdmin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('vendor'); setIsAdmin(false); }}
          >
            Vendor
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email Address" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded text-blue-600" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
              <span className="text-gray-600">Login as Admin (Demo)</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full">
            Login as {isAdmin ? 'Admin' : activeTab === 'seafarer' ? 'Seafarer' : 'Vendor'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

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
            <h3 className="font-bold">I am an Institution</h3>
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
          
          {userType === 'vendor' && (
             <Input label="Institution Name" placeholder="Maritime Academy Inc." />
          )}
          
          <Button className="w-full mt-4">Create Account</Button>
        </form>
      </Card>
    </div>
  );
};

export const ContactPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <form className="space-y-4">
                    <Input label="Name" placeholder="Your Name" />
                    <Input label="Email" placeholder="your@email.com" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"></textarea>
                    </div>
                    <Button>Send Message</Button>
                </form>
            </Card>
            <div className="space-y-6 flex flex-col justify-center">
                 <div className="flex items-center gap-4">
                     <div className="bg-blue-100 p-3 rounded-full text-blue-600"><MapPin /></div>
                     <div><h3 className="font-bold">Address</h3><p className="text-gray-600">123 Ocean Drive, Marina Bay</p></div>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Phone /></div>
                     <div><h3 className="font-bold">Phone</h3><p className="text-gray-600">+1 234 567 8900</p></div>
                 </div>
                 <div className="flex items-center gap-4">
                     <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Mail /></div>
                     <div><h3 className="font-bold">Email</h3><p className="text-gray-600">support@seaconnect.com</p></div>
                 </div>
            </div>
        </div>
    </div>
);