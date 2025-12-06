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
  status: "active" | "Inactive"; // Added for account management
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
  status: "active" | "pending" | "closed" | "suspended";

  instituteName?: string;
  startDate?: string;
  endDate?: string;
  enrolmentCount: number;
  location?: string;
  isOnline: boolean;
  availableSeats: number;
  bookedSeats: number;
  totalSeats: number;
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
  image: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  status: "approved" | "pending" | "rejected" | "suspended";
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
  verifiedBy?: string;
  createdAt?: string;
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

export interface ApprovalAction {
  instituteId: string;
  action: "approve" | "reject" | "suspend";
  comments: string;
  selectedCourses: string[];
}

export type ViewState =
  | "home"
  | "about"
  | "institutions"
  | "contact"
  | "login"
  | "register"
  | "settings"
  | "instituteregistration"
  // Admin Views
  | "admin-dashboard"
  | "admin-institute-approval"
  | "admin-vendors"
  | "admin-courses"
  | "admin-users"
  // Vendor Views
  | "vendor-dashboard"
  | "vendor-courses"
  | "vendor-add-course"
  | "vendor-students"
  // Seafarer Views
  | "seafarer-dashboard"
  | "seafarer-courses"
  | "seafarer-my-courses"
  | "seafarer-profile";
