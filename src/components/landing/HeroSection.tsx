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
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>Start here to check your jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center space-x-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};