import React, { createContext, useState, useEffect } from 'react';
export const WishlistContext = createContext();
const loadWishlist = () => {
  try {
    const stored = localStorage.getItem('wishlistItems');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(loadWishlist);
  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((x) => x._id === product._id);
      return exists ? prev : [...prev, product];
    });
  };
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((x) => x._id !== id));
  };
  const isInWishlist = (id) => wishlistItems.some((x) => x._id === id);
  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};