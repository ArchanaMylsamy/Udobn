import React from 'react';
import { Home, Users, Briefcase, Mail } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">MyBrand</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Home className="mr-2" size={20} /> Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Users className="mr-2" size={20} /> About
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Briefcase className="mr-2" size={20} /> Services
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Mail className="mr-2" size={20} /> Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow flex items-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Our Platform</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover innovative solutions that transform your business and drive growth.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Get Started
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Users className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3">User-Friendly</h3>
              <p className="text-gray-600">Intuitive design that makes navigation seamless.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Briefcase className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scalable Solutions</h3>
              <p className="text-gray-600">Adaptable platforms that grow with your needs.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <Mail className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">Dedicated team always ready to help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 MyBrand. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;