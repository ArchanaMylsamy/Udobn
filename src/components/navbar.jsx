"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Search, Menu, X, ChevronDown, User, Instagram, ChevronRight } from "lucide-react"
import cloth_1 from "../assets/cloth-1.jpg"
import cloth_2 from "../assets/cloth-2.jpg"
import logo from "../assets/udobn_logo.png"
import { Link } from "react-router-dom"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [activeCategory, setActiveCategory] = useState("All Clothing")
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false)

  const countries = [
    { name: "Sweden", currency: "SEK kr" },
    { name: "Norway", currency: "NOK kr" },
    { name: "Denmark", currency: "DKK kr" },
    { name: "Finland", currency: "EUR" },
  ]

  const [selectedCountry, setSelectedCountry] = useState(countries[0])

  const menuData = {
    Men: {
      featuredImage: cloth_1,
      featuredText: "Men's New Collection",
      categories: {
        "All Clothing": [
          "New Arrivals",
          "Trending Now",
          "Basics",
          "Activewear",
          "Occasion Wear"
        ],
        "Tops": [
          "T-Shirts",
          "Shirts",
          "Polos",
          "Sweatshirts",
          "Hoodies",
          "Jackets"
        ],
        "Bottoms": [
          "Pants",
          "Jeans",
          "Shorts",
          "Joggers",
          "Cargo Pants"
        ],
        "Accessories": [
          "Bags",
          "Hats",
          "Belts",
          "Sunglasses",
          "Watches"
        ]
      }
    },
    Women: {
      featuredImage: cloth_2,
      featuredText: "Women's Latest Trends",
      categories: {
        "All Clothing": [
          "T-Shirts",
          "Hoodies",
          "Sweatshirt",
          "Sports T-Shirts",
          "Jackets",
          "Shorts",
          "Joggers"
        ],
        "Tops": [
          "T-Shirts",
          "Sweatshirts",
          "Sports T-Shirts",
          "Hoodies",
          "Jackets"
        ],
        "Bottoms": [  
          "Shorts",
          "Joggers"
        ],
        "Best Sellers": [
          "T-Shirts",
          "Hoodies",
          "Jackets",
          "Joggers"
        ]
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveMenu(null)
  }

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu)
    setActiveCategory("All Clothing") // Reset to default category when menu changes
  }

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu)
    if (!activeCategory) {
      setActiveCategory("All Clothing")
    }
  }

  const handleNavClick = () => {
    setActiveMenu(null)
    setActiveCategory("All Clothing")
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="w-full">
        {/* Welcome Banner */}
        <div className="bg-black text-white">
          <div className="max-w-screen-2xl mx-auto px-4 py-2 flex justify-between items-center">
            <a href="https://instagram.com" className="hover:text-gray-300">
              <Instagram className="w-5 h-5" />
            </a>
            <span className="text-sm hidden sm:block">Welcome to One Nice Shop!</span>
            <div className="relative">
              <button
                onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                className="flex items-center space-x-1 text-sm hover:text-gray-300"
              >
                <span>{selectedCountry.name} ({selectedCountry.currency})</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCountryMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden">
                  {countries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => {
                        setSelectedCountry(country)
                        setIsCountryMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {country.name} ({country.currency})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between h-20 px-4 md:px-6">
          <a href="/">
            <img src={logo || "/placeholder.svg"} className="h-12 w-12" alt="Logo" />
          </a>

          <div className="hidden md:flex space-x-8">
            {Object.keys(menuData).map((item) => (
              <button
                key={item}
                className="hover:text-gray-600 flex items-center gap-1"
                onMouseEnter={() => handleMouseEnter(item)}
              >
                {item}
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
            <a 
              href="/about" 
              className="hover:text-gray-600"
              onClick={handleNavClick}
              onMouseEnter={() => setActiveMenu(null)}
            >
              About Us
            </a>
            <a 
              href="#" 
              className="text-red-500 hover:text-red-600"
              onClick={handleNavClick}
              onMouseEnter={() => setActiveMenu(null)}
            >
              Sale
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            <a href="/login"><User className="w-5 h-5 cursor-pointer hover:text-gray-600" /></a>
            <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          </div>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu */}
        {activeMenu && (
          <div
            className="hidden md:block absolute left-0 right-0 bg-white shadow-lg border-t"
            onMouseLeave={() => {
              setActiveMenu(null)
              setActiveCategory("All Clothing")
            }}
          >
            <div className="w-full px-4 md:px-6 py-8">
              <div className="grid grid-cols-4 gap-8">
                {/* Categories Column */}
                <div className="col-span-1 border-r">
                  {Object.keys(menuData[activeMenu].categories).map((category) => (
                    <div
                      key={category}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                        activeCategory === category ? 'bg-gray-50' : ''
                      }`}
                      onMouseEnter={() => setActiveCategory(category)}
                    >
                      <span className="font-medium">{category}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ))}
                </div>

                {/* Subcategories Column */}
                <div className="col-span-2">
                  <div className="px-4">
                    <h3 className="font-semibold mb-4">{activeCategory}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {menuData[activeMenu].categories[activeCategory].map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="text-gray-600 hover:text-gray-900"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="col-span-1">
                  <div className="aspect-[3/4] bg-gray-100 relative">
                    <img
                      src={menuData[activeMenu].featuredImage || "/placeholder.svg"}
                      alt={`${activeMenu} Featured Collection`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-4 left-4 text-lg font-semibold text-white">
                      {menuData[activeMenu].featuredText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <a href="/">
                <img src={logo || "/placeholder.svg"} className="h-8 w-8" alt="Logo" />
              </a>
              <button onClick={toggleMobileMenu} className="focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(menuData).map(([menu, data]) => (
                <div key={menu} className="border-b border-gray-100">
                  <button
                    className="flex items-center justify-between w-full py-3"
                    onClick={() => toggleMenu(menu)}
                  >
                    <span className="text-lg font-medium">{menu}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        activeMenu === menu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeMenu === menu && (
                    <div className="pb-4 pl-4">
                      {Object.entries(data.categories).map(([category, items]) => (
                        <div key={category} className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-400 mb-2">
                            {category}
                          </h3>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item}>
                                <a href="#" className="text-gray-600 text-sm block py-1">
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a href="/about" className="block py-3 text-lg font-medium">
                About Us
              </a>
              <a href="#" className="block py-3 text-lg font-medium text-red-500">
                Sale
              </a>
            </div>

            <div className="flex items-center justify-around mt-8 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center">
                <Search className="w-6 h-6 mb-1" />
                <span className="text-xs">Search</span>
              </div>
              <div className="flex flex-col items-center">
                <a href="/login"><User className="w-6 h-6 mb-1" /></a>
                <span className="text-xs">Account</span>
              </div>
              <div className="flex flex-col items-center">
                <ShoppingBag className="w-6 h-6 mb-1" />
                <span className="text-xs">Cart</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}