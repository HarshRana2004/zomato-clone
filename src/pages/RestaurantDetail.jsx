import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { useCart } from "../context/CartContext";

export default function RestaurantDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const match = restaurants.find((r) => r.slug === slug);
      setRestaurant(match);
      if (match?.items?.length > 0) {
        const firstCategory = match.items[0].category;
        setActiveCategory(firstCategory);
      }
    }, 1000); // simulate shimmer for 1s

    return () => clearTimeout(timeout);
  }, [slug]);

  const handleAddToCart = (item) => {
    const uniqueKey = `${slug}-${item.name}`;
    const qty = quantities[uniqueKey] || 1;
    const itemWithId = {
      ...item,
      id: uniqueKey,
      restaurantId: slug,
      quantity: qty,
    };
    addToCart(itemWithId, slug);
  };

  if (!restaurant) {
    // 🌀 Shimmer loading screen
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
        {/* Hero shimmer */}
        <div className="w-full h-72 md:h-96 bg-gray-200 rounded-lg mb-8"></div>

        {/* Category shimmer */}
        <div className="flex gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-8 bg-gray-200 rounded-full"></div>
          ))}
        </div>

        {/* Menu item shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                  <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded ml-4"></div>
              </div>
              <div className="mt-3 flex space-x-3">
                <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Group items by category
  const categorizedItems = restaurant.items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {restaurant.name}
          </h1>
          <p className="text-sm text-gray-200 mt-1">
            {restaurant.cuisine} • {restaurant.location || "Unknown"}
          </p>
          <p className="text-gray-300 mt-2 text-sm md:text-base max-w-2xl">
            {restaurant.description}
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {Object.keys(categorizedItems).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${activeCategory === category
                ? "bg-red-500 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {categorizedItems[activeCategory]?.map((item, index) => {
          const uniqueKey = `${slug}-${item.name}`;
          return (
            <div key={index} className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="mt-1 font-semibold">₹{item.price}</p>
                </div>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-16 h-16 object-cover rounded ml-4"
                  />
                )}
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [uniqueKey]: Math.max((prev[uniqueKey] || 1) - 1, 1),
                      }))
                    }
                    className="bg-gray-200 text-gray-800 px-2.5 py-1 rounded-full hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <span className="min-w-[32px] text-center font-semibold">
                    {quantities[uniqueKey] || 1}
                  </span>
                  <button
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [uniqueKey]: (prev[uniqueKey] || 1) + 1,
                      }))
                    }
                    className="bg-gray-200 text-gray-800 px-2.5 py-1 rounded-full hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
