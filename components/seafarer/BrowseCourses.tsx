import React from 'react';
import { Card, Button } from '../common/UI';
import { MOCK_COURSES } from '../../constants';
import { Search, Filter, Clock, Star } from 'lucide-react';

export const SeafarerBrowseCourses = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Browse Courses</h2>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
             <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
             <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <Button variant="outline"><Filter size={18} /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COURSES.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                <img src={`https://picsum.photos/seed/${course.id}/400/200`} alt={course.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                    {course.category}
                </span>
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-3">{course.vendorName}</p>
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                    <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400"/> {course.rating > 0 ? course.rating : 'New'}</span>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <span className="text-xl font-bold text-blue-600">${course.price}</span>
                <Button className="py-1 px-3 text-sm">Enroll Now</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};