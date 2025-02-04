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
        src="/lovable-uploads/15450379-3a61-442e-83d8-3bd0bc091a36.png" 
        alt="TradeMate Logo" 
        className="w-52 h-auto group-hover:scale-105 transition-transform duration-300"
      />
    </Link>
  );
};