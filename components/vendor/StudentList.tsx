import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { Button } from '../common/UI';
import { MOCK_ENROLLMENTS } from '../../constants';
import { Enrollment } from '../../types';
import { Filter, Calendar, BookOpen } from 'lucide-react';

export const VendorStudentList = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCourse, setFilterCourse] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Get unique courses for filter dropdown
    const availableCourses = useMemo(() => 
        Array.from(new Set(MOCK_ENROLLMENTS.map(e => e.courseTitle))), 
    []);

    const filteredData = useMemo(() => {
        return MOCK_ENROLLMENTS.filter(student => {
            const statusMatch = filterStatus === 'all' || student.status === filterStatus;
            const courseMatch = filterCourse === 'all' || student.courseTitle === filterCourse;
            const startMatch = !startDate || student.enrollmentDate >= startDate;
            const endMatch = !endDate || student.enrollmentDate <= endDate;
            return statusMatch && courseMatch && startMatch && endMatch;
        });
    }, [filterStatus, filterCourse, startDate, endDate]);

    const columns: Column<Enrollment>[] = [
        { 
            key: 'studentName', 
            header: 'Seafarer Name', 
            sortable: true, 
            render: (row) => (
                <p className="font-semibold text-gray-900">{row.studentName}</p>
            ) 
        },
        { 
            key: 'courseTitle', 
            header: 'Course Enrolled', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                        <BookOpen size={16} />
                    </div>
                    <span className="font-medium text-gray-700">{row.courseTitle}</span>
                </div>
            )
        },
        { 
            key: 'enrollmentDate', 
            header: 'Booked Date', 
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-1.5 text-gray-600">
                    <Calendar size={14} className="text-gray-400"/>
                    {row.enrollmentDate}
                </div>
            )
        },
        { 
            key: 'status', 
            header: 'Status', 
            sortable: true, 
            render: (row) => {
                const colors = {
                    active: 'bg-blue-100 text-blue-700',
                    completed: 'bg-green-100 text-green-700',
                    cancelled: 'bg-red-100 text-red-700'
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[row.status]}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                );
            }
        }
    ];

    return (
        <DataTable<Enrollment>
            title="Enrolled Seafarers"
            data={filteredData}
            columns={columns}
            searchKeys={['studentName', 'courseTitle']}
            filterOptions={
                <div className="relative">
                    <Button 
                        variant={isFilterOpen ? 'primary' : 'outline'} 
                        className="px-3"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter size={18} />
                    </Button>
                    {isFilterOpen && (
                         <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-sm text-gray-700">Filter Students</h4>
                                <button 
                                    onClick={() => { 
                                        setFilterStatus('all'); 
                                        setFilterCourse('all'); 
                                        setStartDate('');
                                        setEndDate('');
                                    }} 
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Booked Date Range</label>
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
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Enrollment Status</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Course</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                        value={filterCourse}
                                        onChange={(e) => setFilterCourse(e.target.value)}
                                    >
                                        <option value="all">All Courses</option>
                                        {availableCourses.map(course => (
                                            <option key={course} value={course}>{course}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
            }
        />
    );
};