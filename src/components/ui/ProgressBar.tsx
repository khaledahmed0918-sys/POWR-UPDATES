import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  color?: string;
}

export function ProgressBar({ progress, className, color = 'bg-red-500' }: ProgressBarProps) {
  return (
    <div className={cn("w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner", className)}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]", color)}
      />
    </div>
  );
}
