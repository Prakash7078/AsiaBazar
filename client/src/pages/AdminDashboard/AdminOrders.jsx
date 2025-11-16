import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, updateOrder } from '../../redux/adminSlice';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
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

  // filter logic
  const filteredOrders = orders?.filter(order => {
    const matchesSearch =
      order._id.toString().includes(searchQuery.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.updated_mobile_no.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // helper color functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    newExpanded.has(orderId) ? newExpanded.delete(orderId) : newExpanded.add(orderId);
    setExpandedOrders(newExpanded);
  };

  // 🧠 when dropdown changes
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

  // ✅ confirm and update
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

  // ❌ cancel dialog and revert dropdown visually
  const handleCancel = () => {
    setConfirmDialog({ ...confirmDialog, open: false });

    // revert dropdown value visually
    const selectEl = document.querySelector(
      `select[data-order='${confirmDialog.orderId}-${confirmDialog.type}']`
    );
    if (selectEl) {
      selectEl.value =
        confirmDialog.type === "status"
          ? confirmDialog.oldStatus
          : confirmDialog.oldPayment;
    }
  };

  // Redux update call
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

  // quick stats
  const orderStats = {
    total: orders?.length,
    pending: orders?.filter(o => o.order_status === 'pending').length,
    processing: orders?.filter(o => o.order_status === 'processing').length,
    shipped: orders?.filter(o => o.order_status === 'shipped').length,
    delivered: orders?.filter(o => o.order_status === 'delivered').length,
    totalRevenue: orders.filter((item)=>item.payment_status==='succeeded').reduce(
      (sum, order) => sum + (parseFloat(order.total_amount) || 0),
      0
    )
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          ["Total Orders", orderStats.total, "text-gray-900"],
          ["Pending", orderStats.pending, "text-yellow-600"],
          ["Processing", orderStats.processing, "text-blue-600"],
          ["Shipped", orderStats.shipped, "text-purple-600"],
          ["Delivered", orderStats.delivered, "text-green-600"],
          ["Total Revenue", `$${orderStats.totalRevenue?.toFixed(2)}`, "text-indigo-600"],
        ].map(([label, value, color], idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Address, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
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
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Payments</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Order Details</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Customer Info</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Address</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs text-gray-500 uppercase">Payment</th>
                {/* <th className="px-6 py-3 text-xs text-gray-500 uppercase">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders?.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50 ">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="mr-2 p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedOrders.has(order._id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      #{order._id} <span className="text-xs text-gray-500 ml-1">({order.items.length} items)</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-sm">{order?.user?.name}</div>
                      <div className="text-sm">{order.updated_mobile_no}</div>
                    </td>
                    <td>
                      <div className="text-xs text-gray-500">{order.shipping_address}</div>
                    </td>
                    <td className="px-3 py-4 text-sm">{new Date(order?.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</td>
                    <td className="px-6 py-4 font-medium">${parseFloat(order.total_amount).toFixed(2)}</td>

                    {/* Order Status */}
                    <td className="px-6 py-4">
                      <select
                        data-order={`${order._id}-status`}
                        value={order.order_status}
                        onChange={(e) => handleChange(order, e.target.value, "status")}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-green-500 ${getStatusColor(order.order_status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment Status */}
                    <td className="px-6 py-4">
                      <select
                        data-order={`${order._id}-payment`}
                        value={order.payment_status}
                        onChange={(e) => handleChange(order, e.target.value, "payment")}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-green-500 ${getPaymentStatusColor(order.payment_status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="succeeded">Succeeded</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>

                    {/* <td className="px-6 pt-12 flex gap-2 text-sm ">
                      <Eye size={16} className="text-blue-600 cursor-pointer" />
                      <Edit size={16} className="text-green-600 cursor-pointer" />
                      <Package size={16} className="text-orange-600 cursor-pointer" />
                    </td> */}
                  </tr>

                  {/* Expanded Order Details */}
                  {expandedOrders.has(order._id) && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-gray-50">
                        <h4 className="font-semibold text-gray-800 mb-2">Items:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {order.items.map((item) => (
                            <div key={item._id} className="bg-white border rounded-lg p-4 flex gap-3">
                              <img
                                src={item?.product?.product_image[0]}
                                alt={item?.product_name}
                                className="w-16 h-16 rounded-md object-cover"
                              />
                              <div>
                                <div className="font-medium">{item.product_name}</div>
                                <div className="text-xs text-gray-600">{item.product_category}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Qty: {item.quantity} {item.quantity_measure}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🧩 Confirmation Dialog */}
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
                {confirmDialog.type === "status"
                  ? confirmDialog.newStatus
                  : confirmDialog.newPayment}
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

        {filteredOrders?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
