// src/MensCollection.jsx
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./menstyle.css";
import SimpleCart from "../../components/Cart";
import { useCart } from "../../context/CartContext";

export default function MensCollection() {
  const { 
    selectedSizes, 
    handleSizeSelect, 
    addToCart, 
    cartItemsCount, 
    setIsCartOpen 
  } = useCart();
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  
  const products = [
    {
      id: 1,
      name: "Adrian Herringbone Shirt",
      brand: "O.N.S Clothing",
      price: 118.0,
      image: "/placeholder.svg",
      color: "Lt Blue",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 2,
      name: "Adrian Stripe Shirt",
      brand: "O.N.S Clothing",
      price: 118.0,
      image: "/placeholder.svg",
      color: "Lt Blue",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 3,
      name: "Aleks Corduroy Shirt",
      brand: "O.N.S Clothing",
      price: 128.0,
      image: "/placeholder.svg",
      color: "Gray",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 4,
      name: "Aleks Heather Oxford Shirt",
      brand: "O.N.S Clothing",
      price: 98.0,
      image: "/placeholder.svg",
      color: "White",
      sizes: ["S", "M", "L", "XL", "XXL"],
    },
    {
      id: 5,
      name: "All Day Dopp Kit",
      brand: "O.N.S Clothing",
      price: 78.0,
      image: "/placeholder.svg",
      color: "Black",
      sizes: ["OS"],
    },
  ];
  
  return (
    <div className="mens-collection">
      <header className="hero" data-aos="fade-down">
        <div className="logo">Udobn</div>
        <h1>Mens Collection</h1>
        
      </header>
      
      <main>
        <div className="collection-header">
          <h2 data-aos="fade-right">Shop All Mens</h2>
          <div className="collection-controls">
            <button className="filter-btn">
              <span>Filter</span>
            </button>
            <select className="sort-select" defaultValue="alphabetically">
              <option value="alphabetically">Alphabetically, A-Z</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </div>
        </div>
        
        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product.id} className="product-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="product-image">
                <img src={product.image || "/placeholder.svg"} alt={product.name} />
                <button className="quick-buy" onClick={() => addToCart(product)}>Quick buy</button>
              </div>
              <div className="product-info">
                <span className="brand">{product.brand}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="price">${product.price.toFixed(2)}</span>
                <div className="sizes">
                  {product.sizes.map((size) => (
                    <span 
                      key={size} 
                      className={`size ${selectedSizes[product.id] === size ? 'selected' : ''}`}
                      onClick={() => handleSizeSelect(product.id, size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <button 
                  className="add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Simple Cart Component */}
      <SimpleCart />
    </div>
  );
}