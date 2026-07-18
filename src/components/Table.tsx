import React from 'react';
import { cn } from '../utils/cn';

export interface TableColumn<T = any> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  className,
  onRowClick,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={cn('bg-surface', className)}>
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-medium text-text-secondary">{emptyMessage}</p>
          <p className="mt-1 text-xs text-text-muted">
            Try adjusting your search or add a new item.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-surface overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-[0.06em] text-text-muted bg-background/80',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr
                key={item._id ?? item.id ?? rowIndex}
                onClick={() => onRowClick?.(item, rowIndex)}
                className={cn(
                  'border-b border-border/70 last:border-b-0 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-background/70'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-5 py-4 text-sm text-text-primary text-nowrap align-middle',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render
                      ? column.render(item, rowIndex)
                      : (item[column.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
