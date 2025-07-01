import { motion } from "framer-motion";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { useCart } from "../context/CartContext";
import { auth } from "../firebase";
import React, { useState, useEffect } from "react";

const categories = [
  { name: "Pizza", image: "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg" },
  { name: "Biryani", image: "https://images.pexels.com/photos/7837978/pexels-photo-7837978.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80" },
  { name: "Salad", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80" },
  { name: "Drinks", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80" },
];

const moodThemes = {
  Spicy: { bg: "bg-red-50", text: "text-red-800", accent: "bg-red-500" },
  Sweet: { bg: "bg-pink-50", text: "text-pink-800", accent: "bg-pink-500" },
  Comfort: { bg: "bg-yellow-50", text: "text-yellow-800", accent: "bg-yellow-500" },
  Healthy: { bg: "bg-green-50", text: "text-green-800", accent: "bg-green-500" },
  default: { bg: "bg-white", text: "text-gray-800", accent: "bg-red-500" },
};

export default function ZomatoHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
  const [smartItem, setSmartItem] = useState(null);
  const [mood, setMood] = useState(localStorage.getItem("userMood") || "");

  const { clearCart, addToCart } = useCart();

  const getTheme = () => moodThemes[mood] || moodThemes["default"];
  const { bg, text, accent } = getTheme();

  const getDayName = (dateString) => {
    const day = new Date(dateString).getDay();
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day];
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const allOrders = JSON.parse(localStorage.getItem("foodyOrders")) || [];
        const userOrders = allOrders
          .filter((o) => o.userId === uid)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const last = userOrders[userOrders.length - 1];
        if (last && last.items.length > 0) {
          setLastOrder(last);
        }

        const itemMap = {};
        userOrders.forEach((order) => {
          const day = getDayName(order.timestamp);
          order.items.forEach((item) => {
            const name = item.name;
            if (!itemMap[name]) itemMap[name] = { count: 0, days: {} };
            itemMap[name].count += 1;
            itemMap[name].days[day] = (itemMap[name].days[day] || 0) + 1;
          });
        });

        let topItem = null;
        let maxDayCount = 0;
        Object.entries(itemMap).forEach(([name, data]) => {
          Object.entries(data.days).forEach(([day, count]) => {
            if (count > maxDayCount) {
              maxDayCount = count;
              topItem = { name, day };
            }
          });
        });

        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        if (topItem && topItem.day === today) {
          setSmartItem(topItem);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleReorder = (order) => {
    clearCart();
    setTimeout(() => {
      order.items.forEach((item) => {
        const itemWithId = {
          ...item,
          id: `${order.restaurantId}-${item.name}`,
          restaurantId: order.restaurantId,
          quantity: item.quantity,
        };
        addToCart(itemWithId, order.restaurantId);
      });
    }, 100);
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    localStorage.setItem("userMood", selectedMood);
  };

  const filteredRestaurants = restaurants.filter((rest) =>
    rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rest.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${bg} min-h-screen transition-colors duration-300`}>
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?food')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-4xl sm:text-6xl font-bold mb-4">
            Discover the best food & drinks in your city
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center bg-white text-black rounded-md shadow-md px-4 py-2 w-full max-w-lg">
            <MapPinIcon className="h-6 w-6 text-gray-500 mr-2" />
            <input type="text" placeholder="Enter your location" className="w-full outline-none" />
          </motion.div>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className={`${bg} border-l-4 border-orange-500 p-4 rounded shadow-md text-center`}>
          <h2 className={`text-xl font-semibold ${text}`}>{mood ? `You're craving ${mood} today!` : "What are you in the mood for?"}</h2>
          <p className={`text-sm mt-1 ${text}`}>Choose your mood to personalize your experience 🌟</p>

          <div className="flex justify-center flex-wrap mt-4 gap-2">
            {["Spicy", "Sweet", "Comfort", "Healthy"].map((m) => (
              <button
                key={m}
                onClick={() => handleMoodSelect(m)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${mood === m ? `${accent} text-white` : "bg-gray-200 text-gray-800"} hover:scale-105 transition`}
              >
                {m}
              </button>
            ))}
          </div>

          {mood && (
            <button
              onClick={() => {
                localStorage.removeItem("userMood");
                setMood("");
              }}
              className="mt-2 text-sm text-red-600 underline"
            >
              Change Mood
            </button>
          )}
        </div>
      </div>

      {/* Mood-Filtered Dishes */}
      {mood && (
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <h2 className="text-2xl font-semibold mb-4">Based on your <span className="text-red-500">{mood}</span> mood 👇</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {categories
              .filter((cat) => {
                if (mood.includes("Spicy")) return cat.name === "Biryani" || cat.name === "Pizza";
                if (mood.includes("Sweet")) return cat.name === "Desserts";
                if (mood.includes("Comfort")) return cat.name === "Burgers" || cat.name === "Drinks";
                if (mood.includes("Healthy")) return cat.name === "Salad" || cat.name === "Drinks";
                return true;
              })
              .map((category, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} className="min-w-[150px] bg-white rounded-lg p-4 shadow hover:shadow-md flex flex-col items-center">
                  <img src={category.image} alt={category.name} className="w-24 h-24 object-cover rounded-full mb-2" />
                  <p className="text-center font-medium">{category.name}</p>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Smart Suggestion / Last Order */}
      {lastOrder && (
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-gray-800 font-medium">🧠 You liked <strong>{lastOrder.items[0].name}</strong> recently. Want to repeat?</p>
            <button onClick={() => handleReorder(lastOrder)} className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Reorder</button>
          </div>
        </div>
      )}
      {smartItem && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-gray-800 font-medium">💡 You usually order <strong>{smartItem.name}</strong> on <strong>{smartItem.day}</strong>. Want to repeat?</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 pl-10 pr-4 py-3 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="bg-gray-50 py-10 mt-6">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Featured Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.slice(0, 4).map((rest, index) => (
              <Link to={`/restaurant/${rest.slug}`} key={index}>
                <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
                  <img src={rest.image} alt={rest.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{rest.name}</h3>
                    <p className="text-sm text-gray-600">{rest.cuisine}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/restaurants">
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">View All</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-8">
        <p>© 2025 FoodyGaadi. Built by Harsh Rana</p>
      </footer>
    </div>
  );
}
