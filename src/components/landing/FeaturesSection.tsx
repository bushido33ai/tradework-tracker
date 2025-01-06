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
          className="flex items-center space-x-3 bg-white/80 p-4 rounded-lg shadow-sm backdrop-blur-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-primary-600" />
          <span className="text-gray-700 font-medium">{feature}</span>
        </div>
      ))}
    </div>
  );
};