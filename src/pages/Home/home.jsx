import { useEffect, useRef, useState } from "react"
import { useLocation,Link } from "react-router-dom"
import { Instagram, ShoppingBag, Search, ChevronLeft, ChevronRight, MapPin, Gift, Truck } from "lucide-react"
import axios from "axios"
import { useInView } from "react-intersection-observer"
import cloth_1 from '../../assets/cloth-1.jpg'
import cloth_2 from '../../assets/cloth-2.jpg'
import cloth_3 from '../../assets/cloth-3.jpg'
import shoe_1 from '../../assets/shoe-1.jpg'
import shoe_2 from '../../assets/shoe-2.jpg'
import { useCurrency } from '../../context/CurrencyContext';
const API_BASE_URL="https://udobn-backend.vercel.app"
const CuratedBrands = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);
  const { formatPrice } = useCurrency();
  useEffect(() => {
    // Reset scroll position to the top of the page whenever the route changes
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/latest`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]); // Ensure it's always an array
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Handle errors safely
      }
    };
    fetchProducts();
  }, []);  

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth; // Scroll by the width of the container
      
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Recent Launches</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")} 
              className="p-2 rounded-full bg-white shadow hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll("right")} 
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
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Render fetched products */}
          {products.length > 0 ? (
            products.map((product, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-74 bg-white rounded-lg shadow-sm p-4"
                style={{ scrollSnapAlign: "start" }}
              >
                <img
                  src={product.images[0]} // Ensure backend returns image URL
                  alt={product.name}
                  className="w-full h-64 object-cover rounded mb-4"
                />
                <div className="space-y-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{formatPrice(product)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading products...</p>
          )}
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
            <Link to="/women/clothing"><button className="bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition">SHOP WOMEN</button></Link>
            <Link to="/men/clothing"><button className="bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition">SHOP MEN</button></Link>
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
              <br></br>
              <Link to="/about"><button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-900 transition">
                About Us
              </button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Brands Section */}
      <CuratedBrands/>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features of Our Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Row - Two Items */}
            <div className="relative h-96">
              <img
                src={cloth_2}
                alt="Men's Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">Men's Collection</h3>
              </div>
            </div>
            <div className="relative h-96">
              <img
                src="https://tse2.mm.bing.net/th/id/OIP.GDTvT4DvB2zOMPbvuNRubAHaJ3?w=600&h=799&rs=1&pid=ImgDetMain"
                alt="Women's Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">Women's Collection</h3>
              </div>
            </div>
            
            {/* Second Row - Centered Item */}
            <div className="relative h-96 md:col-span-2 flex justify-center">
              <div className="w-full md:w-2/3">
                <img
                  src={cloth_3}
                  alt="Customization Available"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0  flex items-center justify-center">
                  <h3 className="text-white text-4xl font-bold">Customization Available</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 relative">
          {/* Image Grid */}
          <div className="col-span-1">
            <img src="https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/assets/images/8087279/2018/12/5/dd3d6efe-496b-4f3c-bd52-3a875400bfde1543992100251-PUNK-Men-Black-Printed-Round-Neck-T-shirt-4571543992098930-1.jpg" alt="Tee 1" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://tse2.mm.bing.net/th/id/OIP.Y-S8lRN1ea1l2xmGw3eIAQHaJQ?w=1080&h=1350&rs=1&pid=ImgDetMain" alt="Tee 2" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://n3.sdlcdn.com/imgs/a/x/o/Goa-Men-s-Cotton-V-SDL652818818-1-b9ea3.jpg" alt="Tee 3" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://ilarge.lisimg.com/image/6133517/740full-bernardo-arriagada.jpg" alt="Tee 4" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://i.pinimg.com/736x/17/4b/5e/174b5ea6085ee061c43c7b93059e7ac5.jpg" alt="Tee 5" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://images.bewakoof.com/original/conditions-apply-white-graphic-t-shirt-404117-1656189831-1.jpg" alt="Tee 6" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/images/style/properties/Roadster-Men-Black-Printed-T-shirt_3daa59d8e5722754c8e5290bfe6baf14_images.jpg" alt="Tee 7" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-1">
            <img src="https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_100,w_1080/v1/image/style/properties/454468/Roadster-Men-Grey-Melange-Bike-Printed-T-shirt_1_a60452661188c295a2cab040d613b06f.jpg" alt="Tee 8" className="w-full h-full object-cover" />
          </div>

          {/* Centered Instagram Promo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black text-white p-6 md:p-8 text-center w-3/4 md:w-1/2">
              <h2 className="text-lg md:text-xl font-bold">INSTAGRAM</h2>
              <p className="text-sm md:text-base font-semibold">@udobn</p>
              <p className="mt-2 text-xs md:text-sm">
                Curated for comfort, designed for style. Explore the bold world of oversized fashion with Unknowns – where every tee tells a story. #StayUnknown
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
     
    </div>
  )
}

