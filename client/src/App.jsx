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

const ProtectedAdminRoute= ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  if(!userInfo || !userInfo?.admin){
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
function App() {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const appearance = {
    theme: 'stripe',
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = 'auto';
 // This is your test publishable API key.

  const stripePromise = loadStripe('pk_test_51RyflqKnzA1djliPeNryh0ES6pw1NvRIcb7LOnw1S4q4VQsq3hNgjmi3Sbfl92EE1uHJbfSINguJsB8Og6nV34Ow00qKC55yV4');

  
  return (
    <div className="max-w-7xl mx-auto ">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={userInfo ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mycart" element={<CartPage />} />
          <Route path="/checkout" element={<Elements options={{appearance,loader}} stripe={stripePromise} >
                <Checkout />
              </Elements>} />
          <Route path="/allitems" element={<Categories />} />
          <Route path="/product/:productId" element={<ProductScreen />} />
          {/* <Route path="/passwordrequest" element={<PasswordRequest />} /> */}
          {/* <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          /> */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
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
      </BrowserRouter>
      <div>
        
        <ToastContainer
          position="bottom-center"
          bodyClassName="font-bold text-blue-900 text-center"
        />
       
      </div>
    </div>
  );
}

export default App;
