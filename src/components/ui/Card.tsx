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
        "bg-white/5 border border-white/10 backdrop-blur-xl rounded-[17px] p-6 shadow-xl transition-all duration-500",
        "hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(139,0,0,0.4)] hover:border-red-500/40",
        className
      )}
    >
      {children}
    </div>
  );
}
