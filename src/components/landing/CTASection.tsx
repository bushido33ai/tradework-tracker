import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  session: any;
}

export const CTASection = ({ session }: CTASectionProps) => {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card-glass rounded-2xl p-12 md:p-16 text-center relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-mogency-neon-blue/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-foreground">Ready to Take</span>
                <br />
                <span className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue bg-clip-text text-transparent">
                  Control of Your Business?
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of tradesmen who've already transformed how they manage their jobs and profits.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                {session ? (
                  <Link to="/dashboard">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue hover:scale-105 transition-transform text-white font-bold px-8 py-6 text-lg shadow-neon-pink group"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue hover:scale-105 transition-transform text-white font-bold px-8 py-6 text-lg shadow-neon-pink group"
                    >
                      Start Your Free Trial
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </div>

              <p className="text-mogency-neon-pink animate-neon-pulse text-sm font-medium">
                <Zap className="inline w-4 h-4 mr-1" />
                No credit card required • Set up in 5 minutes • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
