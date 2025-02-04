import { CheckCircle2 } from "lucide-react";

const features = [
  "Track multiple jobs efficiently",
  "Manage supplier relationships",
  "Monitor costs and profitability",
  "Minimise administrative overheads",
];

export const FeaturesSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
      {features.map((feature) => (
        <div
          key={feature}
          className="flex items-center space-x-3 bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border border-primary-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-primary-50/80"
        >
          <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0" />
          <span className="text-gray-800 font-medium">{feature}</span>
        </div>
      ))}
    </div>
  );
};