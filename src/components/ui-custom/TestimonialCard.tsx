import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  delay?: number;
}

export const TestimonialCard = ({
  quote,
  author,
  role,
  company,
  delay = 0
}: TestimonialCardProps) => {
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
        'card-glass rounded-lg p-8 transition-all duration-700',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}
    >
      <svg
        className="w-12 h-12 text-mogency-neon-pink mb-4 opacity-50"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-lg mb-6 text-foreground italic">
        "{quote}"
      </p>
      <div className="border-t border-border pt-4">
        <p className="font-bold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">
          {role} • {company}
        </p>
      </div>
    </div>
  );
};
