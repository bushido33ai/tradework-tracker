import { Link } from "react-router-dom";

interface LogoProps {
  onClick?: () => void;
}

export const Logo = ({ onClick }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className="group relative flex items-center gap-3 p-2 transition-all duration-300 rounded-xl hover:-translate-y-0.5"
      onClick={onClick}
    >
      <img 
        src="/lovable-uploads/2ac19722-4b11-4ce1-8bd1-d28ef2a06b97.png" 
        alt="TradeMate Logo" 
        className="w-48 h-auto group-hover:scale-105 transition-transform duration-300"
      />
    </Link>
  );
};