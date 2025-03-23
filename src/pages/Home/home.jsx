import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { Instagram, ShoppingBag, Search, ChevronLeft, ChevronRight, MapPin, Gift, Truck } from "lucide-react"
import { useInView } from "react-intersection-observer"
import cloth_1 from '../../assets/cloth-1.jpg'
import cloth_2 from '../../assets/cloth-2.jpg'
import cloth_3 from '../../assets/cloth-3.jpg'
import shoe_1 from '../../assets/shoe-1.jpg'
import shoe_2 from '../../assets/shoe-2.jpg'

const CuratedBrands = () => {
  const location = useLocation();
    useEffect(() => {
      // Reset scroll position to the top of the page whenever the route changes
      window.scrollTo(0, 0);
    }, [location]);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth; // Scroll by the width of the container
      
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Curated Brands</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')} 
              className="p-2 rounded-full bg-white shadow hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="p-2 rounded-full bg-white shadow hover:bg-gray-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Product Cards */}
          {[
            { img: cloth_2, name: 'Apex Shirt', price: '$245.00' },
            { img: cloth_3, name: 'Apex Shirt', price: '$245.00' },
            { img: shoe_1, name: 'Apex Shoe', price: '$245.00' },
            { img: shoe_2, name: 'Apex Shoe', price: '$245.00' },
            { img: shoe_2, name: 'Apex Shoe', price: '$245.00' },
            
          ].map((product, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-74 bg-white rounded-lg shadow-sm p-4"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={product.img}
                alt="Product"
                className="w-full h-64 object-cover rounded mb-4"
              />
              <div className="space-y-2">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Homepage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
     

      {/* Shipping Info */}
      {/* <div className="border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between text-sm">
            <span>Free shipping on orders over $150</span>
            <span>Free in-store pickup on Mulberry Street</span>
            <span>Same Day Local Delivery Available</span>
          </div>
        </div>
      </div> */}

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-black text-white py-32 overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle at 0% 0%, #dc2626 0%, transparent 50%)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1
            className={`text-6xl md:text-8xl font-bold mb-6 transition-all duration-1000 transform ${
              heroInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            end of season sale
          </h1>
          <p
            className={`text-xl md:text-2xl mb-8 transition-all duration-1000 delay-300 transform ${
              heroInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            50% off Udobn and future classics
          </p>
          <p className="text-sm mb-8">*exclusions apply</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition">SHOP WOMEN</button>
            <button className="bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition">SHOP MEN</button>
          </div>
        </div>
      </section>

      {/* Core Styles Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={cloth_1}
                alt="Udobn Core Styles"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Udobn Core Styles</h2>
              <p className="text-gray-600 text-lg">
                At Udobn, we believe that style and comfort should go hand in hand. We design garments that are not only
                practical and versatile but also stylish and on-trend. Our Core Styles offer high quality and elevated
                designs, making them must have pieces in your wardrobe.
              </p>
              <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-900 transition">
                SHOP CORE STYLES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Brands Section */}
      <CuratedBrands/>

      {/* Brand Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop Curated Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-96">
              <img
                src={cloth_2}
                alt="Troubadour"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">TROUBADOUR</h3>
              </div>
            </div>
            <div className="relative h-96">
              <img
                src={cloth_3}
                alt="Troubadour"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">TROUBADOUR</h3>
              </div>
            </div>
            <div className="relative h-96">
              <img
                src={shoe_1}
                alt="Troubadour"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">TROUBADOUR</h3>
              </div>
            </div>
            <div className="relative h-96">
              <img
                src={shoe_2}
                alt="Troubadour"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">TROUBADOUR</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  )
}

