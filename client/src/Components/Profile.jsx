import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCustomerOrders } from "../redux/productSlice";
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";
import { updateRegister } from "../redux/authSlice";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Home,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  ReceiptText,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getPaymentColor = (status) => {
  switch (status?.toLowerCase()) {
    case "succeeded":
      return "green";
    case "pending":
      return "amber";
    case "failed":
      return "red";
    default:
      return "blue-gray";
  }
};

const getOrderColor = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "green";
    case "processing":
      return "blue";
    case "shipped":
      return "purple";
    case "cancelled":
      return "red";
    default:
      return "amber";
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const userInfo = useSelector((state) => state.auth.userInfo);
  const orders = useSelector((state) => state.product.customer_orders);

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(getCustomerOrders(userInfo._id));
    }
  }, [dispatch, userInfo?._id]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.mobile_no || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateRegister({ user_id: userInfo?._id, formData }));
      window.location.reload();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const totalSpent = orders?.reduce(
    (sum, order) => sum + (Number(order?.total_amount) || 0),
    0
  );
  const pendingOrders = orders?.filter(
    (order) => order?.order_status?.toLowerCase() === "pending"
  ).length;
  const lastOrderDate = orders?.[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No orders yet";

  const profileFields = [
    { label: "Email", value: userInfo?.email || "Not added", icon: Mail },
    { label: "Phone", value: userInfo?.mobile_no || "Not added", icon: Phone },
    { label: "Address", value: userInfo?.address || "Not added", icon: MapPin },
  ];

  const stats = [
    {
      label: "Total Orders",
      value: orders?.length || 0,
      icon: ShoppingBag,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Pending",
      value: pendingOrders || 0,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent?.toFixed(2) || "0.00"}`,
      icon: CreditCard,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Last Order",
      value: lastOrderDate,
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50 px-3 sm:px-6 lg:px-8 py-6 sm:py-8 mt-20">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-700 via-emerald-600 to-lime-500 p-5 sm:p-6 md:p-8 shadow-xl">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-sm" />
          <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-yellow-200/20 blur-md" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 text-center sm:text-left">
              <div className="mx-auto sm:mx-0 h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-white text-green-700 shadow-lg flex items-center justify-center text-2xl sm:text-3xl font-extrabold flex-shrink-0">
                {getInitials(userInfo?.name) || <User size={36} />}
              </div>
              <div className="min-w-0">
                <p className="text-green-100 font-medium">Welcome back</p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white break-words">
                  {userInfo?.name || "Asia Bazaar Customer"}
                </h1>
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2 text-xs sm:text-sm">
                  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-white backdrop-blur">
                    <Mail size={14} /> {userInfo?.email || "No email"}
                  </span>
                  {userInfo?.admin && (
                    <span className="rounded-full bg-yellow-300 px-3 py-1 font-bold text-green-900">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border border-gray-100 shadow-sm rounded-2xl">
              <CardBody className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5">
                <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-2xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon size={22} />
                </div>
                <div className="min-w-0">
                  <Typography className="text-sm text-gray-500">{stat.label}</Typography>
                  <Typography className="text-lg sm:text-xl font-bold text-gray-900 truncate">{stat.value}</Typography>
                </div>
              </CardBody>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={`${isEditing ? "lg:col-span-3" : "lg:col-span-1"} border border-gray-100 shadow-md rounded-2xl sm:rounded-3xl overflow-hidden`}>
            <CardBody className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="min-w-0">
                  <Typography className="text-xl font-bold text-gray-900">
                    {isEditing ? "Edit Profile" : "Profile Details"}
                  </Typography>
                  <Typography className="text-sm text-gray-500">
                    {isEditing
                      ? "Update your contact and delivery information"
                      : "Your contact and delivery info"}
                  </Typography>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                  <Home size={21} />
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-50 to-white border border-green-100 p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                    {[
                      { name: "name", label: "Full Name", type: "text", icon: User, placeholder: "Enter your name" },
                      { name: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "Enter your email" },
                      { name: "phone", label: "Phone Number", type: "text", icon: Phone, placeholder: "Enter your phone number" },
                      { name: "address", label: "Delivery Address", type: "text", icon: MapPin, placeholder: "Enter your address" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                            <field.icon size={17} />
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData?.[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="w-full rounded-2xl border border-green-100 bg-white pl-14 sm:pl-16 pr-4 py-3.5 sm:py-4 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-green-100 pt-5">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-bold text-gray-700 hover:bg-gray-50"
                    >
                      <X size={17} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700 shadow-lg shadow-green-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {profileFields.map((field) => (
                    <div key={field.label} className="flex gap-3 rounded-2xl bg-gray-50 p-3 sm:p-4">
                      <div className="h-10 w-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                        <field.icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <Typography className="text-xs uppercase tracking-wide text-gray-500 font-bold">
                          {field.label}
                        </Typography>
                        <Typography className="font-semibold text-gray-800 break-words">
                          {field.value}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="lg:col-span-2 space-y-5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div className="min-w-0">
                <Typography className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Order History
                </Typography>
                <Typography className="text-gray-500">
                  Track recent pickup and delivery orders.
                </Typography>
              </div>
              <Chip value={`${orders?.length || 0} orders`} color="green" className="w-fit" />
            </div>

            {orders?.length === 0 ? (
              <Card className="border border-dashed border-green-200 bg-green-50/60 rounded-2xl sm:rounded-3xl">
                <CardBody className="text-center py-10 sm:py-14 px-4">
                  <Package className="mx-auto text-green-600 mb-3" size={42} />
                  <Typography className="text-xl font-bold text-gray-900">
                    No orders yet
                  </Typography>
                  <Typography className="text-gray-500 mt-1">
                    Your Asia Bazaar orders will appear here after checkout.
                  </Typography>
                </CardBody>
              </Card>
            ) : (
              orders?.map((order) => (
                <Card key={order?._id} className="shadow-md border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden">
                  <CardBody className="p-0">
                    <div className="bg-gray-50 px-4 sm:px-5 py-4 border-b">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 max-w-32 rounded-2xl bg-green-600 px-3 py-2 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 text-center">
                            {order?.user?.name || userInfo?.name || <ReceiptText size={20} />}
                          </div>
                          <div className="min-w-0">
                            <Typography className="font-bold text-gray-900 truncate">
                              Order #{order?._id?.slice(-8)}
                            </Typography>
                            <Typography className="text-sm text-gray-500">
                              {new Date(order?.createdAt).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Chip
                            value={`Payment ${order?.payment_status}`}
                            color={getPaymentColor(order?.payment_status)}
                            size="sm"
                          />
                          <Chip
                            value={`Order ${order?.order_status}`}
                            color={getOrderColor(order?.order_status)}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {order?.items?.map((item) => {
                        const images = item?.product?.product_image || [];
                        return (
                          <div key={item?._id} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-5">
                            <img
                              src={images[0]}
                              alt={item?.product_name}
                              className="w-full h-36 sm:w-20 sm:h-20 rounded-2xl object-cover border bg-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div className="min-w-0">
                                  <Typography className="font-bold text-gray-900 break-words">
                                    {item?.product_name?.split("#")?.[0]}
                                  </Typography>
                                  <Typography className="text-sm text-gray-500">
                                    Qty: {item?.quantity}
                                  </Typography>
                                </div>
                                <div className="sm:text-right rounded-xl bg-green-50 sm:bg-transparent px-3 py-2 sm:p-0">
                                  <Typography className="font-bold text-green-700">
                                    ${item?.total_price}
                                  </Typography>
                                  <Typography className="text-xs text-gray-500">
                                    ${item?.product?.product_price} / {item?.product?.product_size}
                                    {item?.product?.quantity_measure}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white px-4 sm:px-5 py-4 border-t">
                      <Typography className="text-sm sm:text-base text-gray-700 flex items-start gap-2">
                        <MapPin size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="break-words">
                          <span className="font-bold">Ship to:</span> {order?.shipping_address}
                        </span>
                      </Typography>
                      <div className="w-full md:w-auto rounded-2xl bg-green-50 px-4 py-2 text-left md:text-right">
                        <Typography className="text-xs text-green-700 font-bold uppercase">
                          Total
                        </Typography>
                        <Typography className="text-xl font-extrabold text-green-800">
                          ${order?.total_amount}
                        </Typography>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
