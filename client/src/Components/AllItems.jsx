import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addproducttoCart, getCartItems, getProducts } from "../redux/productSlice";
import { Card, Typography, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function AllItems({ selectedCategory, onCategorySelect }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { products, loading } = useSelector((state) => state.product);
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const autoScrollRef = useRef(null);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = products?.filter((item) => {
    return item.product_category.toLowerCase().includes(selectedCategory?.toLowerCase());
  });

  const handleCart = async (productId) => {
    if (!userInfo) {
      navigate('/login');
    } else {
      await dispatch(addproducttoCart({
        user_id: userInfo?._id,
        product_id: productId,
        quantity: 1
      }));
      await dispatch(getCartItems({ user_id: userInfo?._id }));
    }
  };

  // Responsive slides configuration
  const slidesToShow = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSlidesToShow = () => {
    if (windowWidth < 640) return slidesToShow.mobile;
    if (windowWidth < 1024) return slidesToShow.tablet;
    return slidesToShow.desktop;
  };

  const currentSlidesToShow = getSlidesToShow();
  const maxSlide = Math.max(0, (filteredProducts?.length || 0) - currentSlidesToShow);

  // Auto-scroll functionality
  useEffect(() => {
    if (filteredProducts?.length > currentSlidesToShow) {
      autoScrollRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
      }, 3000);

      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current);
        }
      };
    }
  }, [maxSlide, filteredProducts?.length, currentSlidesToShow]);

  const pauseAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  const resumeAutoScroll = () => {
    if (filteredProducts?.length > currentSlidesToShow) {
      autoScrollRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
      }, 3000);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  const nextImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const product = products?.find((p) => p._id === productId);
      const currentIdx = prev[productId] || 0;
      return {
        ...prev,
        [productId]: (currentIdx + 1) % (product?.product_image?.length || 1),
      };
    });
  };

  const prevImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const product = products?.find((p) => p._id === productId);
      const currentIdx = prev[productId] || 0;
      return {
        ...prev,
        [productId]: currentIdx === 0 ? (product?.product_image?.length || 1) - 1 : currentIdx - 1,
      };
    });
  };

  return (
    <div className="w-full px-4 py-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl text-gray-800">
            Fresh Items
            <span className="text-lg md:text-xl ml-2 text-gray-600">
              ({filteredProducts?.length || 0})
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedCategory && (
            <>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                {selectedCategory}
              </span>
              <Button
                onClick={() => onCategorySelect('')}
                color="red"
                size="sm"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                View All
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent"></div>
            <p className="mt-4 text-lg font-medium text-gray-700">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Products Carousel */}
          {filteredProducts?.length === 0 ? (
            <div className="text-center py-20">
              <Typography variant="paragraph" className="text-xl text-gray-600">
                No products found.
              </Typography>
            </div>
          ) : (
            <div
              className="relative"
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={resumeAutoScroll}
            >
              {/* Navigation Arrows */}
              {filteredProducts?.length > currentSlidesToShow && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl transition-all -ml-5 hover:scale-110"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl transition-all -mr-5 hover:scale-110"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / currentSlidesToShow)}%)`,
                  }}
                >
                  {filteredProducts?.map((product) => {
                    const currentImgIdx = currentImageIndex[product._id] || 0;
                    return (
                      <div
                        key={product._id}
                        className="flex-shrink-0 px-3"
                        style={{ width: `${100 / currentSlidesToShow}%` }}
                      >
                        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                          <div className="p-4">
                            {/* Product Images */}
                            <Link to={`/product/${product?._id}`}>
                              <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100 group">
                                <div className="aspect-square w-full">
                                  <img
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    src={product?.product_image?.[currentImgIdx]}
                                    alt={product?.product_name}
                                  />
                                </div>
                                
                                {/* Image Navigation */}
                                {product?.product_image?.length > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        prevImage(product._id);
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full flex items-center justify-center text-white text-xl transition-all"
                                      aria-label="Previous image"
                                    >
                                      ‹
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        nextImage(product._id);
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full flex items-center justify-center text-white text-xl transition-all"
                                      aria-label="Next image"
                                    >
                                      ›
                                    </button>
                                    
                                    {/* Image Dots */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                      {product?.product_image?.map((_, idx) => (
                                        <button
                                          key={idx}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentImageIndex((prev) => ({ ...prev, [product._id]: idx }));
                                          }}
                                          className={`h-2 rounded-full transition-all ${
                                            idx === currentImgIdx
                                              ? "bg-white w-4"
                                              : "bg-white bg-opacity-50 w-2"
                                          }`}
                                          aria-label={`Go to image ${idx + 1}`}
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </Link>

                            {/* Product Info */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <Typography variant="h6" className="font-semibold text-gray-800 flex-1 line-clamp-2">
                                  {product?.product_name}
                                </Typography>
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap">
                                  {product?.product_category}
                                </span>
                              </div>

                              <Typography className="text-sm text-gray-600 font-medium">
                                {product?.product_size}{product?.quantity_measure}
                              </Typography>

                              {product?.total_products !== 0 && (
                                <Typography className="text-xs text-gray-500">
                                  Stock: {product?.total_products} items
                                </Typography>
                              )}

                              <Typography className="text-sm text-gray-600 min-h-[40px] line-clamp-2">
                                {product?.product_description}
                              </Typography>

                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <Typography className="text-2xl font-bold text-green-600">
                                  ${product?.product_price}
                                </Typography>
                                <Button
                                  onClick={() => handleCart(product?._id)}
                                  color="red"
                                  size="sm"
                                  className="shadow-md hover:shadow-lg transition-all"
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Indicators */}
              {filteredProducts?.length > currentSlidesToShow && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxSlide + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-3 rounded-full transition-all ${
                        idx === currentSlide
                          ? "bg-green-600 w-8"
                          : "bg-gray-300 hover:bg-gray-400 w-3"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* See More Link */}
          {filteredProducts?.length > 0 && (
            <div className="flex justify-end mt-6">
              <Link to="/allitems">
                <button className="text-green-600 font-medium hover:text-green-700 underline underline-offset-4 transition-colors px-4 py-2">
                  See More →
                </button>
              </Link>
            </div>
          )}
        </>
      )}

      {/* Custom Styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default AllItems;