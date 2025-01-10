import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  session: any;
}

export const HeroSection = ({ session }: HeroSectionProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-5xl font-bold text-gray-900 mb-6">
        Manage Your Trade Business{" "}
        <span className="text-primary-600">Efficiently</span>
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        The all-in-one platform for tradesmen to manage jobs, track costs, save time and make a tradesman's life easier.
      </p>

      <div className="flex justify-center space-x-4 mb-12">
        {session ? (
          <Link
            to="/jobs"
            className="group relative px-6 py-3 bg-primary-600 text-white rounded-lg transition-all duration-300 hover:bg-primary-700 hover:-translate-y-1 hover:shadow-lg font-medium flex items-center space-x-2 animate-fade-in"
          >
            <span>Start here to check your jobs</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        ) : (
          <Link
            to="/register"
            className="group relative px-6 py-3 bg-primary-600 text-white rounded-lg transition-all duration-300 hover:bg-primary-700 hover:-translate-y-1 hover:shadow-lg font-medium flex items-center space-x-2 animate-fade-in"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </Link>
        )}
      </div>
    </div>
  );
};