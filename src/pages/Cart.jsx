import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/empty-cart.gif";

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalAmount,
  } = useCart();

  const [flat, setFlat] = useState("");
  const [landmark, setLandmark] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const walletBalance = 80;
  const subtotal = getTotalAmount();
  const shipping = 30;
  const gst = parseFloat((subtotal * 0.05).toFixed(2));
  const discount = promoApplied ? 50 : 0;

  const walletUsed = subtotal + shipping + gst - discount >= walletBalance
    ? walletBalance
    : subtotal + shipping + gst - discount;

  const total = subtotal + shipping + gst - discount - walletUsed;

  const handleApplyPromo = () => {
    setPromoApplied(true);
    setShowPromo(false);
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 3000);
  };

  const handleProceed = () => {
    if (!flat || !landmark || !zip || !city) {
      alert("Please fill in all address fields.");
      return;
    }

    const address = { flat, landmark, zip, city };
    const temp = {
      cartItems,
      subtotal,
      shipping,
      gst,
      discount,
      walletUsed,
      total,
      address,
    };

    localStorage.setItem("foodyTempPayment", JSON.stringify(temp));
    navigate("/payment");
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <img src={emptyCart} alt="Empty" className="w-60" />
        <p className="text-gray-500 mt-4 text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 ml-4"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Address */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            placeholder="Flat / House No."
            className="border rounded p-2"
          />
          <input
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="Landmark"
            className="border rounded p-2"
          />
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Zip Code"
            className="border rounded p-2"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6 text-sm">
        <button
          className="text-red-500 underline"
          onClick={() => setShowPromo(true)}
        >
          Have a promocode?
        </button>
        {showPromo && (
          <div className="mt-2 relative animate-fade-in-down border border-red-300 rounded p-4 bg-red-50">
            <button
              onClick={() => setShowPromo(false)}
              className="absolute top-1 right-2 text-xl font-bold text-red-500"
            >
              ×
            </button>
            <p className="mb-2 text-sm">
              Use code <strong>FOODY50</strong> to get ₹50 off
            </p>
            <button
              onClick={handleApplyPromo}
              className="bg-red-500 text-white px-4 py-1 rounded-full text-sm"
            >
              Apply Code
            </button>
          </div>
        )}
        {showCongrats && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded animate-fade-in">
            🎉 Congratulations! Promo code applied successfully.
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping Charges</span>
          <span>₹{shipping}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>GST (5%)</span>
          <span>₹{gst}</span>
        </div>
        {promoApplied && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Promo Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
        {walletUsed > 0 && (
          <div className="flex justify-between mb-2 text-blue-600">
            <span>Wallet Used</span>
            <span>-₹{walletUsed}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleProceed}
        className="mt-6 w-full bg-red-500 text-white py-3 rounded-full font-semibold"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
