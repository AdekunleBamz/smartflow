'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  pageSize?: number;
  sortable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  onRowClick?: (item: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pageSize = 10,
  sortable = true,
  loading = false,
  emptyMessage = 'No data available',
  className,
  headerClassName,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortColumn];
      const bValue = (b as Record<string, unknown>)[sortColumn];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn('border-b border-white/10', headerClassName)}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'px-4 py-3 text-sm font-medium text-gray-400',
                    alignClasses[column.align || 'left'],
                    column.sortable !== false && sortable && 'cursor-pointer hover:text-white'
                  )}
                  style={{ width: column.width }}
                  onClick={() => {
                    if (column.sortable !== false && sortable) {
                      handleSort(String(column.key));
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable !== false && sortable && (
                      <SortIcon columnKey={String(column.key)} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3">
                      <div className="h-4 bg-white/10 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const rowClass = typeof rowClassName === 'function' 
                  ? rowClassName(item, index) 
                  : rowClassName;
                
                return (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'border-b border-white/5 transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-white/5',
                      rowClass
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-4 py-3 text-sm text-gray-300',
                          alignClasses[column.align || 'left']
                        )}
                      >
                        {column.render
                          ? column.render(item, index)
                          : String((item as Record<string, unknown>)[String(column.key)] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
          <span className="text-sm text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
