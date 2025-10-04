import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, User, Phone } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState("");

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const cartItems = useSelector((state) => state.product.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  );

  const shipping = 5.99;
  const total = subtotal + shipping;
  const [formData, setFormData] = useState({
    // Personal Info
    user_id: userInfo?.user_id,
    firstName: userInfo?.name,
    email: userInfo?.email,
    phone: userInfo?.mobile_no,
    // Address
    address: userInfo?.address,
    city: "",
    state: "",
    zipCode: "",
    // Payment
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
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
        user_id: userInfo?.user_id,
        cart_item_id: parseInt(cartItemId),
      })
    );
    await dispatch(getCartItems({ user_id: userInfo?.user_id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast.error("Please fill all the required fields");
      return;
    }

    if (paymentMethod === "CASH_ON_DELIVERY") {
      setLoading(true);
      const orderData = {
        formData: {
          user_id: formData?.user_id,
          firstName: formData?.name,
          email: formData?.email,
          phone: formData?.phone,
          address: formData?.address,
          city: formData?.city,
          state: formData?.state,
          zipCode: formData?.zipCode,
          paymentIntent: "Cash on Delivery", // Payment method ID
          paymentStatus: "pending",
          totalAmount: total.toFixed(2),
        },
        cartItems, // Pass the cart items from your state
      };
      await dispatch(placeCustomerOrder(orderData));
      const res = await axios.delete(
        `${BASE_URL}/api/products/deleteCart/${userInfo?.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(res?.data?.message);
      await dispatch(deleteCart({ user_id: userInfo?.user_id }));
      navigate("/");
      setLoading(false);
      setPaymentMethod("");
      return;
    }

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet.");
      return;
    }

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      // handleError(submitError);
      return;
    }

    try {
      // Create a payment intent on the server
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

      // Confirm the payment using PaymentElement
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`, // Optional: for redirect-based payments
          payment_method_data: {
            billing_details: {
              name: formData.firstName,
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
            name: formData.firstName,
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
        redirect: "if_required", // This prevents automatic redirect for card payments
      });

      console.log("result after payment", result);

      if (result.error) {
        console.log(result.error);
        toast.dismiss();
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // Payment succeeded, call the addCustomerOrder controller
        const orderData = {
          formData: {
            user_id: formData?.user_id,
            firstName: formData?.firstName,
            email: formData?.email,
            phone: formData?.phone,
            address: formData?.address,
            city: formData?.city,
            state: formData?.state,
            zipCode: formData?.zipCode,
            paymentIntent: result.paymentIntent.id,
            paymentStatus: result.paymentIntent.status,
            totalAmount: result.paymentIntent.amount / 100,
          },
          cartItems,
        };

        await dispatch(placeCustomerOrder(orderData));
        const res = await axios.delete(
          `${BASE_URL}/api/products/deleteCart/${userInfo?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success(res?.data?.message);
        await dispatch(deleteCart({ user_id: userInfo?.user_id }));
        navigate("/");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment processing");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(Math.min(3, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step <= currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-20 h-1 ${
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-bold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
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
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
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
                      Phone
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

            {/* Step 2: Delivery Address */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-bold">Delivery Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
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
                        City*
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
                        State*
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
                        ZIP Code*
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

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-center text-xl">
                  Select payment option
                </h1>
                <div
                  onClick={() => {
                    setPaymentMethod("CASH_ON_DELIVERY");
                  }}
                  className={`${
                    paymentMethod === "CASH_ON_DELIVERY" && "border-green-500"
                  } p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 border`}
                >
                  Cash on delivery
                </div>

                <div
                  onClick={() => {
                    setPaymentMethod("CARD");
                  }}
                  className={`${
                    paymentMethod === "CARD" && "border-green-500"
                  } bg-white rounded-lg shadow-md p-4 transition-all duration-300 flex flex-col gap-4 cursor-pointer border`}
                >
                  <p>Credit / Debit Card</p>
                  {paymentMethod == "CARD" && (
                    <div>
                      <div className="flex items-center mb-6">
                        <CreditCard className="h-6 w-6 text-green-600 mr-2" />
                        <h2 className="text-xl font-bold">
                          Payment Information
                        </h2>
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
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-16">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !stripe || !elements}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors ml-auto"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const product = item;
              let images = [];

              try {
                images = JSON.parse(product.product_image);
              } catch (err) {
                console.error("Invalid image format");
              }

              return (
                <div
                  key={item.product_id}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={images[0]}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.product_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
