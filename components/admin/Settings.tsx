
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Card, Button, Input } from '../common/UI';
import { Save, Shield, Mail, Phone, MapPin, Palette, Check } from 'lucide-react';

interface AdminSettingsProps {
    user: User;
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

export const AdminSettings = ({ user, currentTheme, onThemeChange }: AdminSettingsProps) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || ''
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        // Mock API call
        console.log("Saving admin profile:", formData);
        setIsEditing(false);
        alert("Profile settings updated successfully.");
    };

    const themes = [
        { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-600', ring: 'ring-blue-400' },
        { id: 'teal', name: 'Teal Waters', color: 'bg-teal-600', ring: 'ring-teal-400' },
        { id: 'violet', name: 'Deep Purple', color: 'bg-violet-600', ring: 'ring-violet-400' },
        { id: 'amber', name: 'Sunset Amber', color: 'bg-amber-500', ring: 'ring-amber-400' }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Theme & Appearance */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Palette size={20} className="text-theme-primary" /> Appearance
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Customize the dashboard color theme.</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => onThemeChange(t.id)}
                                    className={`relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                                        currentTheme === t.id 
                                            ? `border-theme-primary bg-theme-soft ${t.ring}` 
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full ${t.color} shadow-sm flex items-center justify-center text-white`}>
                                        {currentTheme === t.id && <Check size={16} strokeWidth={3} />}
                                    </div>
                                    <span className={`text-xs font-medium ${currentTheme === t.id ? 'text-theme-text' : 'text-gray-600'}`}>
                                        {t.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                                <Shield size={24} className="text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Admin Access</h3>
                                <p className="text-xs text-slate-400">Super User Privileges</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300">
                            <p className="flex justify-between"><span>Role Level:</span> <span className="text-white font-mono">L1 - Root</span></p>
                            <p className="flex justify-between"><span>Last Login:</span> <span className="text-white font-mono">{user.details?.lastLogin?.split(' ')[0] || 'Today'}</span></p>
                            <p className="flex justify-between"><span>Session ID:</span> <span className="text-white font-mono">SID-88291</span></p>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Profile Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="font-bold text-lg">Profile Information</h3>
                            <Button 
                                variant={isEditing ? 'outline' : 'primary'}
                                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                                className={!isEditing ? "px-4 py-1.5 h-auto text-sm" : "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"}
                            >
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative">
                                <img 
                                    src={user.avatarUrl} 
                                    alt="Admin" 
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md"
                                />
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                                <p className="text-gray-500">{formData.email}</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold uppercase rounded border border-purple-100">
                                    System Administrator
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Full Name"
                                value={formData.name}
                                onChange={(e: any) => setFormData({...formData, name: e.target.value})}
                                disabled={!isEditing}
                            />
                            
                            <Input 
                                label="Email Address"
                                value={formData.email}
                                disabled={true} // Email usually immutable
                            />

                            <div className="relative">
                                <Phone size={18} className="absolute left-0 top-9 text-gray-400 z-10 hidden" /> {/* Placeholder for icon integration if needed in Input component */}
                                <Input 
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
                                    disabled={!isEditing}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>

                            <Input 
                                label="Office Location"
                                value={formData.address}
                                onChange={(e: any) => setFormData({...formData, address: e.target.value})}
                                disabled={!isEditing}
                                placeholder="Headquarters"
                            />
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex justify-end pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                <Button onClick={handleSave} className="flex items-center gap-2">
                                    <Save size={18} /> Save Changes
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
