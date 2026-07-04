import React, { createContext, useState, useEffect } from 'react';
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);
    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product ? { ...x, quantity: qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, {
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: qty
      }]);
    }
  };
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };
  const clearCart = () => {
    setCartItems([]);
  };
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};