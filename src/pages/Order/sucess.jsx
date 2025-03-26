import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const API_BASE_URL="https://udobn-backend.vercel.app"
const OrderSuccessPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we have order data passed through location state
    if (location.state && location.state.orderDetails) {
      setOrderDetails(location.state.orderDetails);
      setLoading(false);
    } else {
      // Otherwise, fetch the most recent order from API
      fetchLatestOrder();
    }
  }, [location]);

  const fetchLatestOrder = async () => {
    try {
      const customerId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!customerId || !token) {
        navigate('/login', { replace: true });
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/orders/customer/${customerId}/latest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      console.log(data)
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateEstimatedDelivery = (orderDate) => {
    const date = new Date(orderDate);
    const deliveryStart = new Date(date);
    const deliveryEnd = new Date(date);
    
    // Add 4-5 days for delivery
    deliveryStart.setDate(date.getDate() + 4);
    deliveryEnd.setDate(date.getDate() + 5);
    
    const options = { month: 'long', day: 'numeric' };
    return `${deliveryStart.toLocaleDateString(undefined, options)}-${deliveryEnd.toLocaleDateString(undefined, options)}, ${deliveryEnd.getFullYear()}`;
  };

  const getTotalItems = (products) => {
    return products.reduce((total, product) => total + (product.quantity || 1), 0);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-gray-500 rounded-full" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600">Order Not Found</h2>
          <p className="mt-2 text-gray-600">We couldn't find your recent order details.</p>
          <Link to="/" className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-md ">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Determine currency symbol based on order amounts
//   const currencySymbol = orderDetails.totalAmountUsd > 0 ? '$' : '₹';
  
  // Calculate shipping fee (this should match the logic from CheckoutPage)
//   const shippingFee = currencySymbol === '$' ? 0.59 : 49.00;
  
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Success Message */}
          <div className="md:w-1/3 bg-green-200 p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-black">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-900 text-center">Order Confirmed!</h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Thank you for your purchase. We've received your order and are processing it now.
            </p>
            <div className="mt-6 text-sm font-medium text-gray-700 text-center">
              A confirmation email has been sent to your registered email address.
            </div>
          </div>

          {/* Right Side - Order Details */}
          <div className="md:w-2/3 p-6">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-500">Order Number</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{orderDetails._id}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <div className="text-sm font-medium text-gray-500">Order Date</div>
                <div className="mt-1 text-sm text-gray-900">{formatDate(orderDetails.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Expected Delivery</div>
                <div className="mt-1 text-sm text-gray-900">{calculateEstimatedDelivery(orderDetails.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Total Amount</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                    {orderDetails.totalAmount.inr !== 0 ? `INR: ${orderDetails.totalAmount.inr}` : orderDetails.totalAmount.usd !== 0 ? `USD: ${orderDetails.totalAmount.usd}` : ''}
                    </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Order Summary</h3>
                    <span className="text-sm text-gray-700 font-medium">Total Items: {orderDetails.products.length}</span>
                </div>

                <div className="flex flex-col text-sm text-gray-600">
                {orderDetails.products.map((item, index) => (
                    <div key={index} className="flex justify-between">
                    <span>{item.productId.name} (Size: {item.size})</span>
                    <span>Qty: {item.quantity}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-start gap-4">
              <Link 
                to="/orders" 
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View My Orders
              </Link>
              
              <Link 
                to="/" 
                className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;