
import React from 'react';
import { User, UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Anchor, 
  Building2, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react';

// --- UI Primitives ---

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | (() => void);
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  type = "button"
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-teal-500 text-white hover:bg-teal-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  return (
    <button type={type} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Input = ({ label, type = "text", placeholder, value, onChange }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      type={type} 
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

// --- Layouts ---

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  currentView: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user, onLogout, onNavigate, currentView }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  // Define menu items based on role
  const getMenuItems = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', view: 'admin-dashboard' },
          { icon: Building2, label: 'Vendor Mgmt', view: 'admin-vendors' },
          { icon: BookOpen, label: 'Course Mgmt', view: 'admin-courses' },
          { icon: Users, label: 'User Mgmt', view: 'admin-users' },
          { icon: Settings, label: 'Settings', view: 'settings' },
        ];
      case UserRole.VENDOR:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', view: 'vendor-dashboard' },
          { icon: Building2, label: 'Institute Reg', view: 'vendor-institute' },
          { icon: BookOpen, label: 'Manage Courses', view: 'vendor-courses' },
          { icon: Users, label: 'Enrolled Seafarers', view: 'vendor-students' },
          { icon: Settings, label: 'Profile & Settings', view: 'settings' },
        ];
      case UserRole.SEAFARER:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', view: 'seafarer-dashboard' },
          { icon: BookOpen, label: 'Browse Courses', view: 'seafarer-courses' },
          { icon: GraduationCap, label: 'My Learning', view: 'seafarer-my-courses' },
          { icon: UserCircle, label: 'My Profile', view: 'seafarer-profile' },
          { icon: Settings, label: 'Settings', view: 'settings' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <Anchor className="text-teal-400" size={24} />
            <span className="font-bold text-lg">SeaLearn</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {getMenuItems().map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                currentView === item.view ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
            <img 
              src={user.avatarUrl || `https://picsum.photos/seed/${user.name}/40/40`} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-teal-400"
            />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-slate-800 ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
