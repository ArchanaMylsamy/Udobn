// First, modify SimpleCart.jsx to navigate to checkout page
import React from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function SimpleCart() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal
  } = useCart();
  
  const navigate = useNavigate();
  
  if (!isCartOpen) return null;
  
  const handleCheckout = () => {
    const token = sessionStorage.getItem('token');
  
    if (!token) {
      alert('Please log in to proceed to checkout!');
      navigate('/login');
    } else {
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };
  
  
  return (
    <div className="simple-cart-overlay">
      <div className="simple-cart-drawer">
        <div className="simple-cart-header">
          <h2>Cart {cart.length > 0 ? `(${cart.length})` : ''}</h2>
          <button className="simple-close-cart" onClick={() => setIsCartOpen(false)}>×</button>
        </div>
        
        {cart.length === 0 ? (
          <div className="simple-empty-cart">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="simple-cart-promo">
              <p>End of Season 50% off items are (final sale)</p>
            </div>
            
            <div className="simple-cart-items">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.size}`} className="simple-cart-item">
                  <div className="simple-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="simple-item-details">
                    <div className="simple-item-top">
                      <h3>{item.name}</h3>
                      <button
                        className="simple-remove-item"
                        onClick={() => removeFromCart(index)}
                      >
                        ×
                      </button>
                    </div>
                    <p>Color: {item.color || 'Default'}</p>
                    <p>Size: {item.size}</p>
                    <div className="simple-quantity-controls">
                      <button onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}>−</button>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateQuantity(index, val);
                          }
                        }}
                      />
                      <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="simple-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="simple-cart-footer">
              <div className="simple-cart-subtotal">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="simple-shipping-info">
                <span>Shipping</span>
                <span>CALCULATED AT CHECKOUT</span>
              </div>
              
              <button className="simple-checkout-btn" onClick={handleCheckout}>Checkout</button>
              <button className="simple-continue-shopping" onClick={() => setIsCartOpen(false)}>
                Or continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}