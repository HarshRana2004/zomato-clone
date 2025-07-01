import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Payment() {
  const { cartItems, clearCart, getTotalAmount } = useCart();
  const [selectedTab, setSelectedTab] = useState("card");
  const [walletBalance, setWalletBalance] = useState(80);
  const [walletUsed, setWalletUsed] = useState(0);
  const navigate = useNavigate();

  const tempPayment = JSON.parse(localStorage.getItem("foodyTempPayment")) || {};
  const user = JSON.parse(localStorage.getItem("foodyUser"));

  const subtotal = getTotalAmount();
  const shipping = 30;
  const gst = parseFloat((subtotal * 0.05).toFixed(2));
  const promoDiscount = 50;
  const totalBeforeWallet = subtotal + shipping + gst - promoDiscount;

  useEffect(() => {
    const stored = parseFloat(localStorage.getItem("walletBalance"));
    const wallet = !isNaN(stored) ? stored : 80;
    const walletToUse = Math.min(wallet, totalBeforeWallet);
    setWalletBalance(wallet);
    setWalletUsed(walletToUse);
  }, [totalBeforeWallet]);

  const total = totalBeforeWallet - walletUsed;

  const updateStreak = () => {
    const uid = auth.currentUser?.uid || user?.email;
    const allOrders = JSON.parse(localStorage.getItem("foodyOrders")) || [];
    const userOrders = allOrders
      .filter((o) => o.userId === uid)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    let streak = 1;
    for (let i = 1; i < userOrders.length; i++) {
      const prev = new Date(userOrders[i - 1].timestamp);
      const curr = new Date(userOrders[i].timestamp);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (Math.abs(diff) <= 1.2) {
        streak++;
      } else break;
    }

    const todayStr = new Date().toDateString();
    const lastDate = userOrders.length > 0 ? new Date(userOrders[0].timestamp).toDateString() : null;
    if (lastDate !== todayStr) streak = 1;

    const streakData = {
      userId: uid,
      streak,
      rewardUnlocked: streak >= 5,
    };
    localStorage.setItem("foodyStreak", JSON.stringify(streakData));
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      items: cartItems,
      total,
      walletUsed,
      address: tempPayment.address,
      userId: user?.email,
      status: "Placed",
      timestamp: Date.now(),
      coordinates: tempPayment.coordinates || null,
    };

    const allOrders = JSON.parse(localStorage.getItem("foodyOrders")) || [];
    allOrders.push(newOrder);
    localStorage.setItem("foodyOrders", JSON.stringify(allOrders));

    const newBalance = Math.max(walletBalance - walletUsed, 0);
    localStorage.setItem("walletBalance", newBalance.toFixed(2));

    clearCart();
    updateStreak();

    // ✅ Redirect to delivery status page
    navigate("/order-tracking");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Select Payment Method</h2>
      <div className="flex space-x-4 mb-6">
        {["card", "upi", "wallet", "cod"].map((method) => (
          <button
            key={method}
            onClick={() => setSelectedTab(method)}
            className={`px-4 py-2 rounded-full border ${
              selectedTab === method
                ? "bg-red-500 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {method.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded shadow mb-6">
        {selectedTab === "card" && (
          <div className="space-y-4">
            <input className="border p-2 w-full rounded" placeholder="Card Number" />
            <input className="border p-2 w-full rounded" placeholder="Card Holder Name" />
            <div className="flex gap-4">
              <input className="border p-2 w-full rounded" placeholder="Expiry MM/YY" />
              <input className="border p-2 w-full rounded" placeholder="CVV" />
            </div>
          </div>
        )}
        {selectedTab === "upi" && (
          <div className="flex flex-col items-center">
            <img
              src="./assets/QR.jpg"
              alt="UPI QR"
              className="w-40 h-40 mb-4 rounded border"
            />
            <p className="text-sm text-gray-600">Scan QR to pay</p>
            <p className="text-xs mt-1">FoodyGaadi</p>
          </div>
        )}
        {selectedTab === "wallet" && (
          <p className="text-sm text-gray-600">
            ₹{walletUsed.toFixed(2)} will be used from your wallet.
          </p>
        )}
        {selectedTab === "cod" && (
          <p className="text-sm text-gray-600">Cash will be collected on delivery.</p>
        )}
      </div>

      <div className="bg-white p-4 border rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>Shipping</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>GST</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1 text-green-600">
          <span>Promo</span>
          <span>-₹{promoDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1 text-blue-600">
          <span>Wallet Used</span>
          <span>-₹{walletUsed.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-red-500 text-white py-3 rounded-full text-lg font-semibold"
      >
        Place Order & Pay
      </button>
    </div>
  );
}
