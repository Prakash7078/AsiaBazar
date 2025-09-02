import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Rings } from "react-loader-spinner";
import { Button } from "@material-tailwind/react";
import Slider from "react-slick";
import data from "../data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function CategoryScroller({onCategorySelect}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
//   const load = useSelector((state) => state.clubs.load);
//   const checkLogin = (name) => {
//     if (!userInfo) {
//       navigate("/login");
//     } else {
//       navigate(`/${name}`);
//     }
//   };
 
//   if (load) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-[#fff3e0]">
//         <Rings
//           height="80"
//           width="80"
//           color="#21BF73"
//           radius="6"
//           wrapperStyle={{}}
//           wrapperClass=""
//           visible={true}
//           ariaLabel="rings-loading"
//         />
//       </div>
//     );
//   }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
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
    // <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay:0.1  }}>
    <div>
      {data?.categories?.length > 0 && (
        <div id="#category" className=" py-20 pt-5 ">
          {/* <h1 className="font-bold px-2 text-2xl md:text-4xl text-center ">
            Choose your clubs based on categories
          </h1> */}

          <div className="md:mx-10 mx-6 mt-16">
            <Slider {...settings} className="product-slider-2">
              {data?.categories?.map((product, index) => {
                return (
                    <div
                      key={index}
                    //   onClick={() => checkLogin(product.name)}
                      className="m-3  "
                    >
                    <div onClick={()=>onCategorySelect(product?.name)} className="m-3 flex flex-col cursor-pointer items-center justify-center">
                        <img
                            src={product?.image}
                            className="h-24 object-cover w-28 rounded-full"
                            alt={product.id}
                        />
                        <h1 className="font-bold">{product.name}</h1>

                    </div>
                    </div>
                );
              })}
            </Slider>
            <style>{`
            
                  /* Left Arrow */
                  .product-slider-2 .slick-prev:before {
                    color: #9C1137;
                  }

                  /* Right Arrow */
                  .product-slider-2 .slick-next:before {
                    color: #9C1137;
                  }
                `}</style>
          </div>
        </div>
      )}
    </div>

    // </motion.div>
  );
}

export default CategoryScroller;