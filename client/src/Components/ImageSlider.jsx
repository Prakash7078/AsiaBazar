
import React, { useState, useEffect } from 'react';
import { Carousel } from "react-carousel-minimal";
const ImageSlider = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [validImages, setValidImages] = useState([]);

  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      setValidImages([]);
      setImagesLoaded(true);
      return;
    }

    const filtered = data.filter(url => url && url.trim());
    setValidImages(filtered);

    if (filtered.length > 0) {
      // Preload images
      let loadedCount = 0;
      filtered.forEach((url) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === filtered.length) {
            setImagesLoaded(true);
          }
        };
        img.src = url;
      });
    } else {
      setImagesLoaded(true);
    }
  }, [data]);

  if (!imagesLoaded) {
    return (
      <div className="flex justify-center items-center bg-gray-100 rounded-lg" style={{ height: "500px" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (validImages.length === 0) {
    return (
      <div className="flex justify-center items-center bg-gray-100 rounded-lg" style={{ height: "500px" }}>
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      {/* Main Image Container */}
      <div className="relative bg-gray-200 rounded-lg overflow-hidden" style={{ height: "60vh", maxHeight: "500px" }}>
        <img
          src={validImages[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
          className="object-cover w-full h-full transition-all duration-300"
          style={{ userSelect: 'none' }}
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all text-2xl font-bold"
              style={{ zIndex: 10 }}
            >
              &#8249;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all text-2xl font-bold"
              style={{ zIndex: 10 }}
            >
              &#8250;
            </button>
          </>
        )}

        {/* Slide Number */}
        <div 
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full"
          style={{ fontSize: "20px", fontWeight: "bold" }}
        >
          {currentIndex + 1} / {validImages.length}
        </div>

        {/* Dots Indicator */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {validImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Thumbnail ${index + 1}`}
              className={`flex-shrink-0 w-24 h-24 object-cover rounded-lg cursor-pointer transition-all ${
                index === currentIndex 
                  ? 'ring-4 ring-blue-500 ring-offset-2' 
                  : 'opacity-70 hover:opacity-100 hover:ring-2 hover:ring-gray-300'
              }`}
              onClick={() => goToSlide(index)}
              style={{ userSelect: 'none' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default ImageSlider;