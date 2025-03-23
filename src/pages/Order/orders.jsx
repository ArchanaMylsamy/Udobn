import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Package, Truck, CheckCircle, XCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
      case 'pending':
        return { color: 'bg-blue-100 text-blue-800', icon: <Package className="w-4 h-4 mr-1" /> };
      case 'shipped':
        return { color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-4 h-4 mr-1" /> };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4 mr-1" /> };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-4 h-4 mr-1" /> };
    }
  };

  const { color, icon } = getStatusConfig(status);

  return (
    <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status}
    </span>
  );
};

const CustomerOrdersPage = () => {
  const { customerId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);
  const { currency, country } = useCurrency();

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      setLoading(true);
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        alert("Please log in to view your orders.");
        return;
      }
      try {
        // Update the API endpoint to match your backend
        const response = await fetch(`http://localhost:5000/api/orders/customer/${userId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }
        
        const data = await response.json();
        
        // Use the data directly as it matches your backend structure
        setOrders(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch orders. Please try again later.");
        setLoading(false);
        console.error("Error fetching customer orders:", err);
      }
    };
  
    fetchCustomerOrders();
  }, [customerId]);

  const formatCurrency = (amount) => {
    if (!amount) return "-";
    
    // Check if amount is an object with currency-specific values
    if (typeof amount === 'object') {
      if (currency === 'USD' && amount.usd !== undefined) {
        return `$${amount.usd.toFixed(2)}`;
      } else if (amount.inr !== undefined) {
        return `₹${amount.inr.toFixed(2)}`;
      }
    }
    
    // Fallback for simple numeric amounts
    const symbol = currency === 'USD' ? '$' : '₹';
    const conversionRate = currency === 'USD' ? 1 : 82.5;
    const convertedAmount = (amount * conversionRate).toFixed(2);
    return `${symbol}${convertedAmount}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2" />
            Order History
          </h1>
          {customer && (
            <p className="text-gray-600">
              Customer: {customer.name} ({customer.email})
            </p>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg border overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Order #{order._id}</span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(order.orderDate)}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm">
                    <span className="font-medium flex items-center">
                      Total: {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  
                </div>
              </div>
              
              <div className="p-4">

                <div className="space-y-4">
                    {order.products && order.products.map((product, index) => (
                        <div key={`${order._id}-product-${index}`} className="flex items-center gap-4">
                        <div className="flex-1">
                        <div className="font-medium">{product.productId?.name}</div>
                        <div className="text-sm text-gray-500">
                            Size: {product.size} | Qty: {product.quantity}
                        </div>
                        </div>
                    </div>
                    ))}
              </div>
                

                
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm">
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod || "Not specified"}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Payment Status:</span> {order.paymentStatus || "Not specified"}
                  </div>
                  {order.deliveryAddress && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">Delivery Address:</span><br/>
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}<br/>
                      {order.deliveryAddress.country} - {order.deliveryAddress.postalCode}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;