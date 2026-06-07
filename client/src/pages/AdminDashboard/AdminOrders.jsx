import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MapPin,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrder } from "../../redux/adminSlice";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const orders = useSelector((state) => state.admin.orders);
  const dispatch = useDispatch();

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    orderId: null,
    newStatus: "",
    newPayment: "",
    oldStatus: "",
    oldPayment: "",
    updatemobileno: "",
    updateaddress: "",
    type: "",
  });

  useEffect(() => {
    dispatch(getAllOrders());
    setLoading(false);
  }, [dispatch]);

  const filteredOrders = orders?.filter((order) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order?._id?.toString().toLowerCase().includes(query) ||
      order?.user?.name?.toLowerCase().includes(query) ||
      order?.shipping_address?.toLowerCase().includes(query) ||
      order?.updated_mobile_no?.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "succeeded": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    newExpanded.has(orderId) ? newExpanded.delete(orderId) : newExpanded.add(orderId);
    setExpandedOrders(newExpanded);
  };

  const handleChange = (order, value, type) => {
    setConfirmDialog({
      open: true,
      orderId: order._id,
      newStatus: type === "status" ? value : order.order_status,
      newPayment: type === "payment" ? value : order.payment_status,
      oldStatus: order.order_status,
      oldPayment: order.payment_status,
      updatemobileno: order.updated_mobile_no,
      updateaddress: order.shipping_address,
      type,
    });
  };

  const updateOrderDetails = async (orderId, newStatus, paymentStatus, updatemobileno, updateaddress) => {
    const orderdata = {
      order_status: newStatus,
      payment_status: paymentStatus,
      updated_mobile_no: updatemobileno,
      shipping_address: updateaddress,
    };
    await dispatch(updateOrder({ orderId, orderdata }));
    await dispatch(getAllOrders());
  };

  const handleConfirm = async () => {
    await updateOrderDetails(
      confirmDialog.orderId,
      confirmDialog.newStatus,
      confirmDialog.newPayment,
      confirmDialog.updatemobileno,
      confirmDialog.updateaddress
    );
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleCancel = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter((order) => order.order_status === "pending").length || 0,
    processing: orders?.filter((order) => order.order_status === "processing").length || 0,
    shipped: orders?.filter((order) => order.order_status === "shipped").length || 0,
    delivered: orders?.filter((order) => order.order_status === "delivered").length || 0,
    totalRevenue: orders
      ?.filter((item) => item.payment_status === "succeeded")
      .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0),
  };

  const stats = [
    { label: "Total Orders", value: orderStats.total, icon: ShoppingCart, color: "bg-gray-100 text-gray-800" },
    { label: "Pending", value: orderStats.pending, icon: Package, color: "bg-yellow-100 text-yellow-700" },
    { label: "Processing", value: orderStats.processing, icon: Truck, color: "bg-blue-100 text-blue-700" },
    { label: "Shipped", value: orderStats.shipped, icon: Truck, color: "bg-purple-100 text-purple-700" },
    { label: "Delivered", value: orderStats.delivered, icon: Package, color: "bg-green-100 text-green-700" },
    { label: "Revenue", value: `$${orderStats.totalRevenue?.toFixed(2) || "0.00"}`, icon: DollarSign, color: "bg-indigo-100 text-indigo-700" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:p-6">
      <div className="rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-green-100 font-medium">Admin Panel</p>
            <h1 className="text-3xl md:text-4xl font-extrabold">Orders Management</h1>
            <p className="text-green-50 mt-2">Track, filter, and update pickup and delivery orders.</p>
          </div>
          <div className="rounded-2xl bg-white/20 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-green-50">Visible Orders</p>
            <p className="text-2xl font-extrabold">{filteredOrders?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <div className="text-xl font-extrabold text-gray-900 truncate">{stat.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-4 md:p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search order ID, customer, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Payments</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders?.map((order) => {
          const isExpanded = expandedOrders.has(order._id);
          const isPickup = order.payment_method === "PICKUP";

          return (
            <div key={order._id} className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="p-4 md:p-5">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-green-600 text-white flex items-center justify-center font-extrabold flex-shrink-0">
                      {(order?.user?.name || "C").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-extrabold text-gray-900">#{order._id?.slice(-8)}</h2>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${isPickup ? "bg-green-50 text-green-700 border-green-100" : "bg-blue-50 text-blue-700 border-blue-100"}`}>
                          {isPickup ? "Pickup" : "Delivery"}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          {order.items?.length || 0} items
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                        <div className="flex gap-2 text-gray-700">
                          <User size={17} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold uppercase text-gray-400">Customer</p>
                            <p className="font-semibold">{order?.user?.name || "Customer"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-gray-700">
                          <Phone size={17} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold uppercase text-gray-400">Phone</p>
                            <p className="font-semibold">{order.updated_mobile_no || "N/A"}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-gray-700 md:col-span-2 xl:col-span-1">
                          <MapPin size={17} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold uppercase text-gray-400">Address</p>
                            <p className="font-semibold break-words">{order.shipping_address}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-gray-700">
                          <CalendarDays size={17} className="text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold uppercase text-gray-400">Date</p>
                            <p className="font-semibold">
                              {new Date(order?.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-[130px_150px_150px] gap-3 xl:min-w-[450px]">
                    <div className="rounded-2xl bg-green-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase text-green-700">Total</p>
                      <p className="text-xl font-extrabold text-green-800">${parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>
                    <select
                      data-order={`${order._id}-status`}
                      value={order.order_status}
                      onChange={(e) => handleChange(order, e.target.value, "status")}
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 ${getStatusColor(order.order_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      data-order={`${order._id}-payment`}
                      value={order.payment_status}
                      onChange={(e) => handleChange(order, e.target.value, "payment")}
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold focus:ring-2 focus:ring-green-500 ${getPaymentStatusColor(order.payment_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="succeeded">Succeeded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => toggleOrderExpansion(order._id)}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {isExpanded ? "Hide Items" : "View Items"}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t bg-gray-50 p-4 md:p-5">
                  <h4 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={18} className="text-green-600" />
                    Ordered Items
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {order.items?.map((item) => (
                      <div key={item._id} className="rounded-2xl bg-white border border-gray-100 p-4 flex gap-3">
                        <img
                          src={item?.product?.product_image?.[0]}
                          alt={item?.product_name}
                          className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate">{item.product_name?.split("#")[0]}</div>
                          <div className="text-xs text-gray-500">{item.product_category || item?.product?.product_category}</div>
                          <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
                          <div className="text-sm font-bold text-green-700 mt-1">${item.total_price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders?.length === 0 && (
          <div className="rounded-3xl bg-white border border-dashed border-gray-200 py-14 text-center text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>

      <Dialog open={confirmDialog.open} handler={handleCancel}>
        <DialogHeader>⚠️ Confirm Update</DialogHeader>
        <DialogBody divider>
          <Typography variant="paragraph" color="gray">
            Are you sure you want to update the{" "}
            <span className="font-semibold">
              {confirmDialog.type === "status" ? "order status" : "payment status"}
            </span>{" "}
            to{" "}
            <span className="text-green-600 font-semibold">
              {confirmDialog.type === "status" ? confirmDialog.newStatus : confirmDialog.newPayment}
            </span>
            ?
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="text" color="gray" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="green" onClick={handleConfirm}>
            Yes, Update
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
