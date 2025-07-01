import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { restaurants } from "../data/restaurants";

export default function AllRestaurants() {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    // Fix: Corrected spread operator usage
    let sorted = [...restaurants].filter((r) => r.distanceKm <= 12);
    setFiltered(sorted);
  }, []);

  return (
    <div className="min-h-screen bg-white py-10 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">All Restaurants Nearby</h1>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-600">No restaurants found within 12 km radius.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((rest, idx) => (
            <Link to={`/restaurant/${rest.slug}`} key={idx}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{rest.name}</h2>
                  <p className="text-gray-500 text-sm">{rest.cuisine}</p>
                  <p className="text-gray-400 text-xs">{rest.distanceKm} km away</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
