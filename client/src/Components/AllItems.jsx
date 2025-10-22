import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addproducttoCart, getCartItems, getProducts } from "../redux/productSlice";
import { Card, Typography, Input, Button } from "@material-tailwind/react";
import Sidebar from "../Components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function AllItems({selectedCategory,onCategorySelect}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { products, loading } = useSelector((state) => state.product);
  const [search, setSearch] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const navigate=useNavigate();
  const [filters, setFilters] = useState({
    name: '',
    price: '',
    quantity: '',
    total: '',
    category: '',
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //       setImageIndex((prevIndex) => (prevIndex + 1));
  //   }, 1000); 

  //   return () => clearInterval(intervalId);
  // }, [imageIndex]);

  const filteredProducts = products?.filter((item) => {
    return (
      item.product_category.toLowerCase().includes(selectedCategory?.toLowerCase())
    );
  });
  const handleCart=async(productId)=>{
    if(!userInfo){
        navigate('/login')
    }else{
        await dispatch(addproducttoCart({
            user_id: userInfo?.user_id,
            product_id: parseInt(productId),
            quantity: 1
          }))
        await dispatch(getCartItems({user_id:userInfo?.user_id}))
    }
}

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="">
      <div className="">
        <div className="flex justify-between items-center">
            <h1 className="mb-10 ml-2 font-bold md:text-3xl text-xl">Fresh Items <span className="text-x">({filteredProducts?.length})</span></h1>
            <div className="mb-8">
            
                <span className="p-2 w-full flex gap-2 items-center">
                <p className="underline">{selectedCategory}</p>
                <Button onClick={()=>onCategorySelect('')} color="red" className="border-b-blue-gray-400 border-2">View All</Button>
                </span>
            </div>
        </div>
       
        {loading ? (
          <div className="text-center py-20 text-lg font-medium text-gray-700">Loading...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 grid-cols-1">
            {filteredProducts?.length === 0 ? (
              <Typography variant="paragraph" className="text-center col-span-full">
                No products found.
              </Typography>
            ) : (
            filteredProducts?.slice(0, 3)?.filter((product)=>product?.product_category?.toLowerCase().includes(selectedCategory?.toLowerCase())).map((product) => (
                <Card key={product?._id} shadow className="p-4 hover:shadow-xl transition">
                  <Link to={`/product/${product?._id}`} >
                  
                  <Slider {...settings} className="product-slider">
                    {product?.product_image?.map((imgUrl, idx) => (
                      <div key={idx} className="w-full  h-60 lg:h-80">
                        <img
                          className="object-fill w-full md:h-full rounded-md"
                          src={imgUrl}
                          alt={`Product Image ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </Slider>
                  <style>{`
                   

                    /* Position arrows slightly inside */
                    .product-slider .slick-prev {
                      left: 10px !important;
                      z-index: 1;
                      font-size: 24px;
                    }

                    .product-slider .slick-next {
                      right: 10px !important;
                      z-index: 1;
                      font-size: 24px;
                    }
                  `}</style>
                  </Link>
                  <div className="flex justify-between items-center">
                  <Typography variant="h5" className="font-semibold text-[#3c3c3c]">
                    {product?.product_name}
                  </Typography>
                  <Typography color="blue-gray" className="mt-2 font-bold text-sm">
                    {product?.product_category}
                  </Typography>
                  </div>
                 
                  <Typography className="text-sm text-gray-600 font-semibold mt-1">
                    {product?.product_quantity}{product?.quantity_measure}
                  </Typography>
                  {product?.total_quantity!=0 && <Typography className="text-sm text-gray-600 mt-1">
                    Total Items: {product?.total_quantity}
                  </Typography>}
                  <Typography className=" mt-1">
                    {product?.product_description}
                  </Typography>
                  <Typography className="text-2xl text-green-600 font-bold mt-5">
                    ${product?.product_price}
                  </Typography>
                  <Button onClick={()=>handleCart(product?.product_id)} className="mt-3" color="red" size="sm" >
                      Add to Cart
                    </Button>
                  
                </Card>
              ))
            )}

          </div>
        )}
        <div className="flex justify-end mt-3">
                <Link to='/allitems'><button  className="underline-offset-1 underline p-2 text-green-600">See More</button></Link>
            </div>
      </div>
    </div>
  );
}

export default AllItems;
