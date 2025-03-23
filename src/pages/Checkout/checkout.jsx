import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import logo from '../../assets/udobn_logo.png';
import { useLocation } from 'react-router-dom';
import razorpay from '../../assets/razorpay.png';

export default function CheckoutPage() {
  const location = useLocation();
  useEffect(() => {
    // Reset scroll position to the top of the page whenever the route changes
    window.scrollTo(0, 0);
  }, [location]);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showShippingAddress, setShowShippingAddress] = useState(false);
  const { cart } = useCart();
  const { currency, symbol } = useCurrency();
  
  // Calculate shipping fee based on current currency
  const shippingFee = currency === 'USD' ? 0 : 0;
  
  // Calculate cart subtotal based on currency
  const calculateSubtotal = () => {
    if (!cart || cart.length === 0) return 0;
    
    return cart.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  // Get the item price based on current currency
  const getItemPrice = (item) => {
    if (item && item.price) {
      if (typeof item.price === 'object') {
        return currency === 'USD' ? item.price.usd : item.price.inr;
      }
      return item.price;
    }
    return 0;
  };

  // Calculated values based on current currency
  const currencySubtotal = calculateSubtotal();
  const currencyTotal = currencySubtotal + shippingFee;

  // Calculate both currency totals for the API
  const getINRTotal = () => {
    if (currency === 'INR') {
      return currencyTotal;
    } else {
      // Convert USD to INR for backend if needed
      // Using a fixed conversion rate for demo purposes
      return currencyTotal * 83; // Approximate conversion rate
    }
  };

  const getUSDTotal = () => {
    if (currency === 'USD') {
      return currencyTotal;
    } else {
      // Convert INR to USD for backend if needed
      return currencyTotal / 83; // Approximate conversion rate
    }
  };

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
    const customerId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!customerId) {
      alert("Please log in to place an order.");
      return;
    }
  
    // Get form data
    const orderData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('streetAddress').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      country: document.getElementById('country').value, 
      amount: currencyTotal,
      items: cart
    };
    
    // Form validation
    if (!orderData.firstName || !orderData.lastName || !orderData.email || !orderData.phone || 
        !orderData.address || !orderData.city || !orderData.state || !orderData.zipCode) {
      alert("Please fill all required fields.");
      return;
    }
  
    // Calculate both currency totals for the API
    const totalAmountInr = getINRTotal();
    const totalAmountUsd = getUSDTotal();
  
    // Extract product information for the order
    const products = cart.map(item => ({
      productId: item.id, 
      quantity: item.quantity || 1,
      size: item.size || "M",
      price: item.price
    }));
  
    try {
      if (paymentMethod === "COD") {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            customerId,
            products,
            totalAmountInr, // Sending as separate fields to match backend
            totalAmountUsd, // Sending as separate fields to match backend
            paymentMethod,
            paymentStatus: "Pending",
            deliveryAddress: {
              street: orderData.address,
              city: orderData.city,
              state: orderData.state,
              country: orderData.country,
              postalCode: orderData.zipCode,
            },
            orderStatus: "Pending",
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert('Order placed successfully!');
          localStorage.removeItem("cart");
          window.location.href = "/order-success";
        } else {
          alert('Failed to place order: ' + result.message);
        }
      } else if (paymentMethod === "razorpay") {
        initiateRazorpayPayment(orderData, totalAmountInr, totalAmountUsd);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Unable to place order. Please try again.");
    }
  };
  
  const initiateRazorpayPayment = async (orderData, totalAmountInr, totalAmountUsd) => {
    try {
      // Determine which amount to use based on currency
      let amountInSmallestUnit;
      let currencyToUse = currency; // Assuming currency is defined in parent scope
      
      if (currencyToUse === 'INR') {
        amountInSmallestUnit = totalAmountInr ; // Convert to paise
      } else if (currencyToUse === 'USD') {
        amountInSmallestUnit = totalAmountUsd ; // Convert to cents
      } else {
        throw new Error("Unsupported currency");
      }
      
      // Step 1: Call your backend to create a Razorpay order with the current currency
      const response = await fetch('http://localhost:5000/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: amountInSmallestUnit, // Amount in smallest currency unit
          currency: currencyToUse, // Using the selected currency
          receipt: 'order_rcpt_' + Date.now(),
          notes: {
            customerName: orderData.firstName + ' ' + orderData.lastName,
            email: orderData.email,
            items: JSON.stringify(cart.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity || 1,
              price: getItemPrice(item)
            })))
          }
        }),
      });
      
      const orderResponse = await response.json();
      
      if (!orderResponse.id) {
        throw new Error("Failed to create Razorpay order");
      }
      
      // Step 2: Configure Razorpay options with the order_id from backend
      const options = {
        key: "rzp_test_oGloudbiO4K40t", // Your Razorpay Key ID
        amount: orderResponse.amount, // amount from the response
        currency: orderResponse.currency,
        name: "Udobn",
        description: "Purchase from Your Store",
        image: logo,
        order_id: orderResponse.id, // Order ID from the response
        handler: function(response) {
          // This function is called when payment is successful
          verifyPayment(response, orderData, totalAmountInr, totalAmountUsd);
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
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function(response){
        // When payment fails, create order with failed status
        createOrder(orderData, "Failed", response.error.description, totalAmountInr, totalAmountUsd);
        alert("Payment failed. " + response.error.description);
      });
      razorpayInstance.open();
      
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Unable to initiate payment. Please try again.");
    }
  };
  
  const verifyPayment = async (paymentResponse, orderData, totalAmountInr, totalAmountUsd) => {
    try {
      // Get logged-in user ID
      const customerId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      // Extract product information from cart for order creation
      const products = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1,
        size: item.size || '',
        price: item.price
      }));
  
      // Send payment verification details to backend
      const response = await fetch('http://localhost:5000/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          orderDetails: {
            ...orderData,
            customerId,
            products,
            totalAmountInr, 
            totalAmountUsd,
            deliveryAddress: {
              street: orderData.address,
              city: orderData.city,
              state: orderData.state,
              country: orderData.country,
              postalCode: orderData.zipCode,
            },
          }
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Payment verification successful - create order with paid status
        createOrder(orderData, "Paid", paymentResponse.razorpay_payment_id, totalAmountInr, totalAmountUsd);
        alert("Payment successful! Order placed.");
        localStorage.removeItem("cart"); // Clear cart
        window.location.href = "/order-success"; // Redirect to success page
      } else {
        // Payment verification failed - create order with failed status
        createOrder(orderData, "Failed", "Verification failed", totalAmountInr, totalAmountUsd);
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      // Create order with failed status in case of exception
      createOrder(orderData, "Failed", "Verification error", totalAmountInr, totalAmountUsd);
      alert("Unable to verify payment. Please contact support.");
    }
  };
  
  // New function to create order in the orders table
  const createOrder = async (orderData, paymentStatus, paymentId, totalAmountInr, totalAmountUsd) => {
    try {
      const customerId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      // Determine which amount to use based on currency and zero out the other
      let finalAmountInr = 0;
      let finalAmountUsd = 0;
      
      if (currency === 'INR') {
        finalAmountInr = totalAmountInr;
        finalAmountUsd = 0;
      } else if (currency === 'USD') {
        finalAmountInr = 0;
        finalAmountUsd = totalAmountUsd;
      }
      
      // Extract product information from cart
      const products = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity || 1,
        size: item.size || '',
        price: item.price
      }));
      
      // Create order in the database
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customerId,
          products,
          totalAmountInr: finalAmountInr,
          totalAmountUsd: finalAmountUsd,
          // Fix: Use correct payment method enum value (either "COD" or "Razorpay")
          paymentMethod: "Razorpay", // Make sure this matches exactly with the enum in your schema
          paymentStatus: paymentStatus, // "Paid" or "Failed"
          paymentId: paymentId, // Payment ID or failure reason
          // Fix: Rename to deliveryAddress to match schema requirements
          deliveryAddress: {
            // Include all required fields
            street: orderData.address,
            city: orderData.city,
            state: orderData.state,
            country: orderData.country,
            postalCode: orderData.zipCode
          },
          orderStatus: paymentStatus === "Paid" ? "Confirmed" : "Cancelled"
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        console.error("Failed to create order record:", result.message);
      }
    } catch (error) {
      console.error("Error creating order record:", error);
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
            {cart && cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex justify-between items-center mb-3 py-2">
                  <div className="flex items-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded mr-3" 
                    />
                    <span>
                      {item.name} - {item.size || "M"}, × {item.quantity || 1}
                    </span>
                  </div>
                  <span>{symbol}{(getItemPrice(item) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">Your cart is empty</div>
            )}
          </div>
          
          <div className="flex justify-between py-4 border-t border-gray-200">
            <span>Subtotal</span>
            <span className="text-red-500">{symbol}{currencySubtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between py-4 border-t border-gray-200">
            <span>Shipping</span>
            <span>Delivery Fees: {symbol}{shippingFee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between py-4 border-t border-gray-200 font-bold">
            <span>Total</span>
            <span className="text-red-500">{symbol}{currencyTotal.toFixed(2)}</span>
          </div>
          
          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="COD" 
                  name="paymentMethod" 
                  value="COD" 
                  checked={paymentMethod === "COD"} 
                  onChange={() => setPaymentMethod("COD")}
                  className="mr-2" 
                />
                <label htmlFor="COD">Cash on delivery</label>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="payByRazorpay" 
                  name="paymentMethod" 
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