// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  
  useEffect(() => {
    // Load cart from localStorage if it exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Load selected sizes from localStorage if they exist
    const savedSizes = localStorage.getItem('selectedSizes');
    if (savedSizes) {
      setSelectedSizes(JSON.parse(savedSizes));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Save selected sizes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedSizes', JSON.stringify(selectedSizes));
  }, [selectedSizes]);
  
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size
    });
  };
  
  const addToCart = (product) => {
    const selectedSize = selectedSizes[product.id] || product.sizes[0];
    
    // Check if item already exists in cart with the same size
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.size === selectedSize
    );
    
    if (existingItemIndex >= 0) {
      // If item exists, increase quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // If item doesn't exist, add it to cart
      setCart([...cart, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image || "/placeholder.svg",
        color: product.color || "Default",
        size: selectedSize,
        quantity: 1
      }]);
    }
    
    // Open the cart
    setIsCartOpen(true);
  };
  
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };
  
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  // Calculate cart items count
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const value = {
    cart,
    isCartOpen,
    selectedSizes,
    subtotal,
    cartItemsCount,
    setIsCartOpen,
    handleSizeSelect,
    addToCart,
    removeFromCart,
    updateQuantity
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};