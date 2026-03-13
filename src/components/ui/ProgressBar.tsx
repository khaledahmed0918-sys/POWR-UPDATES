import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  color?: string;
}

export function ProgressBar({ progress, className, color = 'bg-red-600' }: ProgressBarProps) {
  return (
    <div className={cn("w-full h-3 bg-black/40 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}
