import React from "react";
import { User, UserRole } from "../../types";
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
  UserCircle,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  currentView: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  user,
  onLogout,
  onNavigate,
  currentView,
}) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  // Define menu items based on role
  const getMenuItems = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            view: "admin-dashboard",
          },
          {
            icon: Building2,
            label: "Institute Approval",
            view: "admin-institute-approval",
          },
          {
            icon: Building2,
            label: "Institute Management",
            view: "admin-vendors",
          },
          { icon: BookOpen, label: "Course Management", view: "admin-courses" },
          { icon: Users, label: "Seafarer Management", view: "admin-users" },
          { icon: Settings, label: "Settings", view: "settings" },
        ];
      case UserRole.VENDOR:
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            view: "vendor-dashboard",
          },
          { icon: BookOpen, label: "Manage Courses", view: "vendor-courses" },
          { icon: Users, label: "Enrolled Seafarers", view: "vendor-students" },
          { icon: Settings, label: "Profile & Settings", view: "settings" },
        ];
      case UserRole.SEAFARER:
        return [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            view: "seafarer-dashboard",
          },
          { icon: BookOpen, label: "Browse Courses", view: "seafarer-courses" },
          {
            icon: GraduationCap,
            label: "My Learning",
            view: "seafarer-my-courses",
          },
          { icon: UserCircle, label: "My Profile", view: "seafarer-profile" },
          { icon: Settings, label: "Settings", view: "settings" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-theme-sidebar text-white transition-all duration-300 flex flex-col shadow-2xl z-20`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div
            className={`flex items-center gap-3 ${!isSidebarOpen && "hidden"}`}
          >
            <Anchor className="text-theme-primary" size={24} />
            <span className="font-bold text-lg">SeaLearn</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-white/10 rounded text-theme-sidebar-text hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {getMenuItems().map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                currentView === item.view
                  ? "bg-theme-primary text-white shadow-lg shadow-theme-primary/30"
                  : "text-theme-sidebar-text hover:bg-theme-sidebar-hover hover:text-white"
              }`}
            >
              <item.icon
                size={20}
                className={currentView === item.view ? "text-white" : ""}
              />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div
            className={`flex items-center gap-3 mb-4 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <img
              src={
                user.avatarUrl ||
                `https://picsum.photos/seed/${user.name}/40/40`
              }
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-theme-ring p-0.5"
            />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate text-white">
                  {user.name}
                </p>
                <p className="text-xs text-theme-sidebar-text truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
