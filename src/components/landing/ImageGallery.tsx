export const ImageGallery = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <img
        src="/lovable-uploads/ad08ae9a-d7c2-42ef-a917-1c84922ea475.png"
        alt="Architectural Drawing and Planning"
        className="rounded-lg shadow-xl w-full h-64 object-cover"
        onError={(e) => {
          console.error("Failed to load planning image");
          e.currentTarget.style.display = 'none';
        }}
      />
      <img
        src="/lovable-uploads/2cb4ae81-e570-47a8-9002-4a9522803d47.png"
        alt="Modern Construction"
        className="rounded-lg shadow-xl w-full h-64 object-cover"
        onError={(e) => {
          console.error("Failed to load construction image");
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};