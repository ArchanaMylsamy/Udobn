import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 px-4 py-3 border-l-4 rounded-lg shadow-lg ${typeStyles[type]} transition-all duration-300 ease-in-out`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm">{message}</p>
        <button 
          onClick={onClose} 
          className="ml-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center text-center space-y-4"
  >
    <div className="p-2">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <p className="text-gray-600 text-sm md:text-base tracking-wide">{text}</p>
  </motion.div>
);

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        showToast(result.message, 'success');
        // Navigate after a short delay to allow toast to be visible
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Error registering:', error);
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}

      <div className="w-full max-w-md space-y-8">
        {/* Registration Header */}
        <div className="text-center">
          <h1 className="text-3xl font-normal text-gray-900">Create account</h1>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="Name" className="block text-base text-gray-600 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-base text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-base text-gray-600 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-base text-gray-600 mb-2">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-base text-gray-600 mb-2">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Create Account Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-auto bg-gray-900 text-white px-8 py-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Create account
            </button>
          </div>

          {/* Login Link */}
          <div className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-gray-900 hover:underline">
              Log in here
            </a>
          </div>
        </form>
      </div>
      <section className="pt-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <FeatureCard icon={Truck} text="Free domestic delivery on $150+" />
          <FeatureCard icon={MapPin} text="Your nearest store" />
          <FeatureCard icon={Tag} text="Gift cards" />
        </div>
      </section>
    </div>
  );
};

export default RegistrationForm;