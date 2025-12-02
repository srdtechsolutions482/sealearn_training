import React from 'react';
import { User } from '../../types';
import { Card, Button, Input } from '../common/UI';
import { UserCircle, MapPin, Phone, Mail, Award, Calendar, Anchor } from 'lucide-react';

export const SeafarerProfile = ({ user }: { user: User }) => {
  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
        <div className="relative pt-16 px-4 flex flex-col md:flex-row items-end md:items-center gap-6">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
          />
          <div className="flex-1 pb-2">
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-blue-600 font-medium flex items-center gap-2">
               <Anchor size={18} /> {user.details?.rank || 'Seafarer'}
            </p>
          </div>
          <div className="flex gap-3 pb-2">
            <Button variant="outline">Edit Profile</Button>
            <Button>Upload Resume</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <UserCircle className="text-blue-500" /> Personal Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-gray-400" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-gray-400" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span className="text-sm">{user.address}</span>
              </div>
              <hr className="border-gray-100" />
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Nationality</span>
                <p className="font-medium">{user.details?.nationality}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Date of Birth</span>
                <p className="font-medium">{user.details?.dob}</p>
              </div>
            </div>
          </Card>

          <Card>
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="text-blue-500" /> Availability
            </h3>
            <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 text-center">
                <p className="text-sm">Next Available</p>
                <p className="text-xl font-bold">{user.details?.nextAvailability}</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Professional Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Award className="text-blue-500" /> Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">CDC Number</span>
                    <p className="text-lg font-bold text-gray-800">{user.details?.cdcNumber}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm text-gray-500">Total Experience</span>
                    <p className="text-lg font-bold text-gray-800">{user.details?.experience}</p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Vessel Experience</label>
                <div className="flex flex-wrap gap-2">
                    {user.details?.vesselTypes?.map((type: string) => (
                        <span key={type} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Documents & Certifications</label>
                <div className="space-y-3">
                    {['STCW 95 Basic Safety', 'Medical Fitness Certificate', 'Passport', 'Seaman Book'].map((doc) => (
                        <div key={doc} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded text-red-500 flex items-center justify-center text-xs font-bold">PDF</div>
                                <span className="text-sm font-medium">{doc}</span>
                            </div>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Verified</span>
                        </div>
                    ))}
                </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};