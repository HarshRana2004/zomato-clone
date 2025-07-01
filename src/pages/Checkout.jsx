import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("foodyCart");
    const savedAddress = localStorage.getItem("foodyAddress");

    try {
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedAddress) setAddress(JSON.parse(savedAddress));
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
    }
  }, []);

  const handlePlaceOrder = () => {
    if (!cart.length || !address) {
      alert("Missing cart or address");
      return;
    }

    const newOrder = {
      id: Date.now(),
      items: cart,
      address,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      placedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("foodyOrders")) || [];
    localStorage.setItem("foodyOrders", JSON.stringify([newOrder, ...existing]));
    localStorage.removeItem("foodyCart");
    alert("🎉 Order placed successfully!");
    navigate("/orders");
  };

  if (!cart.length || !address) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Missing cart or address details.</h2>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-blue-500 underline"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        <div className="mb-6 border rounded p-4">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <p>{address.name}</p>
          <p>{address.phone}</p>
          <p>{address.address}</p>
          <p>{address.pincode}</p>
          {address.landmark && <p>Landmark: {address.landmark}</p>}
        </div>

        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <h4 className="text-md font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
              <div className="font-semibold text-red-500">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t pt-4 mt-6">
          <h3 className="text-xl font-bold">Total:</h3>
          <div className="text-xl font-bold text-red-600">
            ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
        >
          Place Order
        </button>
      </div>
    </>
  );
}