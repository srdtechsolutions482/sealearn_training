import React, { useState, useMemo } from "react";
import { DataTable, Column } from "../common/DataTable";
import { Button, Modal } from "../common/UI";
import { MOCK_ENROLLMENTS } from "../../constants";
import { Enrollment } from "../../types";
import {
  Filter,
  Calendar,
  BookOpen,
  Eye,
  SquarePen,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export const VendorStudentList = () => {
  // Data State
  const [enrollments, setEnrollments] = useState<Enrollment[]>(
    MOCK_ENROLLMENTS as Enrollment[]
  );

  // Filter State
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);
  const [editForm, setEditForm] = useState<{
    status: string;
    certificate: File | null;
    certificateName: string;
  }>({ status: "", certificate: null, certificateName: "" });

  // Get unique courses for filter dropdown
  const availableCourses = useMemo(
    () => Array.from(new Set(enrollments.map((e) => String(e.courseTitle)))),
    [enrollments]
  );

  const filteredData = useMemo(() => {
    return enrollments.filter((student) => {
      const statusMatch =
        filterStatus === "all" || student.status === filterStatus;
      const courseMatch =
        filterCourse === "all" || student.courseTitle === filterCourse;
      const startMatch = !startDate || student.enrollmentDate >= startDate;
      const endMatch = !endDate || student.enrollmentDate <= endDate;
      return statusMatch && courseMatch && startMatch && endMatch;
    });
  }, [enrollments, filterStatus, filterCourse, startDate, endDate]);

  // Handlers
  const handleView = (row: Enrollment) => {
    setSelectedEnrollment(row);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (row: Enrollment) => {
    setSelectedEnrollment(row);
    setEditForm({
      status: row.status,
      certificate: null,
      certificateName: row.certificate || "",
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedEnrollment) return;

    setEnrollments((prev) =>
      prev.map((item) => {
        if (item === selectedEnrollment) {
          return {
            ...item,
            status: editForm.status,
            // If a new file is uploaded, mock saving it by storing the name
            certificate: editForm.certificate
              ? editForm.certificate.name
              : editForm.certificateName,
          };
        }
        return item;
      })
    );

    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditForm((prev) => ({
        ...prev,
        certificate: e.target.files![0],
        certificateName: e.target.files![0].name,
      }));
    }
  };

  const columns: Column<Enrollment>[] = [
    {
      key: "studentName",
      header: "Seafarer Name",
      sortable: true,
      render: (row) => (
        <p className="font-semibold text-gray-900">{row.studentName}</p>
      ),
    },
    {
      key: "courseTitle",
      header: "Course Enrolled",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
            <BookOpen size={16} />
          </div>
          <span className="font-medium text-gray-700">{row.courseTitle}</span>
        </div>
      ),
    },
    {
      key: "enrollmentDate",
      header: "Booked Date",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar size={14} className="text-gray-400" />
          {row.enrollmentDate}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        const colors: Record<string, string> = {
          active: "bg-blue-100 text-blue-700",
          inprogress: "bg-blue-100 text-blue-700",
          completed: "bg-green-100 text-green-700",
          cancelled: "bg-red-100 text-red-700",
          deleted: "bg-gray-100 text-gray-700",
        };

        let label = row.status;
        if (row.status === "inprogress" || row.status === "active") {
          label = "In Progress";
        } else {
          label = row.status.charAt(0).toUpperCase() + row.status.slice(1);
        }

        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              colors[row.status] || colors.active
            }`}
          >
            {label}
          </span>
        );
      },
    },
    {
      key: "actions" as keyof Enrollment, // Casting for custom column
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
            title="Edit Enrollment"
          >
            <SquarePen size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable<Enrollment>
        title="Enrolled Seafarers"
        data={filteredData}
        columns={columns}
        searchKeys={["studentName", "courseTitle"]}
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
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-sm text-gray-700">
                    Filter Students
                  </h4>
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterCourse("all");
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Booked Date Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50 text-gray-600"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="date"
                        className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50 text-gray-600"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Enrollment Status
                    </label>
                    <select
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="inprogress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="deleted">Deleted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Course
                    </label>
                    <select
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                    >
                      <option value="all">All Courses</option>
                      {availableCourses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />

      {/* View/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "view" ? "Enrollment Details" : "Edit Enrollment"}
      >
        {selectedEnrollment && (
          <div className="space-y-6">
            {/* Student Info Card (Read Only) */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {selectedEnrollment.studentName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Student ID: #ST-{selectedEnrollment.studentName.length}928
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Booked On
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedEnrollment.enrollmentDate}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Course
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedEnrollment.courseTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enrollment Status
                </label>
                {modalMode === "view" ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                        selectedEnrollment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedEnrollment.status.charAt(0).toUpperCase() +
                        selectedEnrollment.status.slice(1)}
                    </span>
                  </div>
                ) : (
                  <select
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="deleted">Deleted</option>
                  </select>
                )}
              </div>

              {/* Certification Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certification
                </label>
                {modalMode === "view" ? (
                  selectedEnrollment.certificate ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl text-green-700">
                      <FileText size={20} />
                      <span className="font-medium text-sm flex-1 truncate">
                        {selectedEnrollment.certificate}
                      </span>
                      <Button
                        variant="outline"
                        className="h-8 px-3 text-xs bg-white"
                      >
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center text-gray-400 text-sm">
                      No certificate uploaded
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.png"
                      />
                      <Upload className="text-gray-400 mb-2" size={24} />
                      <p className="text-sm font-medium text-gray-600">
                        {editForm.certificate
                          ? editForm.certificate.name
                          : editForm.certificateName ||
                            "Click to upload certificate"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, JPG or PNG (Max 5MB)
                      </p>
                    </div>
                    {editForm.status === "completed" &&
                      !editForm.certificate &&
                      !editForm.certificateName && (
                        <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 p-2 rounded-lg">
                          <AlertTriangle size={14} />
                          <span>
                            Note: Certificates are typically required when
                            marking as Completed.
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                {modalMode === "view" ? "Close" : "Cancel"}
              </Button>
              {modalMode === "edit" && (
                <Button onClick={handleSaveChanges}>
                  <CheckCircle size={18} /> Save Changes
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
