import { CheckCircle2, TrendingUp, FileCheck, Users } from "lucide-react";
import { AnimatedCard } from "@/components/ui-custom/AnimatedCard";

export const SolutionSection = () => {
  const solutions = [
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Everything in One Place",
      description: "Track jobs, costs, payments, and documents all in one simple dashboard. No more spreadsheets or lost receipts.",
      glowColor: "text-mogency-neon-green"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Real Profit Tracking",
      description: "See exactly how much you're making (or losing) on each job in real-time. Know your numbers before it's too late.",
      glowColor: "text-mogency-neon-blue"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description: "Keep all customer details, job history, and communications organized so you never miss a follow-up or repeat business.",
      glowColor: "text-mogency-neon-pink"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Built for Tradesmen",
      description: "Designed by people who understand your world. Simple, practical tools that actually help your business grow.",
      glowColor: "text-mogency-neon-purple"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mogency-neon-green to-mogency-neon-blue bg-clip-text text-transparent">
                One Platform
              </span>
              <br />
              <span className="text-foreground">Complete Control</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We've built the tool we wish we had when we were running our trade businesses. Simple, powerful, and designed for real tradesmen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {solutions.map((solution, index) => (
              <AnimatedCard
                key={index}
                icon={solution.icon}
                title={solution.title}
                description={solution.description}
                delay={index * 100}
                glowColor={solution.glowColor}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
