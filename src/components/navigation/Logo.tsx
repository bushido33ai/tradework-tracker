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
        src="/lovable-uploads/9a2a11b3-e135-4b23-9ebf-e3361f4a90c4.png" 
        alt="TradeMate Logo" 
        className="w-32 h-auto group-hover:scale-105 transition-transform duration-300"
      />
    </Link>
  );
};