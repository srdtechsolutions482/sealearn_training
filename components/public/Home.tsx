import React from 'react';
import { Button, Card } from '../common/UI';
import { Search } from 'lucide-react';
import { MOCK_COURSES } from '../../constants';


export const HomePage = ({ onNavigate }: { onNavigate: (v: string) => void }) => (
  <div className="space-y-16 pb-12">
    {/* Hero Section */}
    <div className="relative bg-blue-900 text-white py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/50 z-10"></div>
      <img src="public/assets/Ocean.jpg" alt="Ocean" className="absolute inset-0 w-full h-full object-cover opacity-30" />
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