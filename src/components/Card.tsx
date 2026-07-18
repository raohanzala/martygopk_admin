import React from 'react';
import { cn } from '../utils/cn';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  description,
  actions,
}) => {
  return (
    <div className={cn('rounded-xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]', className)}>
      {(title || description || actions) && (
        <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-text-muted">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;
