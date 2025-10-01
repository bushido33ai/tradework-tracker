import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  session: any;
}

export const HeroSection = ({ session }: HeroSectionProps) => {
  return (
    <section className="relative py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue bg-clip-text text-transparent text-neon-glow">
                Stop Losing Money
              </span>
              <br />
              <span className="text-foreground">
                On Poor Job Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The all-in-one platform that helps tradesmen track costs, manage jobs, and maximize profits—without the paperwork headaches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-scale-in">
            {session ? (
              <Link to="/dashboard">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue hover:scale-105 transition-transform text-white font-bold px-8 py-6 text-lg shadow-neon group"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue hover:scale-105 transition-transform text-white font-bold px-8 py-6 text-lg shadow-neon group"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-mogency-neon-blue text-mogency-neon-blue hover:bg-mogency-neon-blue hover:text-black transition-all px-8 py-6 text-lg"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="text-mogency-neon-pink animate-neon-pulse mt-4 text-sm font-medium">
            <Zap className="inline w-4 h-4 mr-1" />
            No credit card required • Set up in 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};
