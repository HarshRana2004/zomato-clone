import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("foodyOrders")) || [];
    setOrders(saved);

    const statusInterval = setInterval(() => {
      const updated = saved.map((order) => {
        if (!order.status || order.status === "Placed") {
          return { ...order, status: "Preparing", stage: 0 };
        } else if (order.status === "Preparing") {
          const nextStage = (order.stage || 0) + 1;
          if (nextStage === 1) {
            return { ...order, stage: nextStage, statusMessage: "👨‍🍳 Chef has started cooking... ETA: 8 min" };
          } else if (nextStage === 2) {
            return { ...order, stage: nextStage, statusMessage: "🥘 Dish is being garnished..." };
          } else if (nextStage === 3) {
            return { ...order, stage: nextStage, statusMessage: "📦 Packing now..." };
          } else {
            return { ...order, status: "Out for delivery", stage: 0, statusMessage: "🚴‍♂️ Aman picked up your order" };
          }
        } else if (order.status === "Out for delivery") {
          const nextStage = (order.stage || 0) + 1;
          if (nextStage === 1) {
            return { ...order, stage: nextStage, statusMessage: "📍 Near Malviya Nagar, 3.2 km away" };
          } else if (nextStage === 2) {
            return { ...order, stage: nextStage, statusMessage: "🛑 Slight traffic ahead..." };
          } else {
            return { ...order, status: "Delivered", statusMessage: "✅ Order delivered successfully!" };
          }
        } else {
          return order;
        }
      });

      localStorage.setItem("foodyOrders", JSON.stringify(updated));
      setOrders([...updated]);
    }, 10000);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setOrders((prev) => [...prev]);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const getCountdown = (eta, status) => {
    if (status === "Delivered" || status === "Placed") return null;

    const now = new Date();
    const arrival = new Date(eta);
    const diff = arrival - now;

    if (diff <= 0) return "Delivered";

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `Arriving in ${minutes}m ${seconds}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-red-500 flex items-center gap-2">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No orders placed yet.</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white shadow-md border rounded-xl p-6 transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-500">
                  <strong>Order ID:</strong> #{order.id || `FOODY-${index + 1}`}
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Placed on:</strong>{" "}
                  {order.placedAt
                    ? new Date(order.placedAt).toLocaleString()
                    : "N/A"}
                </div>
              </div>

              <div className="text-sm mb-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.status === "Delivered"
                      ? "text-green-600"
                      : order.status === "Out for delivery"
                      ? "text-orange-500"
                      : order.status === "Preparing"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                >
                  {order.status || "Placed"}
                </span>
              </div>

              {order.statusMessage && (
                <div className="text-sm text-gray-700 mb-2">
                  {order.statusMessage}
                </div>
              )}

              {order.estimatedDeliveryTime && getCountdown(order.estimatedDeliveryTime, order.status) && (
                <div className="text-sm mb-2">
                  <strong>Estimated Delivery:</strong>{" "}
                  <span className="text-red-600 font-medium">
                    {getCountdown(order.estimatedDeliveryTime, order.status)}
                  </span>
                </div>
              )}

              <div className="mt-3">
                <strong>Items Ordered:</strong>
                {Array.isArray(order.items) ? (
                  <ul className="mt-1 text-sm text-gray-700 list-disc list-inside">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.quantity}× {item.name} – ₹
                        {(item.quantity * item.price).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-500 text-sm">Cart data missing</p>
                )}
              </div>

              {order.address && (
                <div className="text-sm text-gray-600 mt-4">
                  <strong>Delivery Address:</strong>
                  <div>
                    {order.address.flat}, {order.address.landmark}
                  </div>
                  <div>
                    {order.address.zip} – {order.address.city}
                  </div>
                </div>
              )}

              <div className="text-right font-bold text-lg text-gray-800 mt-4">
                Total Paid: ₹{Number(order.total).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
