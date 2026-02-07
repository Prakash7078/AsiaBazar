import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  Star,
  Menu,
  LogOut,
  CircleX
} from 'lucide-react';

import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Drawer,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';
import { getAllOrders } from '../../redux/adminSlice';

const AdminLayout = () => {
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const navigate=useNavigate();
  const orders = useSelector((state) => state.admin.orders);
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(getAllOrders());
  }, [dispatch]);
      // Count pending orders
  const pendingOrdersCount = orders?.filter(
    (order) => order?.order_status?.toLowerCase() === 'pending'
  ).length || 0;
  console.log("Pending Orders Count:", pendingOrdersCount);
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Add Product', href: '/admin/addProduct', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, badge: pendingOrdersCount},
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Reviews', href: '/admin/reviews', icon: Star }
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href);
  };
  const handleSignout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="mt-32 md:flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block ">
        <Card className="h-full rounded-none p-4 bg-[#ffccbc] shadow-xl">
          <Typography variant="h6" color="blue-gray" className="mb-6">
            Admin Panel
          </Typography>
          <List>
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <ListItem
                  className={`rounded-lg ${
                    isActive(item.href)
                      ? 'bg-green-100 text-green-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ListItemPrefix>
                    <item.icon className="h-5 w-5" />
                  </ListItemPrefix>
                  <span>{item.name}</span>
                  {item?.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {item?.badge}
                    </span>
                  )}
                </ListItem>
              </Link>
            ))}
          </List>
          <div className="mt-auto pt-10">
            <ListItem className="text-red-600 hover:bg-red-50" onClick={handleSignout}>
              <ListItemPrefix>
                <LogOut className="h-5 w-5" />
              </ListItemPrefix>
              Logout
            </ListItem>
          </div>
        </Card>
      </div>

      {/* Mobile Topbar with Drawer Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between h-20 px-4">
        <div className="flex items-center gap-4">
          <IconButton variant="text" onClick={toggleDrawer}>
            <Menu className="h-6 w-6 text-gray-800" />
          </IconButton>
          <Typography variant="h6" className="text-gray-800">Admin Panel</Typography>
        </div>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          View Store
        </Link>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={openDrawer} onClose={toggleDrawer} className="p-4 bg-white ">
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h6">Admin Menu</Typography>
          <IconButton variant="text" onClick={toggleDrawer}>
              <CircleX className="h-6 w-6 text-gray-800" />
          </IconButton>
        </div>
        <List>
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} onClick={toggleDrawer}>
              <ListItem
                className={`rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <ListItemPrefix>
                  <item.icon className="h-5 w-5" />
                </ListItemPrefix>
                <span>{item.name}</span>
                {item?.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {item?.badge}
                    </span>
                )}
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 md:px-4 pt-20 lg:ml-64 ">
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
