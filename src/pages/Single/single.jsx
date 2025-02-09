"use client"

import { useState } from "react"
import { ChevronRight, Minus, Plus } from "lucide-react"
import hoodie from '../../assets/hoodie.jpg'
export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M")
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(0)

  const images = [
   hoodie,
    hoodie,
    hoodie,
  ]

  const sizes = ["S", "M", "L", "XL"]

  const relatedProducts = [
    {
      name: "Baseile Pocket Tee",
      price: 68.0,
      image: hoodie,
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    {
      name: "Byron Double Knit Cardigan",
      price: 168.0,
      image:hoodie,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Bklyn Jogger",
      price: 118.0,
      image: hoodie,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Harper Hoodie",
      price: 118.0,
      image: hoodie,
      sizes: ["S", "M", "L", "XL"],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <a href="/" className="hover:underline">
          Home
        </a>
        <ChevronRight className="w-4 h-4" />
        <a href="/sweatshirts-hoodies" className="hover:underline">
          Sweatshirts & Hoodies
        </a>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-500">Harper Double Knit Hoodie</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative">
            <img
              src={images[mainImage] || "/placeholder.svg"}
              alt="Harper Double Knit Hoodie"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-6 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(idx)}
                className={`aspect-square border-2 ${mainImage === idx ? "border-black" : "border-transparent"}`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Product ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-medium mb-2">Harper Double Knit Hoodie</h1>
            <p className="text-2xl">$158.00</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">
              Color: <span className="text-gray-600">Dk Brown Heather</span>
            </h3>
            <div className="flex gap-2">
              <button className="w-16 h-16 border-2 border-black p-1">
                <img src={images[0] || "/placeholder.svg"} alt="Color 1" className="w-full h-full object-cover" />
              </button>
              <button className="w-16 h-16 border p-1">
                <img src={images[0] || "/placeholder.svg"} alt="Color 2" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 border ${selectedSize === size ? "border-black" : "border-gray-200"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center border w-32">
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-2">
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-full text-center border-x"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="p-2">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 px-4 border-2 border-black hover:bg-black hover:text-white transition-colors">
              Add to cart
            </button>
            <button className="w-full py-3 px-4 bg-[#5A31F4] text-white">Buy with ShopPay</button>
            <button className="w-full py-3 px-4 text-gray-600 hover:underline">More payment options</button>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 mt-1">✓</div>
              <div>
                <p className="font-medium">Pickup available at 005 - 201 MULBERRY - FLAGSHIP</p>
                <p className="text-gray-600">Usually ready in 24 hours</p>
                <button className="text-gray-600 hover:underline">View store information</button>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="mb-4">
              The Harper Double Knit Hoodie is not your average hoodie. It offers the same high-quality construction as
              our popular Byron Pique Cardigan, giving you a comfortable and warm layering piece. Made with a wool mix
              double knit, this hoodie is both durable and cozy, making it the perfect choice for your everyday casual
              look.
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Double Knit Fabric</li>
              <li>Regular Fit</li>
              <li>Mid Weight</li>
              <li>Textured</li>
              <li>Zipper Closure</li>
              <li>Melange Appearance</li>
              <li>55% Polyester 27% Viscose 13% Cotton 5% Wool Double Face</li>
            </ul>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <div className="mt-16">
        <h2 className="text-2xl mb-8">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((product, idx) => (
            <div key={idx} className="group">
              <div className="aspect-square mb-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium group-hover:underline">{product.name}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <div className="flex gap-1 mt-2">
                {product.sizes.map((size) => (
                  <span key={size} className="text-xs text-gray-600">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="mt-16 border-t pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Customer Reviews</h2>
          <button className="px-4 py-2 border hover:bg-gray-50">Write a review</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-gray-300">
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-600">Be the first to write a review</p>
        </div>
      </div>
    </div>
  )
}

