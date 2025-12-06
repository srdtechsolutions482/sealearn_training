import React, { useState, useEffect } from "react";
import { User, UserRole, ViewState } from "./types";
import { MOCK_USERS } from "./constants";
import { DashboardLayout } from "./components/common/Layout";
import { PublicHeader } from "./components/public/Header";
import { Footer } from "./components/common/Footer";
import { HomePage } from "./components/public/Home";
import { LoginPage } from "./components/public/Login";
import { RegisterPage } from "./components/public/Register";
import { ContactPage } from "./components/public/Contact";
import { VendorInstituteRegistration } from "./components/public/InstituteRegistration";

// Admin Imports
import { AdminDashboard } from "./components/admin/Dashboard";
import { AdminVendorList } from "./components/admin/VendorList";
import { AdminCourseList } from "./components/admin/CourseList";
import { AdminUserList } from "./components/admin/UserList";
import { AdminSettings } from "./components/admin/Settings";
import { AdminInstituteApproval } from "./components/admin/AdminInstituteApproval";

// Vendor Imports
import { VendorDashboard } from "./components/vendor/Dashboard";
import { VendorAddCourse } from "./components/vendor/AddCourse";
import { VendorCourseManagement } from "./components/vendor/CourseManagement";
import { VendorStudentList } from "./components/vendor/StudentList";
import { VendorProfileSettings } from "./components/vendor/ProfileSettings";

// Seafarer Imports
import { SeafarerDashboard } from "./components/seafarer/Dashboard";
import { SeafarerBrowseCourses } from "./components/seafarer/BrowseCourses";
import { SeafarerMyLearning } from "./components/seafarer/MyLearning";
import { SeafarerProfile } from "./components/seafarer/Profile";
import { Anchor } from "lucide-react";

const App = () => {
  // 1. Initial State Logic: Hash > LocalStorage > Default
  const getInitialView = (): ViewState => {
    // Check hash first for deep linking
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (hash) return hash as ViewState;

    // Only persist/restore view for authenticated users
    // For guests, always default to home on root URL to avoid getting stuck on specific pages
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        const savedView = localStorage.getItem("currentView");
        if (savedView) return savedView as ViewState;
      }
    } catch (e) {}

    return "home";
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView);
  // Application State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [theme, setTheme] = useState("blue");
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "");
      if (hash) {
        setCurrentView(hash as ViewState);
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Persistence Effects
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentView) {
      localStorage.setItem("currentView", currentView);
    }
  }, [currentView]);

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
    if (role === UserRole.ADMIN) navigate("admin-dashboard");
    else if (role === UserRole.VENDOR) navigate("vendor-dashboard");
    else navigate("seafarer-dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("home");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentView");
  };

  // View Routing Logic
  const renderView = () => {
    // 1. Standalone Pages (No PublicHeader)
    if (!currentUser && currentView === "instituteregistration") {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Dedicated Minimal Header for Registration */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("home")}
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Anchor size={24} />
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight">
                SeaLearn
              </span>
            </div>

            <button
              onClick={() => navigate("login")}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Already have an account? Login
            </button>
          </header>

          <main className="flex-grow p-6 md:p-12">
            <VendorInstituteRegistration onCancel={() => navigate("home")} />
          </main>

          <Footer />
        </div>
      );
    }

    // Public Views
    if (!currentUser) {
      return (
        <div className="flex flex-col min-h-screen">
          <PublicHeader onNavigate={navigate} />
          <main className="flex-grow">
            {(() => {
              switch (currentView) {
                case "home":
                  return <HomePage onNavigate={navigate} />;
                case "login":
                  return <LoginPage onLogin={handleLogin} />;
                case "register":
                  return <RegisterPage />;
                case "contact":
                  return <ContactPage />;
                case "institutions":
                  return (
                    <div className="p-8 text-center text-2xl text-gray-400">
                      Institutions List Public Page (Same as search)
                    </div>
                  );
                case "about":
                  return (
                    <div className="p-8 text-center text-2xl text-gray-400">
                      About Us Content
                    </div>
                  );
                default:
                  return <HomePage onNavigate={navigate} />;
              }
            })()}
          </main>
          <Footer />
        </div>
      );
    }

    // Protected Views Wrapper
    return (
      <DashboardLayout
        user={currentUser}
        onLogout={handleLogout}
        onNavigate={navigate}
        currentView={currentView}
      >
        {renderProtectedContent()}
      </DashboardLayout>
    );
  };

  const renderProtectedContent = () => {
    switch (currentView) {
      // Admin Views
      case "admin-dashboard":
        return <AdminDashboard onNavigate={navigate} />;
      case "admin-vendors":
        return <AdminVendorList />;
      case "admin-institute-approval":
        return <AdminInstituteApproval />;
      case "admin-courses":
        return <AdminCourseList onNavigate={navigate}/>;
      case "admin-users":
        return <AdminUserList />;

      // Vendor Views
      case "vendor-dashboard":
        return <VendorDashboard />;
      case "vendor-courses":
        return (
          <VendorCourseManagement
            onAddNew={() => navigate("vendor-add-course")}
          />
        );
      case "vendor-add-course":
        return <VendorAddCourse />;

      case "vendor-students":
        return <VendorStudentList />;

      // Seafarer Views
      case "seafarer-dashboard":
        return <SeafarerDashboard />;
      case "seafarer-courses":
        return <SeafarerBrowseCourses />;
      case "seafarer-my-courses":
        return <SeafarerMyLearning />;
      case "seafarer-profile":
        return currentUser ? <SeafarerProfile user={currentUser} /> : null;

      // Shared / Settings
      case "settings":
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
        return (
          <div className="text-center p-12 text-gray-500">
            Seafarer Settings (Coming Soon)
          </div>
        );

      default:
        return (
          <div className="text-center p-12 text-red-500">
            Page not found: {currentView}
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 font-sans theme-${theme}`}
    >
      {renderView()}
    </div>
  );
};

export default App;
