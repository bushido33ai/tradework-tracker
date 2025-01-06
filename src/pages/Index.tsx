import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const Index = () => {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  
  const images = [
    {
      url: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&w=1920",
      alt: "Low angle photography of gray building",
      caption: "Building Excellence"
    },
    {
      url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1920",
      alt: "White concrete building during daytime",
      caption: "Modern Construction"
    },
    {
      url: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1920",
      alt: "Bottom view of glass building",
      caption: "Innovative Design"
    }
  ];

  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&w=1920')`,
          backgroundAttachment: "fixed"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-800">
            Welcome to TradeMate
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Your all-in-one platform for managing construction and trade projects efficiently
          </p>
        </div>

        {/* Image Carousel */}
        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <Card className="border-none">
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
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
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
          <Card className="p-6 card-hover">
            <h3 className="text-xl font-semibold mb-3 text-primary-700">Job Management</h3>
            <p className="text-gray-600">Efficiently track and manage all your construction projects in one place</p>
          </Card>
          <Card className="p-6 card-hover">
            <h3 className="text-xl font-semibold mb-3 text-primary-700">Cost Tracking</h3>
            <p className="text-gray-600">Keep your budgets under control with detailed cost tracking and analysis</p>
          </Card>
          <Card className="p-6 card-hover">
            <h3 className="text-xl font-semibold mb-3 text-primary-700">Team Collaboration</h3>
            <p className="text-gray-600">Seamlessly collaborate with your team and stakeholders</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;