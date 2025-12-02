import React from 'react';
import { User } from '../../types';
import { Card, Button, Input } from '../common/UI';
import { Building2, Globe, Phone, MapPin, Award, CheckCircle } from 'lucide-react';

export const VendorProfile = ({ user }: { user: User }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="h-48 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-6 left-8 flex items-end gap-6">
            <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-28 h-28 rounded-lg border-4 border-white shadow-lg bg-white object-contain p-2"
            />
            <div className="text-white mb-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="opacity-90 flex items-center gap-2"><Award size={16}/> Accredited Institution</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
                <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-teal-500 mt-1" size={18} />
                        <div>
                            <span className="text-xs text-gray-500 block">Address</span>
                            <span className="text-sm font-medium">{user.address}</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="text-teal-500 mt-1" size={18} />
                        <div>
                            <span className="text-xs text-gray-500 block">Phone</span>
                            <span className="text-sm font-medium">{user.phone}</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Globe className="text-teal-500 mt-1" size={18} />
                        <div>
                            <span className="text-xs text-gray-500 block">Website</span>
                            <a href={`https://${user.details?.website}`} className="text-sm font-medium text-blue-600 hover:underline">{user.details?.website}</a>
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card className="bg-teal-50 border-teal-100">
                <h3 className="font-bold text-teal-800 mb-2">Status</h3>
                <div className="flex items-center gap-2 text-green-600 font-bold">
                    <CheckCircle size={20} /> Active & Verified
                </div>
                <p className="text-xs text-teal-600 mt-2">License: {user.details?.licenseNumber}</p>
            </Card>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
             <Card>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Institution Details</h3>
                    <Button variant="outline">Edit Details</Button>
                </div>
                
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">{user.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">{user.details?.founded}</div>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation Body</label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">{user.details?.accreditation}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                        <div className="flex gap-2 flex-wrap">
                            {user.details?.specialization?.map((spec: string) => (
                                <span key={spec} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200 text-sm leading-relaxed">
                            Global Maritime Institute is a premier training facility dedicated to providing world-class maritime education. With over 20 years of experience, we offer a comprehensive range of STCW courses, simulator training, and customized programs for shipping companies worldwide.
                        </div>
                    </div>
                </form>
             </Card>
          </div>
      </div>
    </div>
  );
};