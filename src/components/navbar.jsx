"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Search, Menu, X, ChevronDown, User } from "lucide-react"
import cloth_1 from "../assets/cloth-1.jpg"
import cloth_2 from "../assets/cloth-2.jpg"
import logo from "../assets/udobn_logo.png"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)

  // Menu data (unchanged)
  const menuData = {
    Men: {
      featuredImage: cloth_1,
      featuredText: "Men's New Collection",
      CLOTHING: [
        "All Mens Clothing",
        "Shirts",
        "Tees & Polos",
        "Sweatshirt & Hoodies",
        "Pants",
        "Jeans",
        "Shorts",
        "Coats & Jackets",
        "Blazers",
        "Sweaters",
      ],
      ACCESSORIES: [
        "All Mens Accessories",
        "Footwear",
        "Bag",
        "Hat & Cap",
        "Sunglasses",
        "Socks & Underwear",
        "Wallets & Belts",
      ],
    },
    Women: {
      featuredImage: cloth_2,
      featuredText: "Women's Latest Trends",
      CLOTHING: ["All Womens Clothing", "Dresses", "Tops", "Pants", "Skirts", "Jackets"],
      ACCESSORIES: ["All Womens Accessories", "Jewelry", "Bags", "Shoes", "Scarves"],
    },
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
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="w-full">
        {/* Welcome message - visible on all screens */}
        <div className="bg-black text-white py-2 text-center text-sm w-full">Welcome to One Nice Shop!</div>

        <div className="flex items-center justify-between h-20 px-4 md:px-6">
          <a href="/">
            <img src={logo || "/placeholder.svg"} className="h-12 w-12" alt="Logo" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {Object.keys(menuData).map((item) => (
              <button
                key={item}
                className="hover:text-gray-600 flex items-center gap-1"
                onMouseEnter={() => toggleMenu(item)}
              >
                {item}
                <ChevronDown className="w-4 h-4" />
              </button>
            ))}
            <a href="#" className="hover:text-gray-600">
              Curated
            </a>
            <a href="/about" className="hover:text-gray-600">
              About Us
            </a>
            <a href="#" className="text-red-500 hover:text-red-600">
              Sale
            </a>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            <User className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          </div>

          {/* Mobile Menu Toggle */}
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
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="w-full px-4 md:px-6 py-8">
              <div className="grid grid-cols-3 gap-8">
                {/* Categories */}
                <div className="col-span-2 grid grid-cols-2 gap-8">
                  {Object.entries(menuData[activeMenu])
                    .filter(([key]) => !["featuredImage", "featuredText"].includes(key))
                    .map(([category, items]) => (
                      <div key={category}>
                        <h3 className="font-semibold mb-4 text-gray-400">{category}</h3>
                        <ul className="space-y-2">
                          {items.map((item) => (
                            <li key={item}>
                              <a href="#" className="hover:text-gray-600">
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
                {/* Featured Image */}
                <div className="col-span-1">
                  <div className="aspect-[3/4] bg-gray-100 relative">
                    <img
                      src={menuData[activeMenu].featuredImage || "/placeholder.svg"}
                      alt={`${activeMenu} Featured Collection`}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-4 left-4 text-lg font-semibold">
                      {menuData[activeMenu].featuredText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto">
          <div className="p-4 md:p-6">
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-6">
              <a href="/">
                <img src={logo || "/placeholder.svg"} className="h-8 w-8" alt="Logo" />
              </a>
              <button onClick={toggleMobileMenu} className="focus:outline-none">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {Object.entries(menuData).map(([menu, categories]) => (
                <div key={menu} className="border-b border-gray-100">
                  <button className="flex items-center justify-between w-full py-3" onClick={() => toggleMenu(menu)}>
                    <span className="text-lg font-medium">{menu}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${activeMenu === menu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {activeMenu === menu && (
                    <div className="pb-4 pl-4">
                      {Object.entries(categories)
                        .filter(([key]) => !["featuredImage", "featuredText"].includes(key))
                        .map(([category, items]) => (
                          <div key={category} className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
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

              <a href="#" className="block py-3 text-lg font-medium">
                Curated
              </a>
              <a href="/about" className="block py-3 text-lg font-medium">
                About Us
              </a>
              <a href="#" className="block py-3 text-lg font-medium text-red-500">
                Sale
              </a>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center justify-around mt-8 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center">
                <Search className="w-6 h-6 mb-1" />
                <span className="text-xs">Search</span>
              </div>
              <div className="flex flex-col items-center">
                <User className="w-6 h-6 mb-1" />
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

