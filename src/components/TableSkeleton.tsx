import React from 'react';
import { cn } from '../utils/cn';
import Skeleton from './Skeleton';

export interface TableSkeletonColumn {
  /** Optional width e.g. '80px', '140px' */
  width?: string;
  /** First column is image/logo (square skeleton) */
  image?: boolean;
  /** Align right (e.g. for actions) */
  alignRight?: boolean;
}

export interface TableSkeletonProps {
  /** Number of rows to show */
  rowCount?: number;
  /** Column config matching the actual table */
  columns: TableSkeletonColumn[];
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rowCount = 10,
  columns,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded overflow-hidden',
        className
      )}
      role="status"
      aria-label="Loading table"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider',
                    col.alignRight && 'text-right'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr key={rowIndex} className="bg-surface">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      'px-4 py-3 text-sm',
                      col.alignRight && 'text-right'
                    )}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.image ? (
                      <Skeleton className="h-12 w-12 rounded shrink-0" />
                    ) : (
                      <Skeleton
                        className={cn(
                          'h-4',
                          colIndex === 1 ? 'w-32 max-w-full' : 'w-24 max-w-full'
                        )}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;
