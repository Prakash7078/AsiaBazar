import React, { useState, useEffect } from "react";

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

    const filtered = data.filter((url) => url && url.trim());
    setValidImages(filtered);

    if (filtered.length > 0) {
      let loadedCount = 0;
      filtered.forEach((url) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === filtered.length) setImagesLoaded(true);
        };
        img.src = url;
      });
    } else {
      setImagesLoaded(true);
    }
  }, [data]);

  if (!imagesLoaded) {
    return (
      <div className="flex justify-center items-center bg-gray-100 rounded-2xl h-64 sm:h-72 md:h-80 lg:h-[450px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (validImages.length === 0) {
    return (
      <div className="flex justify-center items-center bg-gray-100 rounded-2xl h-64 sm:h-72 md:h-80 lg:h-[450px] text-gray-500 font-medium">
        No images available
      </div>
    );
  }

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  const goToSlide = (index) => setCurrentIndex(index);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Image Container */}
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-md group">
        <img
          src={validImages[currentIndex]}
          alt={`Product ${currentIndex + 1}`}
          className="w-full h-64 sm:h-72 md:h-80 lg:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ userSelect: "none" }}
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 sm:p-3 hover:bg-black/70 transition-all"
            >
              &#8249;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 sm:p-3 hover:bg-black/70 transition-all"
            >
              &#8250;
            </button>
          </>
        )}

        {/* Slide Counter */}
        <div className="absolute top-3 right-3 bg-black/40 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          {currentIndex + 1} / {validImages.length}
        </div>

        {/* Dots */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {validImages.map((_, i) => (
              <span
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                  i === currentIndex ? "bg-green-500 scale-110" : "bg-white/60"
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
              className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl cursor-pointer transition-all ${
                index === currentIndex
                  ? "ring-4 ring-green-500 ring-offset-2 scale-105"
                  : "opacity-70 hover:opacity-100 hover:ring-2 hover:ring-gray-300"
              }`}
              onClick={() => goToSlide(index)}
              style={{ userSelect: "none" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
