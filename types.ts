export enum UserRole {
  GUEST = "guest",
  ADMIN = "admin",
  VENDOR = "vendor",
  SEAFARER = "seafarer",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "disabled"; // Added for account management
  password?: string; // Added for mock auth validation
  avatarUrl?: string;
  phone?: string;
  address?: string;
  details?: Record<string, any>; // Flexible bucket for role-specific attributes
}

export interface CourseMaster {
  id: string;
  title: string;
  category: string; // Basic, Advanced, Simulator
  targetAudience: string;

  // New Requested Fields
  entryRequirements?: string;
  courseOverview?: string;
  additionalNotes?: string;

  // Legacy/System fields
  code?: string;
  status: "active" | "archived";
}

export interface Course {
  id: string;
  title: string;
  code: string;
  courseType: string;
  mode: "Online" | "Offline" | "Hybrid";
  vendorName: string;
  price: number;
  duration: string;
  status: "approved" | "pending" | "rejected" | "suspended";
  enrolled: number;
  rating: number;
  category: string;
  // New fields from provided data
  validity?: string;
  targetAudience?: string;
  entryRequirements?: string;
  courseOverview?: string;
  additionalNotes?: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  status: "active" | "pending" | "rejected";
  totalCourses: number;
  // Expanded fields for detail view
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  accreditation?: string;
  foundedYear?: string;
  contactPerson?: string;
  description?: string;

  // Institute Specifics
  licenseNumber?: string;
  issuingAuthority?: string;
  customerCareEmail?: string;
  customerCarePhone?: string;
  coursesOffered?: string[];
  documents?: { name: string; type: string; date: string }[];
}

export interface Enrollment {
  id: string;
  studentName: string;
  courseTitle: string;
  enrollmentDate: string;
  status: "active" | "completed" | "cancelled";
  email: string;
  phone: string;
  progress: number;
}

export type ViewState =
  | "home"
  | "about"
  | "institutions"
  | "contact"
  | "login"
  | "register"
  | "settings"
  // Admin Views
  | "admin-dashboard"
  | "admin-vendors"
  | "admin-courses"
  | "admin-users"
  // Vendor Views
  | "vendor-dashboard"
  | "vendor-courses"
  | "vendor-add-course"
  | "vendor-institute"
  | "vendor-students"
  // Seafarer Views
  | "seafarer-dashboard"
  | "seafarer-courses"
  | "seafarer-my-courses"
  | "seafarer-profile";
