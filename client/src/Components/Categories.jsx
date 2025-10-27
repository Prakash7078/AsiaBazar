import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addproducttoCart, getCartItems, getProducts } from "../redux/productSlice";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CategoryScroller from "./CategoryScroller";
import { TypeAnimation } from "react-type-animation";
import { ShoppingCart } from "lucide-react";

function Categories() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectcategory] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { products, loading } = useSelector((state) => state.product);
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
    dispatch(getProducts());
  }, [dispatch, selectedCategory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const filteredProducts = products?.filter((item) => {
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

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-5 items-center mt-24 justify-between px-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex flex-col md:flex-row items-center justify-center">
          Welcome to{" "}
          <TypeAnimation
            sequence={["ASIA BAZAR", 2000, "STORE", 2000]}
            speed={50}
            wrapper="span"
            repeat={Infinity}
            className="inline-block ml-2 text-green-600"
          />
        </h1>
        <Link to="/menu">
          <Button color="green" className="mt-4 md:mt-0 font-semibold">
            SEE MENU
          </Button>
        </Link>
      </div>

      {/* Category Scroller */}
      <div className="mt-8">
        <CategoryScroller onCategorySelect={setSelectcategory} />
      </div>

      {/* Filters */}
      <div className="pt-10 mx-auto mb-8 px-4 max-w-6xl ">
        <h1 className="mb-10 ml-2 font-bold text-3xl">Fresh Items</h1>
        <div className="flex  md:justify-between md:flex-row flex-col items-center">
          <span className="p-2 ">
            <Input
              label="Search Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              variant="outlined"
              size="sm"
              color="brown"
              className="bg-white"
            />
          </span>

          <span className="p-2">
            <Input
              label="Search Price"
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              variant="outlined"
              size="sm"
              color="brown"
              className="bg-white"
            />
          </span>

          <span className="p-2 ">
            <Input
              label="Search Quantity"
              name="quantity"
              value={filters.quantity}
              onChange={handleFilterChange}
              variant="outlined"
              size="sm"
              color="brown"
              className="bg-white"
            />
          </span>

          <span className="p-2 ">
            <Input
              label="Search Total"
              name="total"
              value={filters.total}
              onChange={handleFilterChange}
              variant="outlined"
              size="sm"
              color="brown"
              className="bg-white"
            />
          </span>

          <span className="p-2 ">
            <Input
              label="Search Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              variant="outlined"
              size="sm"
              color="brown"
              className="bg-white"
            />
          </span>

          <span className="p-2 ">
            <Button
              onClick={() => setSelectcategory("")}
              color="red"
              className="border-b-blue-gray-400 border-2"
            >
              All
            </Button>
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-lg font-medium text-gray-700">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-3 md:px-8">
          {filteredProducts?.length === 0 ? (
            <Typography
              variant="paragraph"
              className="text-center col-span-full text-gray-600 mt-6"
            >
              No products found.
            </Typography>
          ) : (
            filteredProducts
              .map((product) => (
                <Link to={`/product/${product?._id}`}  
                key={product._id}>
                <Card
                  shadow
                  className="p-3 hover:shadow-lg hover:scale-[1.02] transition-all bg-white rounded-xl"
                >
                  
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

                    <div className="mt-3">
                      <Typography className="text-lg sm:text-xl text-red-600 font-bold">
                        ${product?.product_price}
                      </Typography>
                      
                    </div>
                    <hr className="pt-1"/>
                    <div className="pt-3 flex justify-center">
                      <Button
                          onClick={() => handleCart(product?._id)}
                          color="green"
                          size="sm"
                          className="font-semibold flex items-center gap-2 px-3"
                        >
                          <ShoppingCart size={18} />
                          Add
                        </Button>
                    </div>
                    
                  </div>
                </Card>
                </Link>

              ))
          )}
        </div>
      )}
    </div>
  );
}

export default Categories;
