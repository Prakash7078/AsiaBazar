import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, User, Phone, Package, Truck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  deleteCartItem,
  getCartItems,
  placeCustomerOrder,
} from "../redux/productSlice";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { BASE_URL } from "../config/url";
import axios from "axios";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [deliveryType, setDeliveryType] = useState(""); // PICKUP or DELIVERY
  const [paymentMethod, setPaymentMethod] = useState("");
  const [credittax, setCredittax] = useState(0);
  const [orderStatus, setOrderStatus] = useState("");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const cartItems = useSelector((state) => state.product.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item?.product?.product_price * item.quantity,
    0
  );
  
  // Calculate charges based on delivery type and payment method
  const getShippingCost = () => {
    if (deliveryType === "PICKUP") return 0;
    if (deliveryType === "DELIVERY") return 2.99;
    return 0;
  };
  
  const getTax = () => {
    return subtotal * 0.07;
  };
  
  const getCreditCardFee = () => {
    if (paymentMethod === "CARD") return 3.50;
    return 0;
  };
  
  const shipping = getShippingCost();
  const tax = getTax();
  const creditCardFee = getCreditCardFee();
  const total = subtotal + tax + shipping + creditCardFee;
  
  const [formData, setFormData] = useState({
    user_id: userInfo?._id,
    firstName: userInfo?.name || "",
    lastName: "",
    email: userInfo?.email || "",
    phone: userInfo?.mobile_no || "",
    address: userInfo?.address || "",
    city: "",
    state: "",
    zipCode: "",
  });

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clearCart = async (cartItemId) => {
    await dispatch(
      deleteCartItem({
        user_id: userInfo?._id,
        cart_item_id: cartItemId,
      })
    );
    await dispatch(getCartItems({ user_id: userInfo?._id }));
  };

  const handleCardPayment = () => {
    setPaymentMethod("CARD");
  };

  // Validation and error handling
  useEffect(() => {
    setOrderStatus("");
    
    // Minimum order validation for delivery
    if (deliveryType === "DELIVERY" && total < 10) {
      setOrderStatus("Minimum order amount for delivery should be $10");
    }
  }, [deliveryType, total]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate delivery type and payment method
    if (!deliveryType) {
      toast.error("Please select a delivery type");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // PICKUP Payment
    if (deliveryType === "PICKUP" && paymentMethod === "PICKUP_PAY") {
      setLoading(true);
      const orderData = {
        formData: {
          user_id: formData?.user_id,
          firstName: formData?.firstName+" "+formData?.lastName,
          email: formData?.email,
          phone: formData?.phone,
          address: "Pickup Order",
          city: "N/A",
          state: "N/A",
          zipCode: "N/A",
          paymentIntent: "PICKUP",
          paymentStatus: "pending",
          totalAmount: total.toFixed(2),
          deliveryType: "PICKUP",
        },
        cartItems,
      };
      
      try {
        await dispatch(placeCustomerOrder(orderData));
        await dispatch(deleteCart({ user_id: userInfo?._id }));
        // toast.success("Pickup order placed successfully!");
        navigate("/");
      } catch (error) {
        toast.error("Failed to place order");
      } finally {
        setLoading(false);
      }
      return;
    }

    // CASH ON DELIVERY Payment
    if (deliveryType === "DELIVERY" && paymentMethod === "CASH_ON_DELIVERY") {
      // toast.error("Cash on delivery is temporarily unavailable.");
      // return;
      setLoading(true);
      const orderData = {
        formData: {
          user_id: formData?.user_id,
          firstName: formData?.firstName+" "+formData?.lastName,
          email: formData?.email,
          phone: formData?.phone,
          address: formData?.address,
          city: formData?.city,
          state: formData?.state,
          zipCode: formData?.zipCode,
          paymentIntent: "Cash on Delivery", // Payment method ID
          paymentStatus: "pending",
          totalAmount: total.toFixed(2),
          deliveryType: deliveryType,

        },
        cartItems, // Pass the cart items from your state
      };
      await dispatch(placeCustomerOrder(orderData));
     
      await dispatch(deleteCart({ user_id: userInfo?._id }));
      navigate("/");
      setLoading(false);
      setPaymentMethod("");
      return;
    }

    // CARD Payment
    if (paymentMethod === "CARD") {
      if (!stripe || !elements) {
        setLoading(false);
        setMessage("Stripe has not loaded yet.");
        return;
      }

      setLoading(true);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        setLoading(false);
        toast.error(submitError.message);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });

        if (!response.ok) {
          setMessage("Failed to create payment intent.");
          setLoading(false);
          return;
        }

        const { clientSecret } = await response.json();

        const result = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation`,
            payment_method_data: {
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                address: {
                  line1: formData.address,
                  city: formData.city,
                  state: formData.state,
                  postal_code: formData.zipCode,
                  country: "US",
                },
              },
            },
            shipping: {
              name: `${formData.firstName} ${formData.lastName}`,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: "US",
              },
            },
            receipt_email: formData.email,
          },
          redirect: "if_required",
        });

        if (result.error) {
          toast.error(result.error.message);
          setLoading(false);
          return;
        }

        if (
          result.paymentIntent &&
          result.paymentIntent.status === "succeeded"
        ) {
          const orderData = {
            formData: {
              user_id: formData?.user_id,
              firstName: formData?.firstName,
              lastName: formData?.lastName,
              email: formData?.email,
              phone: formData?.phone,
              address: formData?.address,
              city: formData?.city,
              state: formData?.state,
              zipCode: formData?.zipCode,
              paymentIntent: result.paymentIntent.id,
              paymentStatus: result.paymentIntent.status,
              totalAmount: result.paymentIntent.amount / 100,
              deliveryType: deliveryType,
            },
            cartItems,
          };

          await dispatch(placeCustomerOrder(orderData));
          await dispatch(deleteCart({ user_id: userInfo?._id }));
          toast.success("Order placed successfully!");
          navigate("/");
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error("Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const nextStep = () => {
    // Validation for Step 1
    if (currentStep === 1) {
      if (!formData.firstName || !formData.email || !formData.phone) {
        toast.error("Please fill all the required fields");
        return;
      }
    }

    // Validation for Step 2
    if (currentStep === 2) {
      if (!deliveryType) {
        toast.error("Please select a delivery type");
        return;
      }
    }

    // Validation for Step 3 (Address - only for DELIVERY)
    if (currentStep === 3 && deliveryType === "DELIVERY") {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        toast.error("Please fill all the required address fields");
        return;
      }
    }

    setCurrentStep(Math.min(4, currentStep + 1));
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  if (cartItems.length === 0) {
    navigate("/mycart");
    return null;
  }

  // Calculate total steps based on delivery type
  const totalSteps = deliveryType === "PICKUP" ? 3 : 4;
  const stepLabels = deliveryType === "PICKUP" 
    ? ["Personal Info", "Delivery Type", "Payment"]
    : ["Personal Info", "Delivery Type", "Address", "Payment"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-1 text-gray-600 hidden md:block">
                  {stepLabels[index]}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`w-12 md:w-20 h-1 ${
                    step < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3  w-full">
        {/* Checkout Form */}
        <div className="lg:col-span-2 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg md:p-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="md:text-xl font-bold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Type Selection */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg  md:p-6">
                <h2 className="md:text-xl font-bold mb-4 text-center">
                  Choose Delivery Type
                </h2>
                <h2 className="text-red-400 mb-4">Delivery is currently unavailable. Pickup only.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pickup Option */}
                  <div
                    onClick={() => {
                      setDeliveryType("PICKUP");
                      setPaymentMethod(""); // Reset payment method
                    }}
                    className={`${
                      deliveryType === "PICKUP"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
                    } border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Package className="h-12 w-12 text-green-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Pickup</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Collect your order from our store
                      </p>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        FREE
                      </div>
                    </div>
                  </div>

                  {/* Delivery Option */}
                  <div
                    onClick={() => {
                      setDeliveryType("DELIVERY");
                      setPaymentMethod(""); // Reset payment method
                    }}
                    className={`${
                      deliveryType === "DELIVERY"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
                    } border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Truck className="h-12 w-12 text-green-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">Delivery</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Get it delivered to your doorstep
                      </p>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        $2.99
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Min. order: $10
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Delivery Address (Only for DELIVERY) */}
            {currentStep === 3 && deliveryType === "DELIVERY" && (
              <div className="bg-white rounded-lg md:shadow-md md:p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="md:text-xl font-bold">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 (or 3 for PICKUP): Payment Information */}
            {((currentStep === 3 && deliveryType === "PICKUP") ||
              (currentStep === 4 && deliveryType === "DELIVERY")) && (
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-center text-xl">
                  Select Payment Method
                </h1>

                {/* Pickup Payment Option */}
                {deliveryType === "PICKUP" && (
                  <div
                    onClick={() => setPaymentMethod("PICKUP_PAY")}
                    className={`${
                      paymentMethod === "PICKUP_PAY"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
                    } border-2 p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">Pay at Pickup</p>
                          <p className="text-sm text-gray-600">
                            Pay when you collect your order
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "PICKUP_PAY" && (
                        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Payment Options */}
                {deliveryType === "DELIVERY" && (
                  <>
                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className={`${
                        paymentMethod === "CASH_ON_DELIVERY"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      } border-2 bg-white rounded-lg shadow-md p-4 transition-all duration-300 cursor-pointer`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-semibold">Cash on Delivery</p>
                           
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Credit/Debit Card */}
                    <div
                      onClick={() => handleCardPayment()}
                      className={`${
                        paymentMethod === "CARD"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      } border-2 bg-white rounded-lg shadow-md p-4 transition-all duration-300 cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="font-semibold">Credit / Debit Card</p>
                            <p className="text-sm text-gray-600">
                              Processing fee: $3.50
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "CARD" && (
                          <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>

                      {paymentMethod === "CARD" && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center mb-4">
                            <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="font-semibold">Payment Details</h3>
                          </div>
                          <div className="space-y-4">
                            <PaymentElement
                              options={{
                                layout: {
                                  type: "tabs",
                                  defaultCollapsed: false,
                                },
                                fields: {
                                  billingDetails: {
                                    name: "never",
                                    email: "never",
                                    phone: "never",
                                    address: "never",
                                  },
                                },
                              }}
                            />
                            {message && (
                              <div className="text-red-600 text-sm mt-2">
                                {message}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Order Status Warning */}
                {orderStatus && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm font-medium">
                      {orderStatus}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-4 md:flex-row items-center justify-center md:justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || (deliveryType === "DELIVERY" && total < 10) || !paymentMethod}
                  className="w-full md:w-auto bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-3">
                <img
                  src={item?.product?.product_image[0]}
                  alt={item?.product?.product_name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {item?.product?.product_name?.split("#")[0]}
                  </p>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item?.product?.product_price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (7%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            
            {deliveryType === "DELIVERY" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
            )}
            
            {deliveryType === "PICKUP" && (
              <div className="flex justify-between text-green-600">
                <span>Shipping (Pickup)</span>
                <span className="font-medium">FREE</span>
              </div>
            )}
            
            {paymentMethod === "CARD" && (
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Card Processing Fee</span>
                <span className="font-medium">${creditCardFee.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
              <span>Total</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Delivery Type Badge */}
          {deliveryType && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivery Type:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  deliveryType === "PICKUP" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {deliveryType === "PICKUP" ? "Pickup" : "Delivery"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;