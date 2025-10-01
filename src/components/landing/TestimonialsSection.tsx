import { TestimonialCard } from "@/components/ui-custom/TestimonialCard";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I was losing money on jobs and didn't even know it. Now I can see exactly where every penny goes. Game changer.",
      author: "Mike Thompson",
      role: "Electrician",
      company: "Thompson Electrical"
    },
    {
      quote: "Finally ditched my spreadsheets! This is so much easier and I actually know if I'm making money now.",
      author: "Sarah Chen",
      role: "Plumber",
      company: "Chen Plumbing Services"
    },
    {
      quote: "Saved me at least 10 hours a week on admin. I can focus on the work I actually enjoy doing.",
      author: "James Wilson",
      role: "Carpenter",
      company: "Wilson Woodworks"
    },
    {
      quote: "The payment tracking alone is worth it. I'm getting paid faster and never miss following up with customers.",
      author: "Emma Davies",
      role: "Decorator",
      company: "Davies Decorating"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Trusted by</span>
              <br />
              <span className="bg-gradient-to-r from-mogency-neon-pink to-mogency-neon-blue bg-clip-text text-transparent">
                Tradesmen Like You
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real feedback from real tradesmen who've transformed their businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
