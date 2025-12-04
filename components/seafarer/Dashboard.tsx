import React from 'react';
import { Card, Button } from '../common/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SEAFARER_PROGRESS_DATA, MOCK_COURSES } from '../../constants';
import { Award, BookOpen, Clock } from 'lucide-react';

export const SeafarerDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, Captain!</h2>
        <Button>Browse New Courses</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100">Enrolled Courses</p>
              <h3 className="text-4xl font-bold mt-2">3</h3>
            </div>
            <BookOpen className="opacity-50" size={32} />
          </div>
          <div className="mt-4 text-sm text-blue-100">2 in progress</div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-teal-100">Certificates Earned</p>
              <h3 className="text-4xl font-bold mt-2">12</h3>
            </div>
            <Award className="opacity-50" size={32} />
          </div>
          <div className="mt-4 text-sm text-teal-100">Last earned: Feb 2024</div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100">Training Hours</p>
              <h3 className="text-4xl font-bold mt-2">320</h3>
            </div>
            <Clock className="opacity-50" size={32} />
          </div>
          <div className="mt-4 text-sm text-indigo-100">Total lifetime</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <Card className="h-80">
          <h3 className="font-bold mb-4">Competency Progress</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SEAFARER_PROGRESS_DATA} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="completed" barSize={20} radius={[0, 4, 4, 0]}>
                {SEAFARER_PROGRESS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed === 100 ? '#10B981' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recommended Courses */}
        <Card>
          <h3 className="font-bold mb-4">Recommended for You</h3>
          <div className="space-y-4">
            {MOCK_COURSES.slice(0, 3).map(course => (
               <div key={course.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                 <img src={course.image} className="w-24 h-20 object-cover rounded-md" alt="" />
                 <div className="flex-1">
                   <h4 className="font-bold text-sm">{course.title}</h4>
                   <p className="text-xs text-gray-500 mb-1">{course.vendorName}</p>
                   <div className="flex justify-between items-center mt-2">
                     <span className="text-green-600 font-bold text-sm">${course.price}</span>
                     <Button variant="outline" className="px-2 py-1 text-xs h-auto">View</Button>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};