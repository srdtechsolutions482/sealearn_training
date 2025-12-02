
import React, { useState } from 'react';
import { User, UserRole, ViewState } from './types';
import { MOCK_USERS } from './constants';
import { DashboardLayout } from './components/common/Layout';
import { PublicHeader } from './components/public/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/Home';
import { LoginPage } from './components/public/Login';
import { RegisterPage } from './components/public/Register';
import { ContactPage } from './components/public/Contact';

// Admin Imports
import { AdminDashboard } from './components/admin/Dashboard';
import { AdminVendorList } from './components/admin/VendorList';
import { AdminCourseList } from './components/admin/CourseList';
import { AdminUserList } from './components/admin/UserList';
import { AdminSettings } from './components/admin/Settings';

// Vendor Imports
import { VendorDashboard } from './components/vendor/Dashboard';
import { VendorAddCourse } from './components/vendor/AddCourse';
import { VendorCourseManagement } from './components/vendor/CourseManagement';
import { VendorInstituteRegistration } from './components/vendor/InstituteRegistration';
import { VendorStudentList } from './components/vendor/StudentList';
import { VendorProfileSettings } from './components/vendor/ProfileSettings';

// Seafarer Imports
import { SeafarerDashboard } from './components/seafarer/Dashboard';
import { SeafarerBrowseCourses } from './components/seafarer/BrowseCourses';
import { SeafarerMyLearning } from './components/seafarer/MyLearning';
import { SeafarerProfile } from './components/seafarer/Profile';

const App = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [theme, setTheme] = useState('blue');

  // Navigation Handler
  const navigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Auth Handler
  const handleLogin = (role: UserRole) => {
    // Select the appropriate mock user based on role
    let mockUser: User;
    
    if (role === UserRole.ADMIN) {
        mockUser = MOCK_USERS.admin;
    } else if (role === UserRole.VENDOR) {
        mockUser = MOCK_USERS.vendor;
    } else {
        mockUser = MOCK_USERS.seafarer;
    }
    
    setCurrentUser(mockUser);
    
    // Redirect to appropriate dashboard
    if (role === UserRole.ADMIN) navigate('admin-dashboard');
    else if (role === UserRole.VENDOR) navigate('vendor-dashboard');
    else navigate('seafarer-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('home');
  };

  // View Routing Logic
  const renderView = () => {
    // Public Views
    if (!currentUser) {
      return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader onNavigate={navigate} />
            <main className="flex-grow">
                {(() => {
                    switch (currentView) {
                        case 'home': return <HomePage onNavigate={navigate} />;
                        case 'login': return <LoginPage onLogin={handleLogin} />;
                        case 'register': return <RegisterPage />;
                        case 'contact': return <ContactPage />;
                        case 'institutions': return <div className="p-8 text-center text-2xl text-gray-400">Institutions List Public Page (Same as search)</div>;
                        case 'about': return <div className="p-8 text-center text-2xl text-gray-400">About Us Content</div>;
                        default: return <HomePage onNavigate={navigate} />;
                    }
                })()}
            </main>
            <Footer />
        </div>
      );
    }

    // Protected Views Wrapper
    return (
      <DashboardLayout user={currentUser} onLogout={handleLogout} onNavigate={navigate} currentView={currentView}>
        {renderProtectedContent()}
      </DashboardLayout>
    );
  };

  const renderProtectedContent = () => {
    switch (currentView) {
      // Admin Views
      case 'admin-dashboard': return <AdminDashboard onNavigate={navigate} />;
      case 'admin-vendors': return <AdminVendorList />;
      case 'admin-courses': return <AdminCourseList />;
      case 'admin-users': return <AdminUserList />;
      
      // Vendor Views
      case 'vendor-dashboard': return <VendorDashboard />;
      case 'vendor-courses': return <VendorCourseManagement onAddNew={() => navigate('vendor-add-course')} />;
      case 'vendor-add-course': return <VendorAddCourse />;
      case 'vendor-institute': return <VendorInstituteRegistration user={currentUser} />;
      case 'vendor-students': return <VendorStudentList />;
      
      // Seafarer Views
      case 'seafarer-dashboard': return <SeafarerDashboard />;
      case 'seafarer-courses': return <SeafarerBrowseCourses />;
      case 'seafarer-my-courses': return <SeafarerMyLearning />;
      case 'seafarer-profile': return currentUser ? <SeafarerProfile user={currentUser} /> : null;
      
      // Shared / Settings
      case 'settings': 
        if (currentUser?.role === UserRole.ADMIN) {
            return (
                <AdminSettings 
                    user={currentUser} 
                    currentTheme={theme} 
                    onThemeChange={setTheme} 
                />
            );
        }
        if (currentUser?.role === UserRole.VENDOR) {
            return (
                <VendorProfileSettings 
                    user={currentUser} 
                    currentTheme={theme} 
                    onThemeChange={setTheme} 
                />
            );
        }
        return <div className="text-center p-12 text-gray-500">Seafarer Settings (Coming Soon)</div>;
      
      default: return <div className="text-center p-12 text-red-500">Page not found: {currentView}</div>;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans theme-${theme}`}>
      {renderView()}
    </div>
  );
};

export default App;
