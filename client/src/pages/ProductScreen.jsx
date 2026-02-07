import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addproducttoCart, getCartItems, getProduct, getProducts } from '../redux/productSlice';
import { Button, Card, Rating, Typography } from "@material-tailwind/react";
import { FaPhone } from "react-icons/fa";
import ImageSlider from '../Components/ImageSlider';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShoppingCart } from 'lucide-react';

function ProductScreen() {
  const dispatch = useDispatch();
  const params = useParams();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { productId } = params;
  const [product, setProduct] = useState([]);
  const { products, loading } = useSelector((state) => state.product);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await dispatch(getProduct(productId));
      setProduct(res.payload);
    };
    fetchProduct();
  }, [dispatch, productId]);

  const handleCart = async () => {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8 mt-24">
      {/* ---------- PRODUCT MAIN SECTION ---------- */}
      <div className="flex flex-col lg:flex-row gap-10 pb-10">
        {/* Left: Product Images */}
        <div className="w-full lg:w-1/2  ">
          {product?.product_image && (
            <div className="sticky top-24">
              <ImageSlider data={product?.product_image} />
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
              {product?.product_name?.split("#")[0]}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Category: <span className="font-semibold">{product?.product_category} {product?.product_name?.split("#")[1]? '#'+product?.product_name?.split("#")[1]:''}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Rating value={5} />
            <span className="text-gray-600 text-sm">10 Reviews</span>
          </div>

          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            {product?.product_description}
          </p>

          <div className="text-green-600 font-bold text-3xl">
            ${product?.product_price}
          </div>

          <div className="flex items-center text-blue-gray-400 mt-2">
            <FaPhone />
            <a href="tel:+1 (316) 612-2700" className="ml-2 underline">
              +1 (316) 612-2700
            </a>
          </div>

          <ul className="space-y-3 text-sm sm:text-base mt-5">
            <li>
              <span className="font-semibold text-gray-800">Size:</span> {product?.product_size} {product?.quantity_measure}
            </li>
            {/* <li>
              <span className="font-semibold text-gray-800">Availability:</span>{" "}
              {product?.total_products >=0 ? (
                <span className="text-green-600 font-semibold">In Stock ({product?.total_products})</span>
              ) : (
                <span className="text-red-500 font-semibold">Sold Out</span>
              )}
            </li> */}
          </ul>
          <div className="pt-3 flex justify-center sm:justify-start text-center ">
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
          
        </div>
      </div>

      {/* ---------- RELATED PRODUCTS SECTION ---------- */}
      <div className="mt-20">
        <h1 className="text-2xl font-bold underline mb-6">Related Products</h1>

        {products?.length === 0 ? (
          <Typography variant="paragraph" className="text-center">
            No products found.
          </Typography>
        ) : (
          <div className="overflow-x-auto pb-4 relative">
            <div className="flex gap-6 min-w-max">
              {products
                ?.filter((item) => {
                  // If main product is in "cafe" category, filter by product_name containing '#DRINKS'
                  if (product?.product_category?.toLowerCase() === "cafe") {
                    return item.product_name?.toLowerCase().includes(product?.product_name?.split("#")[1]?.toLowerCase());
                  } else {
                    // Otherwise, filter by matching category
                    return (
                      item.product_category?.toLowerCase() ===
                      product?.product_category?.toLowerCase()
                    );
                  }
                })
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
                        {item?.product_name?.split("#")[0]}
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
                      {item?.discount>0 ? 
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <Typography className="text-lg sm:text-xl text-red-500 font-bold">
                            ${ (item?.product_price - (product?.product_price * product?.discount)/100).toFixed(2)}
                          </Typography>
                          <Typography className="text-sm sm:text-base  line-through">
                            ${item?.product_price}
                          </Typography>
                          <Typography className="text-sm  font-medium">
                            ({item?.discount}% OFF)
                          </Typography>
                        </div>
                      
                        
                      </div>:
                      <div>
                          <Typography className="text-lg sm:text-xl text-red-500 font-bold mt-3">
                            ${item?.product_price}
                          </Typography>
                      
                      </div>}
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

    </div>
  );
}

export default ProductScreen;
