import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const Index = () => {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  const images = [
    {
      url: "/lovable-uploads/69663853-babf-463e-8762-de5c956a648b.png",
      alt: "Construction blueprints with measuring tape and drill",
      caption: "Precise Planning & Execution"
    },
    {
      url: "/lovable-uploads/58a4e10b-57e1-40ad-9d10-d39be2d4d0eb.png",
      alt: "Construction crane on building site at sunset",
      caption: "Large-Scale Projects"
    },
    {
      url: "/lovable-uploads/3143329b-2054-4942-8bf7-8c9113821903.png",
      alt: "Architect drawing detailed plans",
      caption: "Expert Design"
    },
    {
      url: "/lovable-uploads/2cb4ae81-e570-47a8-9002-4a9522803d47.png",
      alt: "Modern house exterior at dusk",
      caption: "Quality Results"
    }
  ];

  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background with gradient overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
          backgroundImage: `url('/lovable-uploads/58a4e10b-57e1-40ad-9d10-d39be2d4d0eb.png')`,
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
            Welcome to TradeMate
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Your all-in-one platform for managing construction and trade projects efficiently
          </p>
        </div>

        {/* Image Carousel */}
        <div className="max-w-5xl mx-auto mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                        {!imageErrors[index] ? (
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={() => handleImageError(index)}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Image failed to load
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                          <h3 className="text-white text-2xl font-semibold">
                            {image.caption}
                          </h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border-none">
            <h3 className="text-xl font-semibold mb-3 text-primary-700">Project Planning</h3>
            <p className="text-gray-600">Comprehensive tools for planning and managing construction projects</p>
          </Card>
          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border-none">
            <h3 className="text-xl font-semibold mb-3 text-primary-700">Resource Management</h3>
            <p className="text-gray-600">Efficiently track and allocate resources across your projects</p>
          </Card>
          <Card className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border-none">
            <h3 className="text-xl font-semibold mb-3 text-primary-700">Quality Assurance</h3>
            <p className="text-gray-600">Maintain high standards with our quality control tools</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;