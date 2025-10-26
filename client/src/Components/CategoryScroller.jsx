import { useSelector } from "react-redux";
import Slider from "react-slick";
import data from "../data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CategoryScroller({ onCategorySelect }) {
  const userInfo = useSelector((state) => state.auth.userInfo);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "ease-in-out",
    slidesToShow: 6,
    slidesToScroll: 2,
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="py-10   overflow-hidden">
      <h2 className="text-xl md:text-3xl font-bold text-center mb-8 text-green-700">
        Explore Our Categories 🌿
      </h2>

      <div className="mx-6 md:mx-10">
        <Slider {...settings} className="category-slider">
          {data?.categories?.map((category, index) => (
            <div
              key={index}
              onClick={() => onCategorySelect(category?.name)}
              className="flex flex-col items-center justify-center text-center cursor-pointer transition-transform duration-500 hover:scale-105 hover:drop-shadow-md"
            >
              <div className="relative group">
                <img
                  src={category?.image}
                  alt={category?.name}
                  className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-4 border-green-200 group-hover:border-green-400 shadow-none transition-all duration-300"
                />
              </div>

              </div>
          ))}
        </Slider>
      </div>

      {/* Custom Styles */}
      <style>{`
        .category-slider .slick-prev, .category-slider .slick-next {
          z-index: 10;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.15);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        .category-slider .slick-prev:hover, .category-slider .slick-next:hover {
          background: rgba(34, 197, 94, 0.35);
        }
        .category-slider .slick-prev::before,
        .category-slider .slick-next::before {
          color: #16a34a;
          font-size: 20px;
        }
        /* Smooth scrolling feel */
        .category-slider {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default CategoryScroller;
