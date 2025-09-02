import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Star, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+8.7%',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Customers',
      value: '567',
      change: '+12.1%',
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Products',
      value: '89',
      change: '+2.4%',
      icon: Package,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', amount: '$67.50', status: 'Delivered', date: '2024-12-20' },
    { id: 'ORD002', customer: 'Jane Smith', amount: '$89.90', status: 'Processing', date: '2024-12-20' },
    { id: 'ORD003', customer: 'Mike Johnson', amount: '$123.45', status: 'Shipped', date: '2024-12-19' },
    { id: 'ORD004', customer: 'Sarah Wilson', amount: '$45.60', status: 'Pending', date: '2024-12-19' },
    { id: 'ORD005', customer: 'Tom Brown', amount: '$78.30', status: 'Delivered', date: '2024-12-18' }
  ];

  const topProducts = [
    { name: 'Fresh Organic Apples', sales: 156, revenue: '$780.00' },
    { name: 'Greek Yogurt', sales: 143, revenue: '$714.00' },
    { name: 'Free Range Eggs', sales: 134, revenue: '$802.66' },
    { name: 'Fresh Milk', sales: 89, revenue: '$310.61' }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">vs last {selectedPeriod}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.amount}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-semibold transition-colors">
            Add New Product
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-semibold transition-colors">
            Process Orders
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg font-semibold transition-colors">
            Manage Inventory
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg font-semibold transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;