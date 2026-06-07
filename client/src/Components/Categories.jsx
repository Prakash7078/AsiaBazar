import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addproducttoCart, getCartItems, getStoreItems } from "../redux/productSlice";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryScroller from "./CategoryScroller";
import { TypeAnimation } from "react-type-animation";
import { ShoppingCart, SlidersHorizontal, X, Search, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import data from '../data.js';
import { getRecommendedProducts, smartFilterProducts } from "../utils/smartProductSearch";

function Categories() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectcategory] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { storeItems, cartItems, loading } = useSelector((state) => state.product);
  const [filters, setFilters] = useState({
    name: "",
    category: selectedCategory,
  });
  const navigate = useNavigate();

  // new filter states
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: selectedCategory }));
    dispatch(getStoreItems());
  }, [dispatch, selectedCategory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProducts = useMemo(() => smartFilterProducts(storeItems, {
    query: filters.name,
    category: filters.category,
    onlyDiscount,
    onlyInStock,
    onlyOutOfStock,
  }), [filters.name, filters.category, onlyDiscount, onlyInStock, onlyOutOfStock, storeItems]);

  const recommendedProducts = useMemo(() => getRecommendedProducts(storeItems, {
    cartItems,
    category: filters.category,
    limit: 5,
  }), [cartItems, filters.category, storeItems]);

  const handleCart = async (productId) => {
    if (!userInfo) {
      navigate("/login");
    } else {
      await dispatch(
        addproducttoCart({
          user_id: userInfo?._id,
          product_id: productId,
          quantity: 1,
        })
      );
      await dispatch(getCartItems({ user_id: userInfo?._id }));
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    "/Images/borcelle.jpeg",
    "/Images/cheese.jpeg",
    "/Images/chickenrice.jpeg",
    "/Images/cold_drinks.jpeg",
    "/Images/dryfruits.jpeg",
    "/Images/fish.jpeg",
    "/Images/freshmutton.jpeg",
    "/Images/frozen_veg.jpeg",
    "/Images/gulab.jpeg",
    "/Images/meals.jpeg",
    "/Images/meat.jpeg",
    "/Images/meat1.jpeg",
    "/Images/ogveg.jpeg",
    "/Images/parata.jpeg",
    "/Images/pulses.jpeg",
    "/Images/rasa.jpeg",
    "/Images/snacks.jpeg",
    "/Images/species.jpeg",
    "/Images/sweets1.jpeg",
    "/Images/vege1.jpeg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images.length]);

  const variants = {
    initial: { z: -200, opacity: 0, scale: 0.9 },
    animate: { z: 0, opacity: 1, scale: 1 },
    exit: { z: 200, opacity: 0, scale: 0.9 },
  };

  const activeFilterCount = [
    filters.name !== "",
    filters.category !== "",
    onlyDiscount,
    onlyInStock,
    onlyOutOfStock,
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setFilters({ name: "", category: "" });
    setSelectcategory("");
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
            placeholder='Try "spicy snacks under $5"'
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
          {filters.name && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, name: "" }))}
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

      {/* Category — from data.js */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
        <div className="flex flex-col gap-1">
          {/* All option */}
          <button
            onClick={() => { setFilters((prev) => ({ ...prev, category: "" })); setSelectcategory(""); }}
            className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${
              filters.category === ""
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            All
          </button>
          {data?.categories?.map((item) => (
            <button
              key={item?.id}
              onClick={() => { setFilters((prev) => ({ ...prev, category: item?.name })); setSelectcategory(item?.name); }}
              className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${
                filters.category === item?.name
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {item?.name}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen pb-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-12 bg-gradient-to-br from-green-50 via-white to-green-50 rounded-3xl md:shadow-md md:mt-24 mt-16">
        {/* Text Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl md:text-4xl h-16 font-extrabold text-gray-800 leading-tight">
            Welcome to{" "}
            <TypeAnimation
              sequence={["ASIA BAZAR", 2000, "YOUR STORE", 2000]}
              speed={60}
              wrapper="span"
              repeat={Infinity}
              className="inline-block text-green-600 drop-shadow-md"
            />
          </h1>
          <p className="mt-4 text-gray-600 md:text-lg text-md max-w-md">
            Discover fresh vegetables, food, fruits, meat and groceries — delivered straight from our store to your home.
          </p>

          <ScrollLink to="grocery" smooth={true} duration={800}>
            <Button
              color="green"
              className="mt-6 font-semibold text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Explore Menu
            </Button>
          </ScrollLink>
        </div>

        {/* Animated Image Section */}
        <div className="relative z-0 w-40 h-40 md:w-56 md:h-56 flex justify-center items-center">
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
              className="absolute w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Category Scroller */}
      <div className="md:mt-8">
        <CategoryScroller onCategorySelect={setSelectcategory} />
      </div>

      {/* Main layout: sidebar + content */}
      <div className="mt-10 max-w-7xl mx-auto px-3 md:px-6">
        <div className="flex gap-6 items-start">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 bg-white rounded-2xl shadow-md border border-gray-100 p-5 max-h-[calc(100vh-7rem)] overflow-y-auto">
            {filterPanel}
          </aside>

          {/* Right side: discount row + grid */}
          <div className="flex-1 min-w-0">

            {/* Section heading + mobile filter button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-bold sm:text-3xl text-gray-800">Fresh Items</h1>
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

            {recommendedProducts.length > 0 && (
              <div className="mb-12 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-xl text-gray-800">✨ Smart Picks For You</h2>
                    <p className="text-sm text-gray-500">Based on your cart, category, discounts, and availability.</p>
                  </div>
                </div>
                <div className="overflow-x-auto pb-3">
                  <div className="flex gap-5 min-w-max">
                    {recommendedProducts.map((item) => (
                      <Card
                        key={item?._id}
                        shadow
                        className="p-4 w-56 sm:w-64 hover:shadow-xl transition flex-shrink-0 bg-white"
                      >
                        <Link to={`/product/${item?._id}`}>
                          <img
                            className="object-cover w-full h-36 rounded-md"
                            src={item?.product_image?.[0]}
                            alt={item?.product_name}
                          />
                          <div className="mt-3">
                            <Typography className="font-semibold text-gray-800 truncate">
                              {item?.product_name}
                            </Typography>
                            <Typography className="text-xs text-green-700 font-medium">
                              {item?.product_category}
                            </Typography>
                            <Typography className="text-lg text-red-500 font-bold mt-2">
                              ${item?.discount > 0
                                ? (item?.product_price - (item?.product_price * item?.discount) / 100).toFixed(2)
                                : item?.product_price}
                            </Typography>
                          </div>
                        </Link>
                        <Button
                          onClick={() => handleCart(item?._id)}
                          color={item?.outOfStock ? "red" : "green"}
                          disabled={item?.outOfStock}
                          size="sm"
                          className="mt-3 w-full"
                        >
                          {item?.outOfStock ? "Out of Stock" : "Add"}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Discounted Products horizontal scroll */}
            {filteredProducts?.filter(product => product?.discount > 0).length > 0 && (
              <div className="mb-12">
                <h2 className="font-bold text-xl text-gray-700 mb-4">🏷️ On Sale</h2>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-6 min-w-max">
                    {filteredProducts?.filter(product => product?.discount > 0).map((item) => (
                      <Card
                        key={item?._id}
                        shadow
                        className="p-4 w-64 sm:w-72 hover:shadow-xl transition flex-shrink-0"
                      >
                        <Link to={`/product/${item?._id}`}>
                          <div className="relative">
                            <Slider {...settings} className="product-slider">
                              {item?.product_image?.map((imgUrl, idx) => (
                                <div key={idx} className="w-full h-48 sm:h-56">
                                  <img
                                    className="object-cover w-full h-full rounded-md"
                                    src={imgUrl}
                                    alt={`Product Image ${idx + 1}`}
                                  />
                                </div>
                              ))}
                            </Slider>
                            {/* Discount Ribbon */}
                            {item?.discount > 0 && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow z-10">
                                {item.discount}% OFF
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="mt-4">
                          <Typography variant="h6" className="font-semibold text-gray-800 truncate">
                            {item?.product_name}
                          </Typography>
                          <Typography className="text-gray-500 text-sm">
                            {item?.product_category}
                          </Typography>
                          <Typography className="text-gray-700 text-sm mt-1">
                            {item?.product_size}{item?.quantity_measure}
                          </Typography>
                          {item?.total_products !== 0 && (
                            <Typography className="text-gray-600 text-sm">
                              Total Items: {item?.total_products}
                            </Typography>
                          )}
                          <Typography className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {item?.product_description?.length > 50
                              ? item?.product_description?.slice(0, 50) + "..."
                              : item?.product_description}
                          </Typography>
                          <div className="mt-3">
                            <div className="flex items-center gap-2">
                              <Typography className="text-lg sm:text-xl text-red-500 font-bold">
                                ${(item?.product_price - (item?.product_price * item?.discount) / 100).toFixed(2)}
                              </Typography>
                              <Typography className="text-sm sm:text-base line-through">
                                ${item?.product_price}
                              </Typography>
                            </div>
                          </div>
                          <hr />
                          <div className="pt-3 flex justify-center">
                            <Button
                              onClick={() => handleCart(item?._id)}
                              color={item?.outOfStock ? 'red' : 'green'}
                              disabled={item?.outOfStock}
                              size="sm"
                            >
                              {item?.outOfStock ? "Out of Stock" : (
                                <span className="font-semibold flex items-center gap-2 px-3">
                                  <ShoppingCart size={18} /> Add
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="text-center text-gray-500 mt-3 text-sm">
                  Scroll ➡️ to view more
                </div>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-20 text-lg font-medium text-gray-700">
                Loading...
              </div>
            ) : filteredProducts?.filter(product => product?.discount === 0).length === 0 ? (
              <div className="text-center py-24 text-gray-500">
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-xl font-semibold text-gray-700">No products found.</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 text-green-600 font-semibold text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts?.filter(product => product?.discount === 0).map((product) => (
                  <Card
                    key={product?._id}
                    shadow
                    id="grocery"
                    className="p-3 hover:shadow-lg hover:scale-[1.02] transition-all bg-white rounded-xl"
                  >
                    <Link to={`/product/${product?._id}`} key={product._id}>
                      <Slider {...settings} className="rounded-lg">
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

                      <div className="pt-3">
                        <div className="flex flex-col md:flex-row justify-between">
                          <Typography className="font-semibold text-gray-800 text-sm sm:text-base">
                            {product?.product_name}
                          </Typography>
                          <Typography className="text-xs sm:text-sm text-green-700 font-medium">
                            {product?.product_category}
                          </Typography>
                        </div>

                        <Typography className="text-gray-500 text-xs sm:text-sm font-medium mt-2">
                          {product?.product_size}{product?.quantity_measure}
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

                        <div>
                          <Typography className="text-lg sm:text-xl text-red-500 font-bold mt-3">
                            ${product?.product_price}
                          </Typography>
                        </div>
                      </div>
                    </Link>

                    <hr className="pt-1" />
                    <div className="pt-3 flex justify-center">
                      <Button
                        onClick={() => handleCart(product?._id)}
                        color={product?.outOfStock ? 'red' : 'green'}
                        disabled={product?.outOfStock}
                        size="sm"
                      >
                        {product?.outOfStock ? "Out of Stock" : (
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

      <style>{`
        .product-slider .slick-prev {
          left: 5px !important;
          z-index: 1;
        }
        .product-slider .slick-next {
          right: 5px !important;
          z-index: 1;
        }
        .overflow-x-auto {
          scroll-behavior: smooth;
        }
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>

    </div>
  );
}

export default Categories;
