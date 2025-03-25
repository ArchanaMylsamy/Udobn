import React , {useState} from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
export default function SimpleCart() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity
  } = useCart();
  
  // Use currency context separately
  const { currency, formatPrice } = useCurrency();
  const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const showToast = (message, type = 'info') => {
      setToast({ message, type });
    };
    
    const clearToast = () => {
      setToast(null);
    };
  if (!isCartOpen) return null;
  
  const handleCheckout = () => {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
   
      showToast("Please log in to proceed to checkout!", 'error');
      navigate('/login');
    } else {
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };
  
  // Calculate subtotal here instead of in CartContext to use the current currency
  const subtotal = cart.reduce((total, item) => {
    const itemPrice = currency === "USD" ? item.price.usd : item.price.inr;
    return total + itemPrice * item.quantity;
  }, 0);
  
  // Helper to format currency
  const formatCurrency = (amount) => {
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`;
    } else {
      return `₹${amount.toFixed(2)}`;
    }
  };
  
  return (
    <div className="simple-cart-overlay">
       {/* Toast Notification */}
                         {toast && (
                          <Toast 
                            message={toast.message} 
                            type={toast.type} 
                            onClose={clearToast} 
                          />
                        )}
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
              {cart.map((item, index) => {
                // Get the current price based on currency
                const itemPrice = currency === "USD" ? item.price.usd : item.price.inr;
                
                return (
                  <div key={`${item.id}-${item.size}-${index}`} className="simple-cart-item">
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
                      {formatCurrency(itemPrice * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="simple-cart-footer">
              <div className="simple-cart-subtotal">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
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