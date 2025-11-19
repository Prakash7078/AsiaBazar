import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { ShoppingCart, ChevronDown } from "lucide-react";
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

  const images = [
    "/Images/chickenrice.jpeg",
    "/Images/cold_drinks.jpeg",
    "/Images/gulab.jpeg",
    "/Images/meals.jpeg",
    "/Images/parata.jpeg",
    "/Images/rasa.jpeg",
    "/Images/sweets1.jpeg",
  ];

  const categories = [
    "All",
    "Appetizers",
    "Deserts",
    "Drinks & Juices",
    "Shawarmas & Gros",
    "Specialities",
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

  // ✅ Filtering by name + category
  const filteredProducts = cafeItems?.filter((item) => {
    const matchSearch = item.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All" ||
      item.product_name?.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchSearch && matchCategory;
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

  return (
    <div className="min-h-screen pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-14 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm md:mt-24 mt-20 max-w-6xl mx-auto">
        {/* Text Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl md:text-5xl h-16 font-extrabold text-gray-800 leading-tight">
            Welcome to{" "}
            <TypeAnimation
              sequence={["ASIA BAZAR", 2000, "CAFÉ", 2000]}
              speed={60}
              wrapper="span"
              repeat={Infinity}
              className="inline-block text-green-600 drop-shadow-md"
            />
          </h1>
          <p className="mt-4 text-gray-600 md:text-lg max-w-md">
            Experience freshly cooked meals, drinks, and sweets — crafted with
            love and delivered with care.
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
        <div className="relative z-0 w-48 h-48 md:w-64 md:h-64 flex justify-center items-center">
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

      {/* ✅ Filter + Search Section */}
      <div className="mt-12 px-6 max-w-4xl mx-auto flex flex-col sm:flex-row-reverse items-center gap-4">
        {/* Dropdown Filter */}
        <div className="relative w-full sm:w-1/2">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-xl shadow-md focus:outline-none hover:shadow-lg transition-all duration-200"
          >
            <span className="font-semibold text-base">
              {selectedCategory}
            </span>
            <ChevronDown
              className={`w-5 h-5 transform transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10 animate-fadeIn">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-100 hover:text-green-600 ${
                    cat === selectedCategory
                      ? "bg-green-50 font-semibold text-green-600"
                      : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <Input
          label="Search for your favorite item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color="green"
          variant="outlined"
          size="lg"
          className="bg-white shadow-sm rounded-lg "
        />
      </div>

      {/* Product Grid */}
      <div className="mt-10 px-4 md:px-10 max-w-7xl mx-auto">
        <h2 className="font-bold text-3xl mb-6 text-gray-800">
          Our Café Specials
        </h2>

        {loading ? (
          <p className="text-center py-20 text-gray-600 text-lg">Loading...</p>
        ) : filteredProducts?.length === 0 ? (
          <p className="text-center py-20 text-gray-600 text-lg">
            No items found.
          </p>
        ) : (
          <div className="grid grid-cols-2 relative sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                shadow
                className="p-3 hover:shadow-lg hover:scale-[1.02] transition-all bg-white rounded-xl"
              >
                <Link to={`/product/${product?._id}`}>
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
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                          {product?.discount}% OFF
                        </div>
                      )}
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

                    {product?.discount>0 ?<div className="flex items-center gap-2 mt-3">
                        <Typography className="text-lg sm:text-xl text-red-500 font-bold">
                          ${ (product?.product_price - (product?.product_price * product?.discount)/100).toFixed(2)}
                        </Typography>
                        <Typography className="text-sm sm:text-base  line-through">
                          ${product?.product_price}
                        </Typography>
                        {/* <Typography className="text-sm  font-medium">
                          ({item?.discount}% OFF)
                        </Typography> */}
                      </div>:<div>
                        <Typography className="text-sm sm:text-base mt-3">
                            ${product?.product_price}
                          </Typography>
                      </div>}
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
  );
}

export default CafeItems;
