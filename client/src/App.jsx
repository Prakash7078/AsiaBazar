import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./Components/Navbar";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProductForm from "./pages/AdminDashboard/Product";
import AllProducts from "./pages/AdminDashboard/AdminProducts";
import ProductScreen from "./pages/ProductScreen";
import CartPage from "./pages/CartPage";
import Categories from "./Components/Categories";
import AdminLayout from "./pages/AdminDashboard/AdminLayout";
import { useSelector } from "react-redux";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminProducts from "./pages/AdminDashboard/AdminProducts";
import AdminUsers from "./pages/AdminDashboard/AdminUsers";
import AdminOrders from "./pages/AdminDashboard/AdminOrders";
import AdminPayments from "./pages/AdminDashboard/AdminPayments";
import AdminReviews from "./pages/AdminDashboard/AdminReviews";
import Checkout from "./Components/Checkout";
import Profile from "./Components/Profile";
import ResetPassword from "./pages/ResetPassword";
import PasswordRequest from "./pages/PasswordRequest";
import MenuSection from "./Components/MenuSection";
import Cafe from "./Components/Cafe";
import Store from "./Components/Store";
import Chatbot from "./Components/Chatbot";

const ProtectedAdminRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if (!userInfo || !userInfo?.admin) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  
  // Enhanced appearance configuration for PaymentElement
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#10b981', // Green color to match your design
      colorBackground: '#ffffff',
      colorText: '#374151',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Tab': {
        border: '1px solid #d1d5db',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      '.Tab:hover': {
        color: '#10b981',
      },
      '.Tab--selected': {
        borderColor: '#10b981',
        boxShadow: '0 0 0 1px #10b981',
      },
      '.Input': {
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '12px',
      },
      '.Input:focus': {
        borderColor: '#10b981',
        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
      },
    },
  };

  // Options for PaymentElement
  const options = {
    mode: 'payment',
    amount: 1099, // This will be dynamically set in the checkout component
    currency: 'usd',
    appearance,
    // Enable automatic payment methods
  };

  // This is your test publishable API key
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

  return (
    <div className="max-w-7xl mx-auto">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={userInfo ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mycart" element={userInfo ? <CartPage /> : <Navigate to="/login" />} />
          <Route path='/menu' element={<MenuSection />} />
          <Route path="/passwordrequest" element={<PasswordRequest />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />          
          <Route path="/store" element={<Store/>} />
          <Route path="/cafe" element={<Cafe />} />
          <Route 
            path="/checkout" 
            element={
              userInfo ? (
                <Elements options={options} stripe={stripePromise}>
                  <Checkout />
                </Elements>
              ) : <Navigate to="/login" replace />
            } 
          />
          {/* <Route path="/allitems" element={<Categories />} /> */}
          <Route path="/product/:productId" element={<ProductScreen />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="addProduct" element={<ProductForm />} />
            <Route path="allProducts" element={<AdminProducts />} />
            <Route path="updateProduct/:productId" element={<ProductForm />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Routes>
        <Chatbot />
      </BrowserRouter>
      
      <ToastContainer
        position="bottom-center"
        bodyClassName="font-bold text-black text-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
