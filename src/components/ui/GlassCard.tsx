import React from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
