import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <CheckCircleIcon className="w-20 h-20 text-green-500 animate-bounce" />
      <h1 className="text-3xl font-bold mt-4 text-green-600">Payment Successful!</h1>
      <p className="text-gray-700 mt-2 text-center">
        Your order has been placed. Sit back and relax while your food is being prepared.
      </p>

      {/* Delivery Info */}
      <div className="mt-6 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-md">
        🍽️ Estimated delivery in <span className="font-bold">30 minutes</span>
      </div>

      <Link
        to="/"
        className="mt-8 inline-block bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
