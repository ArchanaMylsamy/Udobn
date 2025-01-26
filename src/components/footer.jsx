"use client"

import { Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold">Our Story</h3>
            <p className="text-gray-600 text-sm">
              ONS started as a menswear brand in 2016 focused on versatile styling, consistent fits and comfortable
              fabrics.
            </p>
            <p className="text-gray-600 text-sm">
              Since our inception, we want to bring our ethos from your wardrobe to every part of your home. Evolving
              from One Nice Shirt to One Nice Shop.
            </p>
            <p className="text-gray-600 text-sm">
              One Nice Shop is our concept store in New York City. Curated with love and care to showcase brands we
              believe are fitting to our ethos.
            </p>
            <p className="text-gray-600 text-sm">Join our journey on finding quality goods from around the world!</p>
            <a href="https://instagram.com" className="inline-block hover:opacity-75">
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Information</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                About Us
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Press
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Careers
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Gift Card Policy
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Promo Code Terms & Conditions
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Wholesale
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Help</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Nice Rewards
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Gift Card Balance
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Returns & Shipping
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Size Guide
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Locations
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="block text-gray-600 hover:text-gray-900">
                Terms & Conditions
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Newsletter</h3>
            <p className="text-gray-600 text-sm">Sign up for exclusive offers, original stories, events and more.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <select className="text-sm border rounded p-1">
                <option>United States (USD $)</option>
              </select>
              <p className="text-sm text-gray-600">© 2024 ONS Clothing</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <img src="/placeholder.svg?height=20&width=32" alt="American Express" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Apple Pay" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Discover" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Google Pay" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Mastercard" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="PayPal" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Shop Pay" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Venmo" className="h-5" />
              <img src="/placeholder.svg?height=20&width=32" alt="Visa" className="h-5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

