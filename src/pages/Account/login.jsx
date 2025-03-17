import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Tag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const PasswordResetForm = ({ onCancel }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Password reset failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-normal text-gray-900">Reset your password</h1>
        <p className="mt-2 text-gray-600">We will send you an email to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="reset-email" className="block text-base text-gray-600 mb-2">
            Email
          </label>
          <input
            id="reset-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-gray-900 text-white px-8 py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 hover:underline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        // Store the token securely (e.g., in a cookie or local storage)
        sessionStorage.setItem('token', result.token);
        // Redirect to the previous page or a default one
        const from = localStorage.getItem('lastVisited') || '/';
        navigate(from, { replace: true });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  if (showPasswordReset) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <PasswordResetForm onCancel={() => setShowPasswordReset(false)} />
        <section className="pt-20 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
            <FeatureCard icon={Truck} text="Free domestic delivery on $150+" />
            <FeatureCard icon={MapPin} text="Your nearest store" />
            <FeatureCard icon={Tag} text="Gift cards" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-normal text-gray-900">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-base text-gray-600 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-base text-gray-600">
                Password
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="absolute right-0 top-0 text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Forgot password
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Sign in
            </button>
            <a
              href="/register"
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
            >
              Create account
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

export default LoginForm;