import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import 'swiper/css';

import {
  addproducttoCart,
  getCafeItems,
  getCartItems,
} from "../redux/productSlice";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TypeAnimation } from "react-type-animation";
import { ShoppingCart, ChevronDown, SlidersHorizontal, X, Search, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CafeItems() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cafeItems, loading } = useSelector((state) => state.product);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const [searchTerm, setSearchTerm] = useState("");
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [open, setOpen] = useState(false);

  // new filter states
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const images = [
    "/Images/samosachat.jpeg",
    "/Images/panipuri.jpeg",
    "/Images/chatspecials.jpeg",
    "/Images/chickenrice.jpeg",
    "/Images/cold_drinks.jpeg",
    "/Images/gulab.jpeg",
    "/Images/meals.jpeg",
    "/Images/rasa.jpeg",
    "/Images/sweets1.jpeg",
  ];

  const categories = [
    "All",
    "NON VEG APPETIZERS",
    "VEG APPETIZERS",
    "RICE BOWLS(EACH)",
    "GRAVIES(PER LB)",
    "DESERTS",
    "CHAT CORNER SPECIALS",
    "DRINKS",
    "BRUNCH BUFFET SPECIALS"
  ];

  useEffect(() => {
    dispatch(getCafeItems());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const handleCart = async (productId) => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    await dispatch(
      addproducttoCart({
        user_id: userInfo._id,
        product_id: productId,
        quantity: 1,
      })
    );
    await dispatch(getCartItems({ user_id: userInfo._id }));
  };

  // filtering by name + category + new filters
  const filteredProducts = cafeItems?.filter((item) => {
    const matchSearch = item.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All" ||
      item.product_name?.split('#')[1].toLowerCase()===(selectedCategory.toLowerCase());
    const matchDiscount = !onlyDiscount || item.discount > 0;
    const matchInStock = !onlyInStock || !item.outOfStock;
    const matchOutOfStock = !onlyOutOfStock || item.outOfStock;
    return matchSearch && matchCategory && matchDiscount && matchInStock && matchOutOfStock;
  });

  const variants = {
    initial: { z: -200, opacity: 0, scale: 0.9 },
    animate: { z: 0, opacity: 1, scale: 1 },
    exit: { z: 200, opacity: 0, scale: 0.9 },
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const activeFilterCount = [
    selectedCategory !== "All",
    onlyDiscount,
    onlyInStock,
    onlyOutOfStock,
    searchTerm !== "",
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setOnlyDiscount(false);
    setOnlyInStock(false);
    setOnlyOutOfStock(false);
  };

  // filter panel — reused in both desktop sidebar and mobile drawer
  const filterPanel = (
    <div className="flex flex-col">

      {/* Panel Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-green-600" />
          <span className="font-bold text-gray-800 text-lg">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-red-500 font-semibold hover:underline"
            >
              Reset all
            </button>
          )}
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Availability</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { setOnlyInStock(!onlyInStock); setOnlyOutOfStock(false); }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              onlyInStock
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-green-400 hover:bg-green-50"
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> In Stock Only
            </span>
            {onlyInStock && <CheckCircle2 className="w-4 h-4 text-green-600" />}
          </button>

          <button
            onClick={() => { setOnlyOutOfStock(!onlyOutOfStock); setOnlyInStock(false); }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              onlyOutOfStock
                ? "bg-gray-200 border-gray-500 text-gray-700"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-gray-400" /> Out of Stock
            </span>
            {onlyOutOfStock && <CheckCircle2 className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Deals */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Deals</p>
        <button
          onClick={() => setOnlyDiscount(!onlyDiscount)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            onlyDiscount
              ? "bg-red-50 border-red-400 text-red-600"
              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🏷️</span> Discounted Items Only
          </span>
          {onlyDiscount && <CheckCircle2 className="w-4 h-4 text-red-500" />}
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${
                selectedCategory === cat
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen pb-16">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-6 md:py-4 bg-white/80 backdrop-blur-md md:rounded-3xl shadow-sm md:mt-24 mt-16 max-w-6xl mx-auto bg-gradient-to-r from-green-50 to-green-100">
        {/* Text Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl md:text-4xl h-16 font-extrabold text-gray-800 leading-tight">
            Welcome to{" "}
            <TypeAnimation
              sequence={["ASIA BAZAAR", 2000, "CAFÉ", 2000]}
              speed={60}
              wrapper="span"
              repeat={Infinity}
              className="inline-block text-green-600 drop-shadow-md"
            />
          </h1>
          <p className="mt-4 text-gray-600 md:text-lg max-w-md">
            Experience freshly cooked meals, drinks, and sweets — crafted with
            love and delivered with care.

            <span className="mt-4 flex items-center gap-2 text-amber-700 font-semibold text-base">
              <span className="text-lg">🕓</span>
              Open daily 4:00 PM – 9:30 PM
            </span>

            <span className="mt-3 flex flex-wrap gap-2">
              {["Friday", "Saturday", "Sunday", "Monday"].map((day) => (
                <span
                  key={day}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {day}
                </span>
              ))}
            </span>
          </p>

          <Button
            color="green"
            onClick={() => navigate("/menu")}
            className="mt-6 font-semibold text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
          >
            Explore Menu
          </Button>
        </div>

        {/* Animated Image Section */}
        <div className="relative z-0 w-48 h-48 md:w-52 md:h-52 flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt={`Slide ${index + 1}`}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full h-full object-cover rounded-2xl shadow-xl border-4 border-white"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Swiper */}
      <div className="max-w-6xl mx-auto mt-12 md:mt-10">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={4}
          spaceBetween={20}
          loop={true}
          speed={2500}
          autoplay={{
            delay: 1200,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {images.map((imgUrl, idx) => (
            <SwiperSlide key={idx} className="!w-auto">
              <img
                src={imgUrl}
                className="md:h-72 h-28 w-auto object-cover rounded-xl shadow-md"
                alt={`slide-${idx}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main layout: sidebar + products */}
      <div className="mt-12 max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex gap-6 items-start">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 bg-white rounded-2xl shadow-md border border-gray-100 p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
            {filterPanel}
          </aside>

          {/* Products side */}
          <div className="flex-1 min-w-0">

            {/* Section heading + mobile filter button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold sm:text-3xl text-gray-800">Our Café Specials</h2>
                {filteredProducts && (
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              {/* Mobile filter trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md active:scale-95 transition-transform"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Product Grid */}
            {loading ? (
              <p className="text-center py-20 text-gray-600 text-lg">Loading...</p>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-24 text-gray-500">
                <div className="text-5xl mb-4">🍽️</div>
                <p className="text-xl font-semibold text-gray-700">No items found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 text-green-600 font-semibold text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 relative sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts?.map((product) => (
                  <Card
                    key={product._id}
                    shadow
                    className="p-3 hover:shadow-lg hover:scale-[1.02] transition-all bg-white rounded-xl"
                  >
                    <Link to={`/product/${product?._id}`}>
                      <div className="relative">
                        <Slider {...sliderSettings} className="rounded-lg">
                          {product?.product_image?.map((imgUrl, idx) => (
                            <div key={idx} className="w-full h-36 sm:h-56 lg:h-64">
                              <img
                                className="object-cover w-full h-full rounded-lg"
                                src={imgUrl}
                                alt={`Product ${idx + 1}`}
                              />
                            </div>
                          ))}
                        </Slider>
                        {/* Discount Ribbon */}
                        {product?.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow z-10">
                            {product?.discount}% OFF
                          </div>
                        )}
                      </div>

                      <div className="pt-3">
                        <div className="flex flex-col md:flex-row justify-between ">
                          <Typography className="font-semibold text-gray-800 text-sm sm:text-base ">
                            {product?.product_name?.split("#")[0]}
                          </Typography>
                          <Typography className="text-xs sm:text-sm text-green-700 font-medium">
                            {product?.product_category}
                          </Typography>
                        </div>

                        <Typography className="text-gray-500 text-xs sm:text-sm font-medium mt-2">
                          {product?.product_size}
                          {product?.quantity_measure}
                        </Typography>

                        {product?.total_products !== 0 && (
                          <Typography className="text-xs text-gray-600 mt-2">
                            Total: {product?.total_products}
                          </Typography>
                        )}

                        <Typography
                          className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2"
                          title={product?.product_description}
                        >
                          {product?.product_description?.length > 30
                            ? product?.product_description?.slice(0, 30) + "..."
                            : product?.product_description}
                        </Typography>

                        {product?.discount > 0 ? (
                          <div className="flex items-center font-bold gap-2 mt-3">
                            <Typography className="text-lg sm:text-xl text-red-500 font-bold">
                              ${(product?.product_price - (product?.product_price * product?.discount) / 100).toFixed(2)}
                            </Typography>
                            <Typography className="text-sm sm:text-base font-bold text-green-700 line-through">
                              ${product?.product_price}
                            </Typography>
                          </div>
                        ) : (
                          <div>
                            <Typography className="text-sm font-bold sm:text-base mt-3 text-green-700">
                              ${product?.product_price}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </Link>

                    <hr className="pt-1" />
                    <div className="pt-3 flex justify-center">
                      <Button
                        onClick={() => handleCart(product?._id)}
                        color={product?.outOfStock ? "red" : "green"}
                        disabled={product?.outOfStock}
                        size="sm"
                      >
                        {product?.outOfStock ? (
                          "Out of Stock"
                        ) : (
                          <span className="font-semibold flex items-center gap-2 px-3">
                            <ShoppingCart size={18} /> Add
                          </span>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            {/* drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl overflow-y-auto p-5 lg:hidden"
            >
              {filterPanel}
              <div className="mt-8 pt-4 border-t">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-transform"
                >
                  Show {filteredProducts?.length ?? 0} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default CafeItems;