import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import logo from '../../assets/udobn_logo.png'
import { useLocation } from 'react-router-dom';
import razorpay from '../../assets/razorpay.png'
export default function CheckoutPage() {
  const location = useLocation();
  useEffect(() => {
    // Reset scroll position to the top of the page whenever the route changes
    window.scrollTo(0, 0);
  }, [location]);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showShippingAddress, setShowShippingAddress] = useState(false);
  const { cart, subtotal } = useCart();
  
  // Calculate shipping fee
  const shippingFee = 49.00;
  const total = subtotal + shippingFee;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePlaceOrder = async () => {
    const orderData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('streetAddress').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      amount: total,
      items: cart
    };
  
    const customerId ="65123456789abcdef1234567"; // Get logged-in user ID
    if (!customerId) {
      alert("Please log in to place an order.");
      return;
    }
  
    if (paymentMethod === "cash") {
      try {
        const products = cart.map(item => ({
          productId: "65abcdef1234567890123456", // Ensure correct product ID
          quantity: 2,
          size: "M",
        }));
  
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId,
            products,
            totalAmount: { "inr": 1299, "usd": 15.65  }, // Convert INR to USD dynamically
            paymentMethod: "COD",
            paymentStatus: "Pending",
            deliveryAddress: {
              street: orderData.address,
              city: orderData.city,
              state: orderData.state,
              country: 'India',
              postalCode: orderData.zipCode,
            },
            orderStatus: "Pending",
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert('Order placed successfully!');
          localStorage.removeItem("cart"); // Clear cart
          window.location.href = "/order-success"; // Redirect
        } else {
          alert('Failed to place order: ' + result.message);
        }
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Unable to place order. Please try again.");
      }
    } else if (paymentMethod === "razorpay") {
      initiateRazorpayPayment();
    } else {
      alert('Please select a payment method.');
    }
  };
  
  const initiateRazorpayPayment = async () => {
    // Collect form data
    const orderData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('streetAddress').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      amount: total,
      items: cart
    };
    
    try {
      // Step 1: Call your backend to create a Razorpay order
      const response = await fetch('http://localhost:5000/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          receipt: 'order_rcpt_' + Date.now(),
          notes: {
            customerName: orderData.firstName + ' ' + orderData.lastName,
            email: orderData.email,
            items: JSON.stringify(cart.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })))
          }
        }),
      });
      
      const orderResponse = await response.json();
      
      // Step 2: Configure Razorpay options with the order_id from backend
      const options = {
        key: "rzp_test_oGloudbiO4K40t", // Replace with your actual Razorpay Key ID
        amount: orderResponse.amount, // amount from the response
        currency: orderResponse.currency,
        name: "Udobn",
        description: "Purchase from Your Store",
        image: {logo}, // Replace with your store logo
        order_id: orderResponse.id, // Order ID from the response
        handler: function(response) {
          // This function is called when payment is successful
          verifyPayment(response, orderData);
        },
        prefill: {
          name: orderData.firstName + " " + orderData.lastName,
          email: orderData.email,
          contact: orderData.phone
        },
        notes: {
          address: orderData.address + ", " + orderData.city + ", " + orderData.state + " - " + orderData.zipCode
        },
        theme: {
          color: "#EF4444" // Red color to match your UI
        }
      };
      
      // Create Razorpay instance and open payment dialog
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response){
        alert("Payment failed. " + response.error.description);
      });
      razorpay.open();
      
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Unable to initiate payment. Please try again.");
    }
  };

  const verifyPayment = async (paymentResponse, orderData) => {
    try {
      // Send payment verification details to backend
      const response = await fetch('http://localhost:5000/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          orderDetails: orderData
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Payment verification successful
        alert("Payment successful! Order placed.");
        // Redirect to success page or clear cart
        // window.location.href = "/order-success";
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Unable to verify payment. Please contact support.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6">
      {/* Left Column - Billing Details */}
      <div className="w-full md:w-3/5">
        <h2 className="text-2xl font-bold mb-6">BILLING DETAILS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="firstName" className="block mb-2">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block mb-2">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="company" className="block mb-2">
            Company name (optional)
          </label>
          <input
            type="text"
            id="company"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="country" className="block mb-2">
            Country / Region <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="country"
              className="w-full border border-gray-300 rounded p-2 appearance-none"
              defaultValue="India"
              required
            >
              <option value="India">India</option>
              <option value="UK">UK</option>
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="streetAddress" className="block mb-2">
            Street address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="streetAddress"
            placeholder="House number and street name"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            required
          />
          <input
            type="text"
            id="streetAddressCont"
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="city" className="block mb-2">
            Town / City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="state" className="block mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="state"
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="zipCode" className="block mb-2">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
      </div>
      
      {/* Right Column - Order Summary */}
      <div className="w-full md:w-2/5">
        <div className="bg-gray-50 p-6 rounded">
          <h2 className="text-2xl font-bold mb-6">YOUR ORDER</h2>
          
          <div className="flex justify-between mb-4 font-semibold">
            <span>PRODUCT</span>
            <span>SUBTOTAL</span>
          </div>
          
          <div className="border-t border-gray-200 pt-4 pb-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between mb-2">
                <span>
                  {item.name} - {item.size}, {item.color || 'Default'} × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between py-4 border-t border-gray-200">
            <span>Subtotal</span>
            <span className="text-red-500">₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between py-4 border-t border-gray-200">
            <span>Shipping</span>
            <span>Delivery Fees: ₹{shippingFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between py-4 border-t border-gray-200 font-bold">
            <span>Total</span>
            <span className="text-red-500">₹{total.toFixed(2)}</span>
          </div>
          
          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="cashOnDelivery" 
                  name="payment" 
                  value="cash" 
                  checked={paymentMethod === "cash"} 
                  onChange={() => setPaymentMethod("cash")}
                  className="mr-2" 
                />
                <label htmlFor="cashOnDelivery">Cash on delivery</label>
              </div>
            </div>
            
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="payByRazorpay" 
                  name="payment" 
                  value="razorpay" 
                  checked={paymentMethod === "razorpay"} 
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mr-2" 
                />
                <label htmlFor="payByRazorpay" className="flex items-center">
                  <span className="mr-2">Pay by </span>
                  <img src={razorpay} alt="Razorpay" className="h-12" />
                </label>
              </div>
              {paymentMethod === "razorpay" && (
                <p className="text-sm text-gray-500 ml-6">Pay securely using Razorpay - Credit/Debit Card, UPI, NetBanking & more.</p>
              )}
            </div>
            
            <p className="text-xs mb-6">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link to="/privacy" className="text-blue-500">Privacy policy</Link>.
            </p>
            
            <button 
              className="w-full py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
              onClick={handlePlaceOrder}
            >
              PLACE ORDER
            </button>
          </div>
        </div>

        <div className="fixed bottom-6 right-6">
          <div className="bg-green-500 rounded-full p-3">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}