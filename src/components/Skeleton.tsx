import React from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('animate-pulse rounded bg-border', className)}
      {...props}
    />
  );
};

export default Skeleton;
