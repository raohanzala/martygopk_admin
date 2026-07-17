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
      <div className="bg-surface border border-border rounded">
        <div className="p-8 text-center">
          <p className="text-sm text-text-muted">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-surface border border-border rounded overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-nowrap text-xs font-semibold text-text-secondary uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.width && `w-[${column.width}]`
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(item, rowIndex)}
                className={cn(
                  'transition-colors text-nowrap whitespace-nowrap',
                  onRowClick && 'cursor-pointer hover:bg-background'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm text-text-primary',
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
