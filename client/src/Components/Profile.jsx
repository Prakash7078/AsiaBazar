import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCustomerOrders } from '../redux/productSlice';
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { updateRegister } from '../redux/authSlice';

const Profile = () => {
  const dispatch = useDispatch();

  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Fetch user profile and orders from Redux store
  const userInfo  = useSelector((state) => state.auth.userInfo);
  const orders= useSelector((state) => state.product.customer_orders);
  // Fetch user profile and orders on component mount
  useEffect(() => {
    dispatch(getCustomerOrders(userInfo?._id));
  }, [dispatch, userInfo?._id]);

  // Populate form data when userInfo is loaded
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.mobile_no || '',
        address: userInfo.address || '',
      });
    }
  }, [userInfo]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateRegister({user_id:userInfo?._id,formData}));
      window.location.reload();
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* Profile Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Details</h2>
        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData?.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-700 mb-2"><strong>Name:</strong> {userInfo?.name}</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> {userInfo?.email}</p>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> {userInfo?.mobile_no}</p>
            <p className="text-gray-700 mb-2"><strong>Address:</strong> {userInfo?.address}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="space-y-6 mt-8">
      {orders?.map((order) => (
        <Card key={order?._id} className="shadow-md border rounded-xl">
          <CardBody>
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <Typography variant="h6" className="font-semibold text-gray-800">
                  Order #{order?._id}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  Placed on {new Date(order?.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                </Typography>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-col md:flex-row gap-3 space-x-2">
                <Chip
                  value={`Payment ${order?.payment_status}`}
                  color={order?.payment_status === "succeeded" ? "green" : "red"}
                  size="sm"
                />
                <Chip
                  value={`Order ${order?.order_status}`}
                  color={order?.order_status === "pending" ? "amber" : "blue"}
                  size="sm"
                />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-200">
              {order?.items?.map((item) => {
                const images = item?.product?.product_image;
                return (
                  <div
                    key={item?._id}
                    className="flex items-center py-4 gap-4"
                  >
                    {/* Product Image */}
                    <img
                      src={images[0]}
                      alt={item?.product_name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                    
                    <div className='flex-1 items-center md:flex-row flex-col '>

                    {/* Product Info */}
                    <div className="">
                      <Typography className="font-medium text-gray-800">
                        {item?.product_name}
                      </Typography>
                      <Typography className="text-sm text-gray-500">
                        Qty: {item?.quantity}
                      </Typography>
                     
                    </div>
                    <div className="text-right">
                        <Typography className="font-medium text-gray-800">
                          ${item?.total_price}
                        </Typography>
                        <Typography className="text-sm text-gray-500">
                          ${item?.product?.product_price} {item?.product?.product_size}{item?.product?.quantity_measure}
                        </Typography>
                    </div>
                    </div>


                    
                  </div>
                );
              })}
            </div>

            {/* Footer - Total + Shipping */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t">
              <Typography className="text-gray-700">
                <span className="font-semibold">Ship to:</span>{" "}
                {order?.shipping_address}
              </Typography>
              <Typography className="font-semibold text-gray-900 mt-2 sm:mt-0">
                Total: ${order?.total_amount}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
    </div>
  );
};

export default Profile;