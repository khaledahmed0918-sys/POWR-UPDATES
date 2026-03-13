import { cn } from '../../utils/cn';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32 md:w-40 md:h-40',
};

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const isLarge = size === 'xl' || size === 'lg';
  
  return (
    <div className={cn("relative rounded-full overflow-hidden border-4 border-black/50 shadow-2xl", sizeClasses[size], className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        loading={isLarge ? "eager" : "lazy"}
        fetchPriority={isLarge ? "high" : "auto"}
        decoding="async"
      />
    </div>
  );
}
