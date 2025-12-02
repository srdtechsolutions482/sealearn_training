
import React from 'react';
import { Card, Button } from '../common/UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ADMIN_STATS_DATA, MOCK_COURSES, MOCK_VENDORS } from '../../constants';
import { CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboard = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '2,453', color: 'bg-blue-500' },
          { label: 'Total Vendors', value: '48', color: 'bg-teal-500' },
          { label: 'Total Courses', value: '342', color: 'bg-indigo-500' },
          { label: 'Pending Vendors', value: '3', color: 'bg-amber-500' }
        ].map((stat, idx) => (
          <Card key={idx} className="flex items-center p-4">
             <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white font-bold mr-4`}>
                {stat.label.charAt(0)}
             </div>
             <div>
               <p className="text-gray-500 text-sm">{stat.label}</p>
               <h3 className="text-2xl font-bold">{stat.value}</h3>
             </div>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="h-96">
        <h3 className="font-bold mb-4">Platform Growth</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ADMIN_STATS_DATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Users" fill="#3B82F6" />
            <Bar dataKey="Vendors" fill="#14B8A6" />
            <Bar dataKey="Courses" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Vendors */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Pending Vendor Approvals</h3>
            <Button 
                variant="outline" 
                className="text-xs px-2 py-1"
                onClick={() => onNavigate('admin-vendors')}
            >
                View All
            </Button>
          </div>
          <div className="space-y-3">
            {MOCK_VENDORS.filter(v => v.status === 'pending').map(vendor => (
              <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-medium">{vendor.companyName}</span>
                <div className="flex gap-2">
                  <button className="text-green-500 hover:text-green-600"><CheckCircle size={20} /></button>
                  <button className="text-red-500 hover:text-red-600"><XCircle size={20} /></button>
                </div>
              </div>
            ))}
            {MOCK_VENDORS.filter(v => v.status === 'pending').length === 0 && <p className="text-gray-500 text-sm">No pending vendors.</p>}
          </div>
        </Card>

        {/* Top Courses */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Top Performing Courses</h3>
          </div>
          <div className="space-y-3">
             {MOCK_COURSES.slice(0, 3).map((course, idx) => (
               <div key={course.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                   <span className="text-sm font-medium">{course.title}</span>
                 </div>
                 <span className="text-xs text-gray-500">{course.enrolled} students</span>
               </div>
             ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
