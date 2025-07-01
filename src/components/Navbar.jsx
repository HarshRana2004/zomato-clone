import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import defaultAvatar from "../assets/default-avatar.png";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { cartItems } = useCart() || {}; // ✅ Fix: safe fallback if undefined
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const toggleProfileMenu = () => {
    setProfileMenuOpen((open) => !open);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", closeMenu);
    } else {
      document.removeEventListener("mousedown", closeMenu);
    }
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [profileMenuOpen]);

  const getTotalCartItems = () => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  return (
    <nav className="bg-white shadow-md p-4 px-6 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-red-500">
        Foody<span className="text-gray-800">Gaadi</span>
      </Link>

      <div className="flex items-center gap-6">
        {/* ✅ Cart icon only for logged-in user */}
        {user && (
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            🛒
            {getTotalCartItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalCartItems()}
              </span>
            )}
          </div>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-red-500 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full font-medium"
            >
              Signup
            </Link>
          </>
        ) : (
          <div className="relative" ref={profileMenuRef}>
            <img
              src={user.photoURL || defaultAvatar}
              alt="Profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={toggleProfileMenu}
            />
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md border rounded-md py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
