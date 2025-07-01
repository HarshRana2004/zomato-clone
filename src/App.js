import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/ZomatoHome"; // 🔄 adjust to your actual home file
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Payment from "./pages/Payment"; // 🔄 adjust to your actual payment file
import Onboarding from "./pages/Onboarding";
import ZomatoHome from "./pages/ZomatoHome";
import PaymentSuccess from "./pages/PaymentSuccess";
import DeliveryStatus from "./pages/DeliveryStatus";

function ProtectedRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar /> {/* ✅ Always visible */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<ZomatoHome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/delivery-status" element={<DeliveryStatus />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

