import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Button, Card } from './UI';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  title?: string;
  actions?: (item: T) => React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  filterOptions?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchKeys,
  title,
  actions,
  onAdd,
  addLabel = "Add New",
  filterOptions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerTerm = searchTerm.toLowerCase();
    return data.filter(item => 
      searchKeys.some(key => {
        const val = item[key];
        return String(val).toLowerCase().includes(lowerTerm);
      })
    );
  }, [data, searchTerm, searchKeys]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
        // @ts-ignore
        const aVal = a[sortConfig.key];
        // @ts-ignore
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

   const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <div className="w-4 h-4" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
            <div className="flex gap-3 w-full md:w-auto ml-auto">
                <div className="relative flex-1 md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                {filterOptions}
                {onAdd && (
                    <Button onClick={onAdd}>
                        <Plus size={18} /> {addLabel}
                    </Button>
                )}
            </div>
        </div>

        {/* Table */}
        <Card className="p-0 overflow-hidden border-0 shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold">
                        <tr>
                            {columns.map((col) => (
                                <th 
                                    key={col.key} 
                                    className={`px-6 py-4 ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''} transition-colors select-none`}
                                    onClick={() => col.sortable && requestSort(col.key)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.header}
                                        {col.sortable && getSortIcon(col.key)}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                    {columns.map((col) => (
                                        <td key={`${item.id}-${col.key}`} className="px-6 py-4">
                                            {col.render ? col.render(item) : (item as any)[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 text-right">
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search size={24} className="opacity-50"/>
                                        <p>No records found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <span className="text-sm text-gray-500">
                        Showing page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            className="px-3 h-9"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button 
                            variant="outline" 
                            className="px-3 h-9"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    </div>
  );
}