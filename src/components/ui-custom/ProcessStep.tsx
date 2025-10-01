import { ReactNode, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
  isLast?: boolean;
  color?: string;
}

export const ProcessStep = ({
  number,
  title,
  description,
  icon,
  delay = 0,
  isLast = false,
  color = 'from-mogency-neon-blue to-mogency-neon-purple'
}: ProcessStepProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={stepRef}
      className={cn(
        'relative flex items-start transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <div className="flex flex-col items-center mr-6">
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center',
          'bg-gradient-to-r shadow-neon animate-neon-pulse',
          color
        )}>
          {icon}
        </div>
        {!isLast && (
          <div className="w-0.5 h-24 bg-gradient-to-b from-mogency-neon-blue to-transparent mt-4" />
        )}
      </div>
      <div className="flex-1 pb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl font-bold text-mogency-neon-blue opacity-30">
            {String(number).padStart(2, '0')}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};
