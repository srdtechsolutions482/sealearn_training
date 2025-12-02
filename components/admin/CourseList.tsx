
import React, { useState, useMemo } from 'react';
import { DataTable, Column } from '../common/DataTable';
import { MOCK_COURSE_MASTERS } from '../../constants';
import { CourseMaster } from '../../types';
import { Button, Modal, Input } from '../common/UI';
import { Edit, Eye, Filter, Plus, CheckCircle, XCircle } from 'lucide-react';

// --- Sub-components ---

const CourseMasterForm = ({ initialData, onSave, onCancel }: { initialData?: CourseMaster; onSave: (data: CourseMaster) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState<Partial<CourseMaster>>(initialData || {
        title: '',
        category: 'Basic',
        targetAudience: '',
        entryRequirements: '',
        courseOverview: '',
        additionalNotes: '',
        status: 'active',
        // Code is auto-generated or hidden if not needed, but good to keep in state
        code: ''
    });

    const handleChange = (key: keyof CourseMaster, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
            // Ensure code exists if not provided
            code: formData.code || `CRS-${Math.floor(Math.random() * 1000)}`,
            ...formData
        } as CourseMaster);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label="Course Title" 
                value={formData.title} 
                onChange={(e: any) => handleChange('title', e.target.value)} 
                placeholder="e.g. Advanced Fire Fighting" 
            />
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <select 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                    >
                        <option value="Basic">Basic</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Simulator">Simulator</option>
                        <option value="Refresher">Refresher</option>
                    </select>
                </div>
                <Input 
                    label="Target Audience" 
                    value={formData.targetAudience} 
                    onChange={(e: any) => handleChange('targetAudience', e.target.value)} 
                    placeholder="e.g. Officers, Ratings"
                />
            </div>

            <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-2">Entry Requirements</label>
                 <textarea 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    rows={2}
                    placeholder="e.g. Valid Medical Certificate, CDC..."
                    value={formData.entryRequirements}
                    onChange={(e) => handleChange('entryRequirements', e.target.value)}
                 />
            </div>

            <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-2">Course Overview</label>
                 <textarea 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    rows={3}
                    placeholder="Brief description of the course curriculum..."
                    value={formData.courseOverview}
                    onChange={(e) => handleChange('courseOverview', e.target.value)}
                 />
            </div>

            <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                 <textarea 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    rows={2}
                    placeholder="e.g. Bring safety shoes, passport size photos..."
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                 />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{initialData ? 'Update Template' : 'Create Template'}</Button>
            </div>
        </form>
    );
};


// --- Main Component ---

export const AdminCourseList = () => {
  // Only managing Master Courses now
  const [masters, setMasters] = useState<CourseMaster[]>(MOCK_COURSE_MASTERS);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<CourseMaster | undefined>(undefined);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter Logic
  const filteredMasters = useMemo(() => {
      return masters.filter(master => {
          const categoryMatch = filterCategory === 'all' || master.category === filterCategory;
          const statusMatch = filterStatus === 'all' || master.status === filterStatus;
          return categoryMatch && statusMatch;
      });
  }, [masters, filterCategory, filterStatus]);

  // -- Handlers --

  const handleSaveMaster = (data: CourseMaster) => {
      if (selectedMaster) {
          setMasters(prev => prev.map(m => m.id === data.id ? data : m));
      } else {
          setMasters(prev => [...prev, data]);
      }
      setIsMasterModalOpen(false);
      setSelectedMaster(undefined);
  };

  const handleEditMaster = (master: CourseMaster) => {
      setSelectedMaster(master);
      setIsMasterModalOpen(true);
  };

  // -- Columns --

  const masterColumns: Column<CourseMaster>[] = [
      { key: 'title', header: 'Course Template', sortable: true, render: (m) => (
          <div>
              <p className="font-medium text-gray-900">{m.title}</p>
              <p className="text-xs text-gray-500">{m.code || 'NO-CODE'}</p>
          </div>
      )},
      { key: 'category', header: 'Category', sortable: true },
      { key: 'targetAudience', header: 'Audience', sortable: true },
      { key: 'status', header: 'Status', sortable: true, render: (m) => (
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.status}</span>
      )}
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
        </div>

        <DataTable<CourseMaster>
            title="Course Templates"
            data={filteredMasters}
            columns={masterColumns}
            searchKeys={['title', 'category']}
            onAdd={() => { setSelectedMaster(undefined); setIsMasterModalOpen(true); }}
            addLabel="Create New Template"
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
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-sm text-gray-700">Filter Templates</h4>
                                <button 
                                    onClick={() => { setFilterCategory('all'); setFilterStatus('all'); }} 
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Simulator">Simulator</option>
                                        <option value="Refresher">Refresher</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                                    <select 
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-gray-50"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
            actions={(master) => (
                <div className="flex justify-end gap-2">
                    <button 
                        onClick={() => handleEditMaster(master)} 
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Template"
                    >
                        <Edit size={18} />
                    </button>
                </div>
            )}
        />

        {/* Master Modal */}
        <Modal 
            isOpen={isMasterModalOpen} 
            onClose={() => setIsMasterModalOpen(false)}
            title={selectedMaster ? "Edit Course Template" : "New Course Template"}
        >
            <CourseMasterForm 
                initialData={selectedMaster} 
                onSave={handleSaveMaster}
                onCancel={() => setIsMasterModalOpen(false)}
            />
        </Modal>
    </div>
  );
};
