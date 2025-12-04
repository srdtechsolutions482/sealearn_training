import React, { useState, useMemo } from "react";
import { Button } from "../common/UI";
import { DataTable, Column } from "../common/DataTable";
import { VendorCourseForm } from "./AddCourse";
import { MOCK_COURSES } from "../../constants";
import { Course } from "../../types";
import { Eye, Edit, Filter } from "lucide-react";

export const VendorCourseManagement = ({
  onAddNew,
}: {
  onAddNew: () => void;
}) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [viewState, setViewState] = useState<"list" | "edit" | "view">("list");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");

  // Filter Logic
  const displayCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesStatus =
        filterStatus === "all" || course.status === filterStatus;
      const matchesMode = filterMode === "all" || course.mode === filterMode;
      return matchesStatus && matchesMode;
    });
  }, [courses, filterStatus, filterMode]);

  const handleView = (course: Course) => {
    setSelectedCourse(course);
    setViewState("view");
    window.scrollTo(0, 0);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setViewState("edit");
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setViewState("list");
    setSelectedCourse(null);
  };

  // Mock save function
  const handleSave = (data: any) => {
    // In a real app, you would transform the form data back to the Course type and update the state/API
    console.log("Saving course data:", data);
    setViewState("list");
    setSelectedCourse(null);
  };

  const columns: Column<Course>[] = [
    {
      key: "title",
      header: "Course Name",
      sortable: true,
      render: (c) => (
        <span className="font-semibold text-gray-900">{c.title}</span>
      ),
    },
    {
      key: "code",
      header: "Course Code",
      sortable: true,
      render: (c) => (
        <span className="font-mono text-xs text-gray-600">{c.code}</span>
      ),
    },
    { key: "courseType", header: "Course Type", sortable: true },
    {
      key: "mode",
      header: "Mode",
      sortable: true,
      render: (c) => (
        <span
          className={`px-2 py-1 rounded border text-xs ${
            c.mode === "Online"
              ? "bg-purple-50 text-purple-700 border-purple-100"
              : c.mode === "Offline"
              ? "bg-orange-50 text-orange-700 border-orange-100"
              : "bg-blue-50 text-blue-700 border-blue-100"
          }`}
        >
          {c.mode}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (c) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            c.status === "approved"
              ? "bg-green-100 text-green-800"
              : c.status === "pending"
              ? "bg-amber-100 text-amber-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              c.status === "approved"
                ? "bg-green-500"
                : c.status === "pending"
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          ></span>
          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
        </span>
      ),
    },
    {
      key: "enrolled",
      header: "Enrolled Seafarer",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(c.enrolled, 100)}%` }}
            ></div>
          </div>
          <span className="font-mono">{c.enrolled}</span>
        </div>
      ),
    },
  ];

  if (viewState === "edit" || viewState === "view") {
    return (
      <VendorCourseForm
        initialData={selectedCourse}
        mode={viewState}
        onBack={handleBack}
        onSubmit={handleSave}
      />
    );
  }

  return (
    <>
      <DataTable<Course>
        title="Course Management"
        data={displayCourses}
        columns={columns}
        searchKeys={["title", "code"]}
        onAdd={onAddNew}
        addLabel="Add Course"
        filterOptions={
          <div className="relative">
            <Button
              variant={isFilterOpen ? "primary" : "outline"}
              className="px-3"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
            </Button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-sm text-gray-700">Filter</h4>
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterMode("all");
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Mode
                    </label>
                    <select
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                      value={filterMode}
                      onChange={(e) => setFilterMode(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        actions={(course) => (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleView(course)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => handleEdit(course)}
              className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit Course"
            >
              <Edit size={18} />
            </button>
          </div>
        )}
      />
    </>
  );
};
