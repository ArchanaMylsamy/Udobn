import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Tag } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/customers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        // Redirect to login page or another page
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Create Account Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-auto bg-gray-900 text-white px-8 py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
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