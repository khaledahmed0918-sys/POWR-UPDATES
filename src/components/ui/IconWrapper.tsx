import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function IconWrapper({ children, className, color }: IconWrapperProps) {
  return (
    <div 
      className={cn("flex items-center justify-center p-2 rounded-full", className)}
      style={{ backgroundColor: color ? `${color}20` : undefined, color }}
    >
      {children}
    </div>
  );
}
