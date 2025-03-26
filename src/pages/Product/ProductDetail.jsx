import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import SimpleCart from '../../components/Cart';
const API_BASE_URL="https://udobn-backend.vercel.app"
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(response.data.product);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    
    addToCart({
      ...product,
      selectedSize,
      quantity
    });
  };
  
  const parseSizes = (product) => {
    if (!product || !product.sizes) return [];
    
    let parsedSizes = [];
    if (Array.isArray(product.sizes)) {
      try {
        parsedSizes = product.sizes.map(size => {
          return size.replace(/[\[\]"\\]/g, '');
        });
      } catch (e) {
        parsedSizes = product.sizes;
      }
    }
    
    return parsedSizes;
  };
  
  const goToNextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image Section */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 && (
              <>
                <div className="absolute top-4 right-4 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  onClick={goToNextImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Product Details Section */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <p className="text-2xl text-gray-800 mb-4">
            {formatPrice(product)}
          </p>
                  
          {/* Brand */}
          <div className="mb-6">
            <p className="text-gray-700">
              By <span className="underline">Udobn</span>
            </p>
          </div>
     
          {/* Size selection */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {parseSizes(product).map((size) => (
                <button
                  key={size}
                  className={`w-16 h-12 border rounded-md flex items-center justify-center 
                    ${selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity selector */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Quantity</p>
            <div className="flex items-center">
              <button 
                className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center"
                onClick={decreaseQuantity}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="w-20 h-12 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </div>
              <button 
                className="w-12 h-12 border border-gray-300 rounded-md flex items-center justify-center"
                onClick={increaseQuantity}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Add to cart button */}
          <button 
            className="w-full py-4 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          
          {/* Product description - optional */}
          {product.description && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
        </div>
      </div>
      
      <SimpleCart />
    </div>
  );
}