import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addproducttoCart, getCartItems, getProduct, getProducts } from '../redux/productSlice';
import { Button, Card, Rating, Switch, Typography } from "@material-tailwind/react";
import { FaPhone } from "react-icons/fa";
import ImageSlider from '../Components/ImageSlider';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function ProductScreen() {
    const dispatch=useDispatch();
    const params=useParams();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const {productId}=params;
    const[product,setProduct]=useState([]);
    const { products, loading } = useSelector((state) => state.product);

    const navigate=useNavigate();
    useEffect(() => {
        dispatch(getProducts());
      }, [dispatch]);
    useEffect(()=>{
        const fetchProduct=async()=>{
            const res=await dispatch(getProduct(productId));
            setProduct(res.payload);
        }
        fetchProduct();
    },[dispatch,productId])
    const handleCart=async()=>{
        if(!userInfo){
            navigate('/login')
        }else{
            await dispatch(addproducttoCart({
                user_id: userInfo?._id,
                product_id: parseInt(productId),
                quantity: 1
              }))
            await dispatch(getCartItems({user_id:userInfo?._id}))
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
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
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
    <div className="mx-auto max-w-7xl px-4 md:px-8 2xl:px-16 mt-24">
            <div className=" grid-cols-9 items-start gap-x-10 pb-10  grid lg:pb-14 xl:gap-x-14 2xl:pb-20">
            {product?.product_image && (
            <div className="col-span-5">
                <ImageSlider data={product?.product_image} />
            </div>
            )}


            <div className="col-span-4 pt-3 lg:pt-10 ">
                {/* <div className="flex justify-end md:justify-start mb-10"><Button className={`${selectroom ? "bg-brown-300":"bg-white border-black border-b-2"} text-black`} onClick={()=>setSelectroom(!selectroom)}>Select Room</Button></div> */}

                <div className="m-4 pb-7">
                    <div className='flex gap-2 items-center'>
                        <h2 className="text-heading mb-3.5 text-lg font-bold md:text-xl lg:text-2xl 2xl:text-3xl">
                        {product?.product_name} 
                        </h2>
                        <h1 className='text-heading mb-3.5 text-md font-bold md:text-xl lg:text-lg '>({product?.product_category})</h1>
                    </div>
                    <div className="mb-4 flex gap-3"><Rating value={5} /><span className="text-gray-500">604 Reviews</span></div>
                    <p className="text-body text-sm leading-6 lg:text-base lg:leading-8">
                    {product?.product_description}
                    </p>
                    <div className="text-heading pr-2 mt-5 text-base font-bold md:pr-0  text-blue-gray-500 ">
                        <span className="text-green-500 text-2xl">${product?.product_price}</span>
                    </div>
                    <div className="flex items-center text-blue-gray-400 mt-3">
                        <FaPhone/> <span className=" underline ml-2"> <a href='tel:+1 (316) 612-2700'>+1 (316) 612-2700</a></span>
                    </div>
                
                </div>
            
                <div className="py-3 m-4">
                    <ul className="space-y-5 pb-1 text-sm">
                    <li>
                        <span className="text-heading inline-block pr-2 font-semibold">
                        Size:
                        </span>
                        <a
                        className="hover:text-heading transition hover:underline"
                        href="#"
                        >
                        {product?.product_quantity} {product?.quantity_measure}
                        </a>
                    </li>
                    <li className="productTags">
                        <span className="text-heading inline-block pr-2 font-semibold">
                        Available Items
                        </span>
                        <a
                        className="hover:text-heading inline-block pr-1.5 transition last:pr-0 hover:underline"
                        href="#"
                        >
                        {product?.product_quantity>0?product?.product_quantity:<h1 className="text-red-400 font-bold">Sold Out</h1>}
                        </a>
                    </li>

                    </ul>
                </div>
                <div className='flex justify-end md:justify-start ml-4'>
                    <Button onClick={handleCart} className='bg-red-700 mt-10 '>Add to Cart</Button>
                </div>
                </div>
                
            </div>
            <div className='md:mt-36'>
                <h1 className='text-2xl font-bold underline'>Related Products</h1>
                <div className="grid gap-6 mt-10 md:grid-cols-3 lg:grid-cols-4 grid-cols-1">
                    {products?.length === 0 ? (
                    <Typography variant="paragraph" className="text-center col-span-full">
                        No products found.
                    </Typography>
                    ) : (
                    products?.filter((item)=>item.product_category?.toLowerCase()===product?.product_category?.toLowerCase()).map((product) => (
                        <Card key={product?._id} shadow className="p-4 hover:shadow-xl transition">
                        <Link to={`/product/${product?._id}`} >
                        
                        <Slider {...settings} className="product-slider">
                            {product?.product_image?.map((imgUrl, idx) => (
                            <div key={idx} className="w-full  h-60 lg:h-60">
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
            </div>
        </div>
  )
}

export default ProductScreen