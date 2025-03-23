import { Shirt } from "lucide-react";
import { useState, useEffect } from "react"
import { ShoppingCart, Search, Menu, X, ChevronDown, User, Instagram, ChevronRight } from "lucide-react"
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext'; // Import our new context
import {Link} from "react-router-dom"

import logo from "../assets/udobn_logo.png"

import customize_image from '../assets/color-selection.png'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [activeCategory, setActiveCategory] = useState("All Products")
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false)
  const { cartItemsCount, setIsCartOpen, setCurrency } = useCart();
  const { currency, country, updateCurrency } = useCurrency(); // Use our new context

  // Updated countries to include India and USA only
  const countries = [
    { name: "USA", currency: "USD", symbol: "$" },
    { name: "India", currency: "INR", symbol: "₹" }
  ]

  const selectedCountry = countries.find(c => c.currency === currency) || countries[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuData = {
    Men: {
      featuredImage: "/placeholder.svg?height=400&width=300",
      featuredText: "Men's New Collection",
      categories: {
        "All Products": [
          { name: "T-Shirts", link: "/men/clothing" },
          { name: "Hoodies", link: "/men/hoodies" },
          { name: "Sweatshirts", link: "/men/sweatshirts" },
          { name: "Sports T-Shirts", link: "/men/sports-t-shirts" },
        ],
        "T-Shirts": [
          { name: "Graphic Tees", link: "/men/t-shirts/graphic-tees" },
          { name: "Plain T-Shirts", link: "/men/t-shirts/plain" },
          { name: "Polo T-Shirts", link: "/men/t-shirts/polo" },
          { name: "Long Sleeve T-Shirts", link: "/men/t-shirts/long-sleeve" },
        ],
        Hoodies: [
          { name: "Pullover Hoodies", link: "/men/hoodies/pullover" },
          { name: "Zip-Up Hoodies", link: "/men/hoodies/zip-up" },
          { name: "Sleeveless Hoodies", link: "/men/hoodies/sleeveless" },
        ],
        Sweatshirts: [
          { name: "Crew Neck Sweatshirts", link: "/men/sweatshirts/crew-neck" },
          { name: "Graphic Sweatshirts", link: "/men/sweatshirts/graphic" },
          { name: "Lightweight Sweatshirts", link: "/men/sweatshirts/lightweight" },
        ],
        "Sports T-Shirts": [
          { name: "Performance Tees", link: "/men/sports-t-shirts/performance" },
          { name: "Moisture-Wicking T-Shirts", link: "/men/sports-t-shirts/moisture-wicking" },
          { name: "Running T-Shirts", link: "/men/sports-t-shirts/running" },
        ],
       
      },
    },
    Women: {
      featuredImage: "/placeholder.svg?height=400&width=300",
      featuredText: "Women's Latest Trends",
      categories: {
        "All Products": [
          { name: "T-Shirts", link: "/women/clothing" },
          { name: "Hoodies", link: "/women/hoodies" },
          { name: "Sweatshirts", link: "/women/sweatshirts" },
          { name: "Sports T-Shirts", link: "/women/sports-t-shirts" },
        ],
        "T-Shirts": [
          { name: "Graphic Tees", link: "/women/t-shirts/graphic-tees" },
          { name: "Crop Tops", link: "/women/t-shirts/crop-tops" },
          { name: "V-Neck T-Shirts", link: "/women/t-shirts/v-neck" },
          { name: "Oversized T-Shirts", link: "/women/t-shirts/oversized" },
        ],
        Hoodies: [
          { name: "Pullover Hoodies", link: "/women/hoodies/pullover" },
          { name: "Cropped Hoodies", link: "/women/hoodies/cropped" },
          { name: "Zip-Up Hoodies", link: "/women/hoodies/zip-up" },
        ],
        Sweatshirts: [
          { name: "Crew Neck Sweatshirts", link: "/women/sweatshirts/crew-neck" },
          { name: "Graphic Sweatshirts", link: "/women/sweatshirts/graphic" },
          { name: "Oversized Sweatshirts", link: "/women/sweatshirts/oversized" },
        ],
        "Sports T-Shirts": [
          { name: "Performance Tees", link: "/women/sports-t-shirts/performance" },
          { name: "Yoga Tops", link: "/women/sports-t-shirts/yoga-tops" },
          { name: "Running T-Shirts", link: "/women/sports-t-shirts/running" },
        ],
      
      },
    },
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setActiveMenu(null)
  }

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu)
    setActiveCategory("All Products") // Reset to default category when menu changes
  }

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu)
    if (!activeCategory) {
      setActiveCategory("All Products")
    }
  }

  const handleNavClick = () => {
    setActiveMenu(null)
    setActiveCategory("All Products")
  }

  const handleCountryChange = (country) => {
    updateCurrency(country.currency, country.name);
    setIsCountryMenuOpen(false);
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
            <a to="https://instagram.com" className="hover:text-gray-300">
              <Instagram className="w-5 h-5" />
            </a>
            <span className="text-sm hidden sm:block">Welcome to Udobn Shop!</span>
            <div className="relative">
              <button
                onClick={() => setIsCountryMenuOpen(!isCountryMenuOpen)}
                className="flex items-center space-x-1 text-sm hover:text-gray-300"
              >
                <span>
                  {selectedCountry.name} ({selectedCountry.currency} {selectedCountry.symbol})
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCountryMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                  {countries.map((country) => (
                    <button
                      key={country.name}
                      onClick={() => handleCountryChange(country)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      {country.name} ({country.currency} {country.symbol})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between h-20 px-4 md:px-6">
          <Link to="/">
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img src={logo || "/placeholder.svg"} alt="Logo" width={48} height={48} />
            </div>
          </Link>
 
          <div className="hidden md:flex space-x-8">
            {/* {Object.keys(menuData).map((item) => (
              <button
                key={item}
                className="hover:text-gray-600 flex items-center gap-1"
                onMouseEnter={() => handleMouseEnter(item)}
              >
                {item}
                <ChevronDown className="w-4 h-4" />
              </button>
            ))} */}

            <Link
              to="/men/clothing"
              className="hover:text-gray-600"
              onClick={handleNavClick}
              onMouseEnter={() => setActiveMenu(null)}
            >
              Men
            </Link>
            <Link
              to="/women/clothing"
              className="hover:text-gray-600"
              onClick={handleNavClick}
              onMouseEnter={() => setActiveMenu(null)}
            >
              Women
            </Link>
            <Link
              to="/about"
              className="hover:text-gray-600"
              onClick={handleNavClick}
              onMouseEnter={() => setActiveMenu(null)}
            >
              About Us
            </Link>
            <a 
              href="/customizer" 
              className="text-black-500 hover:text-gray-600 flex items-center gap-1"
              onClick={handleNavClick}
              onMouseEnter={() => setActiveMenu(null)}
            >
              Customize <Shirt className="w-5 h-5" />
            </a>
          
            
            
          </div>

          <div className="hidden md:flex items-center space-x-6">
           
            <Link to="/login">
              <User className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            </Link>
            <Link  onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            </Link>
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
              setActiveCategory("All Products")
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
                        activeCategory === category ? "bg-gray-50" : ""
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
                      {menuData[activeMenu].categories[activeCategory]?.map((item) => (
                        <Link
                          key={item.name}
                          to={item.link}
                          className="text-gray-600 hover:text-gray-900"
                          onClick={handleNavClick}
                        >
                          {item.name}
                        </Link>
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
              <Link to="/">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="Logo" width={32} height={32} />
                </div>
              </Link>
              <button onClick={toggleMobileMenu} className="focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(menuData).map(([menu, data]) => (
                <div key={menu} className="border-b border-gray-100">
                  <button className="flex items-center justify-between w-full py-3" onClick={() => toggleMenu(menu)}>
                    <span className="text-lg font-medium">{menu}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${activeMenu === menu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {activeMenu === menu && (
                    <div className="pb-4 pl-4">
                      {Object.entries(data.categories).map(([category, items]) => (
                        <div key={category} className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.link}
                                  className="text-gray-600 text-sm block py-1"
                                  onClick={toggleMobileMenu}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <Link to="/about" className="block py-3 text-lg font-medium" onClick={toggleMobileMenu}>
                About Us
              </Link>
              
            </div>

            <div className="flex items-center justify-around mt-8 pt-4 border-t border-gray-100">
              
              <Link to="/login" className="flex flex-col items-center" onClick={toggleMobileMenu}>
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs">Account</span>
              </Link>
              <Link onClick={() => setIsCartOpen(true)} className="flex flex-col items-center" >
                <ShoppingCart className="w-6 h-6 mb-1" />
                <span className="text-xs">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}