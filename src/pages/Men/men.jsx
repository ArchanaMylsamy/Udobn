import { useEffect, useState } from "react";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import "./menstyle.css";
import SimpleCart from "../../components/Cart";
import { useCart } from "../../context/CartContext";
import { useCurrency } from '../../context/CurrencyContext';
import axios from "axios";
import ProductImageCarousel from "../../components/ProductImageCarousel"; // Import the new component

export default function MensCollection() {
  const navigate = useNavigate();
  const { addToCart, cartItemsCount, setIsCartOpen, currency } = useCart();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("alphabetically");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { formatPrice } = useCurrency();
  
  const categories = [
    { id: "all", name: "All Products" },
    { id: "tshirts", name: "T-shirts" },
    { id: "hoodies", name: "Hoodies" },
    { id: "sweatshirts", name: "Sweatshirts" },
    { id: "sports", name: "Sports T-shirts" }
  ];
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [products, selectedCategory, sortOrder, currency]);
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/gender/Male');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const applyFiltersAndSort = () => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(product => {
        const productCategory = product.category?.toLowerCase() || '';
        const productName = product.name.toLowerCase() || '';
        
        switch(selectedCategory) {
          case "tshirts":
            return productCategory === "t-shirt" || 
                   productCategory.includes("tshirt") ||
                   productName.includes("t-shirt") ||
                   productName.includes("tshirt");
          case "hoodies":
            return productCategory.includes("hoodie") ||
                   productName.includes("hoodie");
          case "sweatshirts":
            return productCategory === "sweat-shirts" ||
                   productCategory.includes("sweatshirt") ||
                   productName.includes("sweatshirt");
          case "sports":
            return (productCategory.includes("sport") || productName.includes("sport"));
          default:
            return true;
        }
      });
    }
    
    switch (sortOrder) {
      case "alphabetically":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    
      case "price-asc":
        result.sort((a, b) => {
          const priceA = currency === "USD" ? a.price.usd : a.price.inr;
          const priceB = currency === "USD" ? b.price.usd : b.price.inr;
          return priceA - priceB;
        });
        break;
    
      case "price-desc":
        result.sort((a, b) => {
          const priceA = currency === "USD" ? a.price.usd : a.price.inr;
          const priceB = currency === "USD" ? b.price.usd : b.price.inr;
          return priceB - priceA;
        });
        break;
    
      default:
        break;
    }
    
    setFilteredProducts(result);
  };
   
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };
  
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  
  const parseSizes = (product) => {
    if (!product.sizes) return [];
    
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
  
  const [selectedSizes, setSelectedSizes] = useState({});

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prevSizes) => {
      const currentSize = prevSizes[productId];
  
      if (currentSize === size) {
        const newSizes = { ...prevSizes };
        delete newSizes[productId];
        return newSizes;
      }
  
      return { ...prevSizes, [productId]: size };
    });
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    
    addToCart({
      ...product,
      selectedSize: selectedSize,  
    });
  };
  
  return (
    <div className="mens-collection">
      <header className="hero" data-aos="fade-down">
        <div className="logo">Udobn</div>
        <h1>Men's Collection</h1>
      </header>
      <main>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 py-5 ps-2">
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-md border ${
                selectedCategory === category.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center md:justify-end w-full md:w-auto pe-2">
          <label htmlFor="sort-select" className="mr-2 font-medium text-gray-700">Sort by:</label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={handleSortChange}
            className="px-3 py-2 border rounded-md text-gray-800 bg-white"
          >
            <option value="alphabetically">Alphabetically</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div 
              className="product-image cursor-pointer" 
              onClick={() => handleProductClick(product._id)}
              >
                {/* Replace the single image with the carousel component */}
                <ProductImageCarousel 
                  images={product.images} 
                  productName={product.name} 
                />
              </div>
              <div className="product-info">
                <span className="brand">{product.brand}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="price">{formatPrice(product)}</span>
                <div className="sizes">
                  {parseSizes(product).map((size) => (
                    <span
                      key={`${product._id}-${size}`}
                      className={`size ${selectedSizes[product._id] === size ? 'selected' : ''}`}
                      onClick={() => {
                        handleSizeSelect(product._id, size);
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products-message">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>           
      </main>
      <SimpleCart />
    </div>
  );
}