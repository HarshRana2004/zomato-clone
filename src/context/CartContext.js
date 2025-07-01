import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart on login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const savedCart = localStorage.getItem(`foodyCart_${user.uid}`);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          setCartItems(parsed.items || []);
          setRestaurantId(parsed.restaurantId || null);
        }
      } else {
        setCartItems([]);
        setRestaurantId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save cart per user
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      localStorage.setItem(
        `foodyCart_${user.uid}`,
        JSON.stringify({ items: cartItems, restaurantId })
      );
    }
  }, [cartItems, restaurantId]);

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addToCart = (item, restId) => {
    const quantity = item.quantity || 1;

    if (!restaurantId || restaurantId === restId) {
      const exists = cartItems.find((i) => i.id === item.id);
      if (exists) {
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: quantity } // ✅ just set new quantity
              : i
          )
        );
      } else {
        setCartItems((prev) => [...prev, { ...item, quantity }]);
      }
      setRestaurantId(restId);
    } else {
      if (
        window.confirm(
          "Your cart contains items from another restaurant. Clear cart?"
        )
      ) {
        setCartItems([{ ...item, quantity }]);
        setRestaurantId(restId);
      }
    }
  };


  const removeFromCart = (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    if (updated.length === 0) setRestaurantId(null);
  };

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        restaurantId,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
