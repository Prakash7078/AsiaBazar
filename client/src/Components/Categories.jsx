import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addproducttoCart, getCartItems, getStoreItems } from "../redux/productSlice";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryScroller from "./CategoryScroller";
import { TypeAnimation } from "react-type-animation";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

function Categories() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectcategory] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { storeItems, loading } = useSelector((state) => state.product);
  const [filters, setFilters] = useState({
    name: "",
    price: "",
    quantity: "",
    total: "",
    category: selectedCategory,
  });
  const navigate = useNavigate();

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: selectedCategory }));
    dispatch(getStoreItems());
  }, [dispatch, selectedCategory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const filteredProducts = storeItems?.filter((item) => {
    return (
      item.product_name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.product_price.toString().includes(filters.price) &&
      `${item.product_size}${item.quantity_measure}`
        .toLowerCase()
        .includes(filters.quantity.toLowerCase()) &&
      item.total_products.toString().includes(filters.total) &&
      item.product_category.toLowerCase().includes(filters.category.toLowerCase())
    );
  });

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
  const [index, setIndex] = useState(0);

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

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-8 py-12 bg-gradient-to-br from-green-50 via-white to-green-50 rounded-3xl md:shadow-md md:mt-24 mt-16 ">
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

      {/* Filters */}
      <div className="pt-10 mx-auto mb-8 px-4 max-w-6xl ">
        <h1 className="mb-10 ml-2 font-bold text-3xl">Fresh Items</h1>
        <div className="flex flex-col md:flex-row  items-center justify-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
          <Input
            label="Search Name"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            variant="outlined"
            size="md"
            color="green"
            className="bg-white w-full sm:w-48"
          />

          <Input
            label="Search Price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            variant="outlined"
            size="md"
            color="green"
            className="bg-white w-full sm:w-48"
          />

          <Input
            label="Search Quantity"
            name="quantity"
            value={filters.quantity}
            onChange={handleFilterChange}
            variant="outlined"
            size="md"
            color="green"
            className="bg-white w-full sm:w-48"
          />

          <Input
            label="Search Total"
            name="total"
            value={filters.total}
            onChange={handleFilterChange}
            variant="outlined"
            size="md"
            color="green"
            className="bg-white w-full sm:w-48"
          />

          <Input
            label="Search Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            variant="outlined"
            size="md"
            color="green"
            className="bg-white w-full sm:w-48"
          />

          <Button
            onClick={() => setSelectcategory("")}
            color="red"
            size="md"
            className="w-full sm:w-32 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            All
          </Button>
        </div>

      </div>
      {/*discount products*/}
      {/* ---------- RELATED PRODUCTS SECTION ---------- */}
      <div className="mt-20 px-3 md:px-8 ">
        {/* <h1 className="text-2xl font-bold underline mb-6">Discount Products</h1> */}

        {filteredProducts?.length === 0 ? (
          <Typography variant="paragraph" className="text-center">
            No products found.
          </Typography>
        ) : (
          <div className="overflow-x-auto pb-4 relative">
            <div className="flex gap-6 min-w-max">
              {filteredProducts.filter(product=>product.discount>0)
                .map((item) => (
                  <Card
                    key={item?._id}
                    shadow
                    className="p-4 w-64 sm:w-72 hover:shadow-xl transition flex-shrink-0"
                  >
                    <Link to={`/product/${item?._id}`}>
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
                    </Link>
                    {/* Discount Ribbon */}
                      {item?.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                          {item.discount}% OFF
                        </div>
                      )}

                    <div className="mt-4">
                      <Typography
                        variant="h6"
                        className="font-semibold text-gray-800 truncate"
                      >
                        {item?.product_name}
                      </Typography>
                      <Typography className="text-gray-500 text-sm">
                        {item?.product_category}
                      </Typography>
                      <Typography className="text-gray-700 text-sm mt-1">
                        {item?.product_size}
                        {item?.quantity_measure}
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
                          ${ (item?.product_price - (item?.product_price * item?.discount)/100).toFixed(2)}
                        </Typography>
                        <Typography className="text-sm sm:text-base  line-through">
                          ${item?.product_price}
                        </Typography>
                        {/* <Typography className="text-sm  font-medium">
                          ({item?.discount}% OFF)
                        </Typography> */}
                      </div>
                     
                      
                    </div>
                      <hr/>
                      <div className="pt-3 flex justify-center">
                      <Button
                          onClick={() => handleCart(item?._id)}
                          color={item?.outOfStock?'red':'green'}
                          disabled={item?.outOfStock}
                          size="sm"
                          className=""
                        >
                        {item?.outOfStock ? "Out of Stock" : <span className="font-semibold flex items-center gap-2 px-3">
                            <ShoppingCart size={18} />
                          Add</span>}
                          
                        </Button>
                    </div>
                    </div>
                  </Card>
                ))}
            </div>
            
          </div>
        )}

        {/* Optional Scroll Indicator */}
        <div className="text-center text-gray-500 mt-3 text-sm">
          Scroll ➡️ to view more
        </div>

        <style>{`
          .product-slider .slick-prev {
            left: 5px !important;
            z-index: 1;
          }
          .product-slider .slick-next {
            right: 5px !important;
            z-index: 1;
          }

          /* Smooth horizontal scrolling */
          .overflow-x-auto {
            scroll-behavior: smooth;
          }

          /* Hide scrollbar for modern look */
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
      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-lg font-medium text-gray-700">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-2 mt-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3 md:px-8">
          {filteredProducts?.length === 0 ? (
            <Typography
              variant="paragraph"
              className="text-center col-span-full text-gray-600 mt-6"
            >
              No products found.
            </Typography>
          ) : (
            filteredProducts.filter(product=>product.discount===0)
              .map((product) => (
                <Card
                  key={product._id}
                  shadow
                  id="grocery"
                  className="p-3 hover:shadow-lg  hover:scale-[1.02] transition-all bg-white rounded-xl"
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
                    <div className="flex flex-col md:flex-row justify-between ">
                      <Typography className="font-semibold text-gray-800 text-sm sm:text-base ">
                        {product?.product_name}
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

                    <div>
                      <Typography className="text-lg sm:text-xl text-red-500 font-bold mt-3">
                        ${product?.product_price}
                      </Typography>
                      
                    </div>
                    </div>
                  </Link>

                  <hr className="pt-1"/>
                    <div className="pt-3 flex justify-center">
                    <Button
                          onClick={() => handleCart(product?._id)}
                          color={product?.outOfStock?'red':'green'}
                          disabled={product?.outOfStock}
                          size="sm"
                          className=""
                        >
                          {product?.outOfStock ? "Out of Stock" : <span className="font-semibold flex items-center gap-2 px-3">
                            <ShoppingCart size={18} />
                          Add</span>}
                          
                        </Button>
                    </div>
                    
                </Card>

              ))
          )}
        </div>
      )}
    </div>
  );
}

export default Categories;
