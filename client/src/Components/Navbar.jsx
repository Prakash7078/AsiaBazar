import { useEffect, useState } from "react";
import ab from "/Images/asiabazar.png";
import { TiThMenu } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdShoppingCart } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { Link as Route, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import {
  Badge,
  Button,
  Dialog,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { getCartItems } from "../redux/productSlice";
import Login from "../pages/Login";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { cartItems } = useSelector((state) => state.product);

  const handleOpen = () => setOpen(!open);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (userInfo?._id) dispatch(getCartItems({ user_id: userInfo._id }));
  }, [dispatch, userInfo?._id]);

  const handleSignout = async () => {
    await dispatch(logoutUser());
    window.location.reload();
    navigate("/");
  };

  return (
    <nav className="max-w-7xl mx-auto fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className=" flex items-center justify-between px-4 sm:px-6 py-3">
        
        {/* --- Logo --- */}
        <Route to="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src={ab}
              alt="logo"
              className="w-16 h-12 rounded-md object-cover"
            />
            <h1 className="text-xl font-bold text-green-800 hidden sm:block">
              Asia Bazaar
            </h1>
          </div>
        </Route>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex items-center space-x-6 font-semibold">
          {userInfo?.admin && (
            <Route to="/admin" className="hover:text-green-700 transition">
              Dashboard
            </Route>
          )}

          {/* Cart */}
          <Route to="/mycart">
            <Badge
              content={cartItems?.length>0? cartItems.length : null}
              overlap="circular"
              className={`${cartItems?.length > 0 ? 'bg-red-500' : 'bg-transaparent'} text-white`}
              >
              <MdShoppingCart size={25} className="cursor-pointer text-gray-700" />
            </Badge>
          </Route>

          {/* Profile */}
          {userInfo && (
            <Route to="/profile">
              <IoPersonCircleOutline
                size={35}
                className="cursor-pointer text-gray-700 hover:text-green-600"
              />
            </Route>
          )}

          {!userInfo ? (
            <Button color="green" onClick={handleOpen}>
              Log In
            </Button>
          ) : (
            <button
              onClick={handleSignout}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
            >
              <FiLogOut />
              Logout
            </button>
          )}
        </div>

        {/* --- Mobile Icons --- */}
        <div className="md:hidden flex items-center gap-3">
          <Route to="/mycart">
            <Badge
              content={cartItems?.length>0? cartItems.length : null}
              overlap="circular"
              className={`${cartItems?.length > 0 ? 'bg-red-500' : ''} text-white`}
            >
              <MdShoppingCart size={25} className="text-gray-700" />
            </Badge>
          </Route>
          {!isMenuOpen ? (
            <TiThMenu
              size={24}
              color="green"
              onClick={toggleMenu}
              className="cursor-pointer w-8"
            />
          ) : (
            <RxCross2
              size={28}
              color="green"
              onClick={toggleMenu}
              className="cursor-pointer  w-8"
            />
          )}
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-br bg-white border-t border-gray-200 shadow-lg absolute top-16 left-0 w-full animate-slideDown z-40">
          <ul className="flex flex-col items-start gap-4 p-6 text-lg font-medium text-gray-700">
            {userInfo?.admin && (
              <Route
                to="/admin"
                onClick={toggleMenu}
                className="hover:text-green-700"
              >
                Dashboard
              </Route>
            )}

            {userInfo && (
              <Route
                to="/profile"
                onClick={toggleMenu}
                className="flex items-center gap-3"
              >
                <IoPersonCircleOutline size={30} className="text-gray-700" />
                My Profile
              </Route>
            )}

            {!userInfo ? (
              <Button
                color="green"
                onClick={() => {
                  toggleMenu();
                  handleOpen();
                }}
                className="w-full"
              >
                Log In
              </Button>
            ) : (
              <button
                onClick={handleSignout}
                className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                <FiLogOut />
                Logout
              </button>
            )}
          </ul>
        </div>
      )}

      {/* --- Login Dialog --- */}
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Login value={handleOpen} />
      </Dialog>
    </nav>
  );
}

export default Navbar;
