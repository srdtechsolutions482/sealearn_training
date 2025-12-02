
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Card, Button, Input } from '../common/UI';
import { Camera, Save, X, AlertCircle } from 'lucide-react';

interface Props {
    user: User;
    currentTheme: string;
    onThemeChange: (theme: string) => void;
}

export const VendorProfileSettings: React.FC<Props> = ({ user, currentTheme, onThemeChange }) => {
    // Split name
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    // Other fields
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    
    // Edit Mode
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            const names = user.name.split(' ');
            setFirstName(names[0] || '');
            setLastName(names.slice(1).join(' ') || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setWebsite(user.details?.website || '');
            setAvatarPreview(user.avatarUrl || '');
        }
    }, [user]);

    const handleSave = () => {
        // Mock save logic
        alert("Profile updated successfully!");
        setIsEditing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Profile & Settings</h1>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}><X size={18}/> Cancel</Button>
                            <Button onClick={handleSave}><Save size={18}/> Save Changes</Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col: Avatar & Theme */}
                <div className="space-y-6">
                    <Card className="flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${isEditing ? 'border-theme-primary/30' : 'border-gray-100'} shadow-md`}>
                                <img 
                                    src={avatarPreview || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium text-sm">
                                    <Camera size={24} className="mb-1" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange}/>
                                </label>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{firstName} {lastName}</h2>
                        <p className="text-gray-500 text-sm font-medium">{user.role.toUpperCase()}</p>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-gray-800 mb-4">Theme Preference</h3>
                        <div className="flex gap-4 justify-center">
                            {[
                                { name: 'blue', color: 'bg-blue-600' },
                                { name: 'teal', color: 'bg-teal-600' },
                                { name: 'violet', color: 'bg-violet-600' },
                                { name: 'amber', color: 'bg-amber-500' }
                            ].map(theme => (
                                <button
                                    key={theme.name}
                                    onClick={() => onThemeChange(theme.name)}
                                    className={`w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all ${currentTheme === theme.name ? 'ring-gray-400 scale-110' : 'ring-transparent'}`}
                                >
                                    <div className={`w-full h-full rounded-full ${theme.color}`}></div>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-3">Select your dashboard accent color</p>
                    </Card>
                </div>

                {/* Right Col: Details Form */}
                <div className="md:col-span-2">
                    <Card>
                        <h3 className="font-bold text-lg mb-6 border-b border-gray-100 pb-4">Account Details</h3>
                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="First Name" 
                                    value={firstName} 
                                    onChange={(e: any) => setFirstName(e.target.value)}
                                    disabled={!isEditing}
                                />
                                <Input 
                                    label="Last Name" 
                                    value={lastName} 
                                    onChange={(e: any) => setLastName(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            
                            <Input 
                                label="Email Address" 
                                value={user.email} 
                                disabled={true} 
                            />
                            <div className="mb-4 -mt-3">
                                <p className="text-xs text-amber-600 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                    <AlertCircle size={14}/> Email cannot be changed. Contact support for assistance.
                                </p>
                            </div>

                            <Input 
                                label="Phone Number" 
                                value={phone} 
                                onChange={(e: any) => setPhone(e.target.value)}
                                disabled={!isEditing}
                            />

                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                                <textarea 
                                    className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-theme-ring transition-all ${!isEditing && 'opacity-60 cursor-not-allowed hover:bg-slate-50'}`}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                />
                            </div>

                            <Input 
                                label="Website / Portfolio" 
                                value={website} 
                                onChange={(e: any) => setWebsite(e.target.value)}
                                disabled={!isEditing}
                                placeholder="https://"
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
