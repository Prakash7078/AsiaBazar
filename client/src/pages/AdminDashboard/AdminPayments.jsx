import React, { useEffect, useState } from 'react';
import { Search, Eye, Download, CreditCard, Truck, DollarSign } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../redux/adminSlice';
import { Rings } from 'react-loader-spinner';

const AdminPayments = () => {
  const {loading,orders}=useSelector((state)=>state.admin);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    dispatch(getAllOrders());

  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  

  const filteredOrders = orders?.filter((order) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.updated_mobile_no?.includes(searchLower) ||
      order.shipping_address?.toLowerCase().includes(searchLower);
    const matchesStatus = status === 'all' || order.payment_status?.toLowerCase() === status;
    return matchesSearch && matchesStatus;
  });

  const paymentStats = {
    totalRevenue: filteredOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0).toFixed(2),
    pending: filteredOrders?.filter((o) => o.payment_status === 'pending').length,
    completed: filteredOrders?.filter((o) => o.payment_status === 'succeeded').length,
    failed: filteredOrders?.filter((o) => o.payment_status === 'failed').length,
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Rings height="80" width="80" color="#21BF73" visible={true} ariaLabel="rings-loading" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-3 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Payments Dashboard</h1>
          <p className="text-gray-600">Manage and track all customer orders & transactions</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition">
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="text-green-600 h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h2 className="text-xl font-semibold">${paymentStats.totalRevenue}</h2>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center">
          <h2 className="text-2xl font-bold text-green-600">{paymentStats.completed}</h2>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center">
          <h2 className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</h2>
          <p className="text-gray-600">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center">
          <h2 className="text-2xl font-bold text-red-600">{paymentStats.failed}</h2>
          <p className="text-gray-600">Failed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, User, or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders?.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{order?._id}</td>
                    <td className="px-4 py-3">{order?.user?.name}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${order?.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.payment_status)}`}>
                        {order?.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">{order?.order_status}</td>
                    <td className="px-4 py-3">{order?.updated_mobile_no}</td>
                    <td className="px-4 py-3">{order?.shipping_address}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order?.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={9}>
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
