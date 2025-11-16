import React, { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, getUsers } from "../../redux/adminSlice";
import { getProducts } from "../../redux/productSlice";

const AdminDashboard = () => {

  const orders=useSelector((state)=>state.admin.orders);
  const dispatch=useDispatch();
  const users=useSelector((state)=>state.admin.users);
  const products=useSelector((state)=>state.product.products);

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getUsers());
    dispatch(getProducts());
  }, [dispatch]);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  

  const totalRevenue = orders.filter((item)=>item.payment_status==='succeeded').reduce(
    (sum, order) => sum + (parseFloat(order.total_amount) || 0),
    0
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+12.4%",
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Orders",
      value: orders.length,
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Customers",
      value: users.length,
      change: "+5.9%",
      icon: Users,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Products",
      value: products.length,
      change: "+3.1%",
      icon: Package,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="md:text-3xl text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <span className="text-sm text-gray-500">{orders.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.user?.name || "Unknown User"}
                    </td>
                    <td className="px-4 py-3 font-semibold">${order.total_amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{order.payment_method}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
            >
              <img
                src={product.product_image?.[0] || "/placeholder.jpg"}
                alt={product.product_name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
              <p className="text-gray-600 text-sm">{product.product_category}</p>
              <p className="font-bold text-green-600 mt-2">
                ${product.product_price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
