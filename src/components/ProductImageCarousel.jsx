import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageCarousel = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Only show navigation if there are multiple images
  const showNavigation = images && images.length > 1;
  
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  return (
    <div className="product-image-carousel relative">
      {images && images.length > 0 ? (
        <img 
          src={images[currentImageIndex]} 
          alt={`${productName} - Image ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="bg-gray-200 flex items-center justify-center h-full">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      
      {showNavigation && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-r-md shadow-md hover:bg-opacity-90 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-l-md shadow-md hover:bg-opacity-90 transition-all"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  currentImageIndex === index ? 'bg-black' : 'bg-gray-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImageCarousel;