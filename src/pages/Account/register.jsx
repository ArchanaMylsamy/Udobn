import React, { useState } from 'react';
import {motion} from "framer-motion"
import { Truck, MapPin, Tag } from "lucide-react"
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
  )
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
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
          {/* First Name Field */}
          <div>
            <label htmlFor="firstName" className="block text-base text-gray-600 mb-2">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label htmlFor="lastName" className="block text-base text-gray-600 mb-2">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
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
      <section className='pt-20 px-4'>
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