import React from 'react';
import { Card, Button, Input } from './Shared';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { VENDOR_COURSE_STATUS_DATA, MOCK_COURSES } from '../constants';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const VendorDashboard = () => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">Vendor Dashboard</h2>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Chart */}
         <Card className="col-span-2 h-80">
            <h3 className="font-bold mb-4">Course Status Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VENDOR_COURSE_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {VENDOR_COURSE_STATUS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
         </Card>
         
         {/* Stats Stack */}
         <div className="space-y-4">
            <Card className="bg-blue-50 border-blue-100">
               <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
               <h3 className="text-3xl font-bold text-blue-900">$12,450</h3>
            </Card>
            <Card className="bg-teal-50 border-teal-100">
               <p className="text-teal-600 text-sm font-medium">Active Students</p>
               <h3 className="text-3xl font-bold text-teal-900">142</h3>
            </Card>
            <Card className="bg-indigo-50 border-indigo-100">
               <p className="text-indigo-600 text-sm font-medium">Courses Listed</p>
               <h3 className="text-3xl font-bold text-indigo-900">8</h3>
            </Card>
         </div>
       </div>

       {/* Course List Preview */}
       <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">My Courses</h3>
            <Button>View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Course Name</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_COURSES.map(course => (
                  <tr key={course.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4">${course.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs text-white ${
                        course.status === 'approved' ? 'bg-green-500' : 
                        course.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{course.enrolled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </Card>
    </div>
  );
};

export const VendorAddCourse = () => (
  <Card className="max-w-3xl mx-auto">
    <h2 className="text-xl font-bold mb-6">Register New Course</h2>
    <form className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Input label="Course Title" placeholder="e.g. Adv. Fire Fighting" />
        <Input label="Category" placeholder="e.g. Safety" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Input label="Price ($)" type="number" placeholder="500" />
        <Input label="Duration (Days)" type="text" placeholder="5 Days" />
        <Input label="Max Capacity" type="number" placeholder="20" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32"></textarea>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Submit for Approval</Button>
      </div>
    </form>
  </Card>
);
