import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Is this really free to start?",
      answer: "Yes! You can start with a free trial and see if it works for your business. No credit card required to get started."
    },
    {
      question: "Do I need to be tech-savvy to use this?",
      answer: "Not at all. We've designed this specifically for tradesmen who want simple tools that just work. If you can send a text, you can use this platform."
    },
    {
      question: "Can I track multiple jobs at once?",
      answer: "Absolutely. Track as many jobs as you want, from initial enquiry through to completion and payment."
    },
    {
      question: "What if I need help getting started?",
      answer: "We provide full support to help you get set up. Plus, our interface is intuitive and designed to be self-explanatory."
    },
    {
      question: "Can I access this on my phone?",
      answer: "Yes! The platform works perfectly on phones, tablets, and computers. Update jobs on site, in the van, or at home."
    },
    {
      question: "How secure is my data?",
      answer: "Your data is encrypted and stored securely. We take security seriously and use industry-standard protection."
    }
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Common</span>
              <br />
              <span className="bg-gradient-to-r from-mogency-neon-purple to-mogency-neon-pink bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="card-glass rounded-lg px-6 border-0"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-mogency-neon-blue transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
