import { useEffect, useState } from "react";
import ab from '/Images/asiabazar.png'
import { TiThMenu } from "react-icons/ti";
import { FcAbout, FcHome, FcSearch } from "react-icons/fc";
import { Link as Route, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdShoppingCart } from "react-icons/md";

// import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import axios from "axios";
import {
  Badge,
  Avatar,
  Dialog,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { FiLogOut } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
// import { BsChatTextFill } from "react-icons/bs";
import Login from "../pages/Login";
import { BASE_URL } from "../config/url";
import { getCartItems } from "../redux/productSlice";
function Navbar() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((cur) => !cur);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { cartItems } = useSelector((state) => state.product);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    dispatch(getCartItems({user_id:userInfo?._id}));
  },[dispatch,userInfo?._id]);
  const handleSignout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };
  // bg-[#fff3e0]
  const handleSearch = () => {
    if (userInfo) {
      navigate(`/${search}`);
    } else {
      navigate("/login");
    }
    setSearch("");
  };
  return (
    <div className="shadow-md z-50 fixed top-0 left-0 right-0 flex items-center justify-between py-4 sm:px-8 max-w-7xl mx-auto px-4 backdrop-blur-md">
      <div className="flex gap-20">
        <Route to="/">
        <div className="">
          <img
              className="sm:w-15 border-2 rounded-md sm:h-10 w-14 h-10 xl:h-14 xl:w-20 col-span-2 cursor-pointer"
              src={ab}
              alt="logo"
            />
        </div>
         
        </Route>

        {/* <div className="hidden  md:flex items-center gap-2 border-b-2 border-blue-600">
          <input
            className="bg-transparent font-bold outline-none text-white px-2"
            placeholder="Search Club"
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
          />
          <FcSearch
            className="cursor-pointer"
            color="white"
            size={25}
            onClick={handleSearch}
          />
        </div> */}
      </div>

      <div className="md:hidden flex items-center gap-3 justify-center">
      {cartItems?.length > 0 ? (
            <Route to='/mycart'>
             <Badge
              content={cartItems?.length}
              overlap="circular"
              placement="top-end"
              className="bg-red-500 text-white cursor-pointer"
            >
              <MdShoppingCart color="black" size={25} />
            </Badge>
            </Route>
            ) : (
              <MdShoppingCart color="black" size={25}/>
            )}
        {!isMenuOpen ? (
          <TiThMenu
            size={25}
            color="brown"
            className={`${isMenuOpen ? "text-cyan-500" : "text-gray-500"}`}
            onClick={toggleMenu}
          />
        ) : (
          <RxCross2 color="brown" size={25} onClick={toggleMenu} />
        )}
        <div className="bg-gradient-to-r from-green-100  to-green-50 fixed left-0 px-4  w-full top-16 z-50 ">
          <ul
            className={`${
              isMenuOpen ? "visible" : "hidden"
            } font-semibold  flex flex-col gap-5 py-5`}
          >
            {userInfo && userInfo.admin && (
              <li onClick={toggleMenu}>
                <Route to={`/admin`}>
                  {/* <IconButton
                    variant="outlined"
                    color="white"
                    className="rounded-full mr-3"
                  >
                    <img src={dash} alt="dash" />
                  </IconButton> */}
                  Dashboard
                </Route>
              </li>
            )}
            
            
            <li className="cursor-pointer">
              <Link
                onClick={toggleMenu}
                smooth={true}
                duration={1000}
                to="#category"
              >
                {/* <IconButton
                  variant="outlined"
                  color="white"
                  className="rounded-full mr-3"
                >
                  <img src={clu} alt="clu" />
                </IconButton> */}
                Categories
              </Link>
            </li>
            <hr />
            {userInfo && (
              <div>
                <Route to="/profile">
                  <div onClick={toggleMenu} className="flex items-center gap-4">
                    {notifications?.length > 0 ? (
                      <Badge
                        overlap="circular"
                        placement="bottom-end"
                        className="bg-green-600"
                      >
                        <IoPersonCircleOutline className="bg-white rounded-full" size="40"/>
                        
                      </Badge>
                    ) : (
                      <IoPersonCircleOutline className="bg-white rounded-full" size="40"/>
                    )}
                    <h1>My Profile</h1>
                  </div>
                </Route>
              </div>
             
            )}

            {!userInfo ? (
              <Button
                className="bg-brown-400 mx-3"
                onClick={() => {
                  toggleMenu();
                  handleOpen();
                }}
              >
                Log In
              </Button>
            ) : (
              <div
                className="bg-brown-400 text-black rounded-md flex justify-between items-center px-3 py-2"
                onClick={handleSignout}
              >
                <span>Logout</span>
                <FiLogOut color="black" />
              </div>
            )}
          </ul>
        </div>
      </div>

      <div className="hidden md:flex gap-4 items-center">
        {userInfo && userInfo.admin && (
              <div onClick={toggleMenu} className="mr-2 underline">
                <Route to={`/admin`}>
                  {/* <IconButton
                    variant="outlined"
                    color="white"
                    className="rounded-full"
                  >
                    <img src={dash} alt="dash" />
                  </IconButton> */}
                  Dashboard
                </Route>
              </div>
            )}
        {cartItems?.length > 0 ? (
            <Route to='/mycart'>
             <Badge
              content={cartItems?.length}
              overlap="circular"
              placement="top-end"
              className="bg-red-500 text-white cursor-pointer"
            >
              <MdShoppingCart color="black" size={25} />
            </Badge>
            </Route>
            ) : (
              <MdShoppingCart color="black" size={25}/>
            )}

        {userInfo && userInfo.image != "" && (
          <Route to="/profile">
            {notifications?.length > 0 ? (
              <Badge
                overlap="circular"
                placement="bottom-end"
                className="bg-green-600"
              >
                <IoPersonCircleOutline className="bg-white rounded-full" size="40"/>
              </Badge>
            ) : (
              <IoPersonCircleOutline className="bg-white rounded-full" size="40"/>
            )}
          </Route>
        )}

        {!userInfo ? (
          <Button className="bg-brown-400" onClick={handleOpen}>
            Log In
          </Button>
        ) : (
          <button
            className=" inline-flex items-center rounded-full space-x-2 p-3 bg-primary text-secondary "
            onClick={handleSignout}
          >
            <FiLogOut />
          </button>
        )}
      </div>

      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Login value={handleOpen} />
      </Dialog>
    </div>
  );
}

export default Navbar;
