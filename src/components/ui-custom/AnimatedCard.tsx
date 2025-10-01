import { ReactNode, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
  glowColor?: string;
}

export const AnimatedCard = ({
  icon,
  title,
  description,
  delay = 0,
  className = '',
  glowColor = 'text-mogency-neon-blue'
}: AnimatedCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'card-glass rounded-lg p-6 transition-all duration-700',
        'hover:scale-105 hover:shadow-neon',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      <div className={cn('mb-4 animate-neon-pulse', glowColor)}>
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};
