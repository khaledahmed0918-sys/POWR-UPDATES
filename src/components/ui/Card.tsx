import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "glass-card p-6 transition-all duration-500",
        "hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(185,28,28,0.5)] hover:border-red-400/50",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
