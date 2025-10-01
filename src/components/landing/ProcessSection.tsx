import { UserPlus, Briefcase, TrendingUp, Target } from "lucide-react";
import { ProcessStep } from "@/components/ui-custom/ProcessStep";

export const ProcessSection = () => {
  const steps = [
    {
      number: 1,
      title: "Sign Up Free",
      description: "Create your account in under 5 minutes. No credit card needed, no complicated setup.",
      icon: <UserPlus className="w-6 h-6 text-white" />,
      color: "from-mogency-neon-blue to-mogency-neon-purple"
    },
    {
      number: 2,
      title: "Add Your First Job",
      description: "Enter job details, customer info, and start tracking costs. It's that simple.",
      icon: <Briefcase className="w-6 h-6 text-white" />,
      color: "from-mogency-neon-purple to-mogency-neon-pink"
    },
    {
      number: 3,
      title: "Track Everything",
      description: "Log materials, labor, and expenses as you go. Upload photos and documents instantly.",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "from-mogency-neon-pink to-mogency-neon-orange"
    },
    {
      number: 4,
      title: "See Your Profits",
      description: "Get instant insights into your profitability, outstanding payments, and business health.",
      icon: <Target className="w-6 h-6 text-white" />,
      color: "from-mogency-neon-orange to-mogency-neon-green",
      isLast: true
    }
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Get Started in</span>
              <br />
              <span className="bg-gradient-to-r from-mogency-neon-blue to-mogency-neon-pink bg-clip-text text-transparent">
                4 Simple Steps
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              No training required. No complicated setup. Just simple tools that work.
            </p>
          </div>

          <div className="space-y-0">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                delay={index * 150}
                isLast={step.isLast}
                color={step.color}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
