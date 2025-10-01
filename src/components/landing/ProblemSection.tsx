import { AlertTriangle, FileX, Calculator, Clock } from "lucide-react";
import { AnimatedCard } from "@/components/ui-custom/AnimatedCard";

export const ProblemSection = () => {
  const problems = [
    {
      icon: <FileX className="w-8 h-8" />,
      title: "Lost in Paperwork",
      description: "Spending hours tracking receipts, invoices, and job notes instead of working on actual jobs.",
      glowColor: "text-mogency-neon-pink"
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Hidden Costs",
      description: "Discovering too late that a job lost money because you didn't track all your expenses properly.",
      glowColor: "text-mogency-neon-blue"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Wasted",
      description: "Juggling multiple spreadsheets, notes, and tools just to know if you're making a profit.",
      glowColor: "text-mogency-neon-purple"
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Missed Payments",
      description: "Forgetting to chase up payments or losing track of who owes you what and when.",
      glowColor: "text-mogency-neon-orange"
    }
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Running a Trade Business</span>
              <br />
              <span className="bg-gradient-to-r from-mogency-neon-orange to-mogency-neon-pink bg-clip-text text-transparent">
                Shouldn't Be This Hard
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every day, skilled tradesmen lose money—not because they're bad at their trade, but because managing the business side is overwhelming.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {problems.map((problem, index) => (
              <AnimatedCard
                key={index}
                icon={problem.icon}
                title={problem.title}
                description={problem.description}
                delay={index * 100}
                glowColor={problem.glowColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
