import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowUpDown, ArrowUp, ArrowDown, 
  ChevronLeft, ChevronRight, Download, Filter, 
  RefreshCw, FileSpreadsheet, Printer 
} from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  filterComponent?: React.ReactNode;
  pageSizeDefault?: number;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  exportFileName?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records by keyword, ID, or survey number...',
  searchFields,
  title,
  subtitle,
  actions,
  filterComponent,
  pageSizeDefault = 10,
  emptyMessage = 'No official records found matching the specified filter criteria.',
  onRowClick,
  exportFileName = 'bhoomisetu_export',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);
  const [showFilters, setShowFilters] = useState(false);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lower = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchFields && searchFields.length > 0) {
        return searchFields.some((field) => {
          const val = item[field];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(lower);
        });
      }
      // Search all values in the object
      return Object.values(item).some((val) => 
        val !== undefined && val !== null && String(val).toLowerCase().includes(lower)
      );
    });
  }, [data, searchTerm, searchFields]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    if (sortedData.length === 0) return;
    const headerRow = columns.map(c => `"${c.header.replace(/"/g, '""')}"`).join(',');
    const rows = sortedData.map(item => {
      return columns.map(c => {
        const val = item[c.key];
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFileName}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-gov-gray-300 rounded shadow-sm overflow-hidden flex flex-col">
      {/* Table Header / Action Bar */}
      <div className="p-3.5 border-b border-gov-gray-200 bg-gov-gray-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-sm font-bold text-gov-navy font-serif">{title}</h3>}
          {subtitle && <p className="text-xs text-gov-gray-600 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {actions}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gov-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-8 pr-3 py-1.5 text-xs border border-gov-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gov-navy focus:border-gov-navy w-64 bg-white"
            />
          </div>

          {/* Filter Toggle Button */}
          {filterComponent && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border transition-colors ${
                showFilters 
                  ? 'bg-gov-navy text-white border-gov-navy' 
                  : 'bg-white text-gov-gray-700 border-gov-gray-300 hover:bg-gov-gray-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          )}

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-white hover:bg-gov-gray-100 text-gov-gray-700 border border-gov-gray-300 rounded font-medium transition-colors"
            title="Export full filtered dataset to CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-gov-navy" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Component Drawer */}
      {showFilters && filterComponent && (
        <div className="p-3 bg-blue-50/50 border-b border-gov-gray-200">
          {filterComponent}
        </div>
      )}

      {/* Table Data View */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-gov-gray-100 text-gov-gray-800 border-b border-gov-gray-300 select-none font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-3 py-2.5 tracking-tight border-r border-gov-gray-200 last:border-r-0 ${
                    col.sortable ? 'cursor-pointer hover:bg-gov-gray-200 transition-colors' : ''
                  } ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1.5 ${
                    col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-gov-gray-400">
                        {sortKey === col.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-gov-navy" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-gov-navy" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gov-gray-200 text-gov-gray-900">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    rowIdx % 2 === 1 ? 'bg-gov-gray-50/60' : 'bg-white'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2.5 border-r border-gov-gray-200 last:border-r-0 ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(item) : item[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gov-gray-500">
                  <div className="max-w-sm mx-auto space-y-1">
                    <p className="text-sm font-semibold text-gov-gray-700 font-serif">No Records Found</p>
                    <p className="text-xs text-gov-gray-500">{emptyMessage}</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-xs text-gov-navy underline hover:text-blue-800"
                      >
                        Clear search query
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-gov-gray-200 bg-gov-gray-50 flex flex-wrap items-center justify-between gap-3 text-xs text-gov-gray-600">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong>{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{' '}
            <strong>{sortedData.length}</strong> statutory records
          </span>
          <span className="text-gov-gray-300">|</span>
          <label className="flex items-center gap-1">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-1.5 py-0.5 border border-gov-gray-300 rounded bg-white text-xs"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 border border-gov-gray-300 rounded bg-white hover:bg-gov-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-2 py-0.5 text-xs font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 border border-gov-gray-300 rounded bg-white hover:bg-gov-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
