
import './App.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Homepage from './pages/Home/home'
import About from './pages/About/about'
import LoginForm from './pages/Account/login';
import RegistrationForm from './pages/Account/register';
import Contact from './pages/Contact/contact'
import Terms_Conditions from './pages/Terms&Conditions/terms';
import { CartProvider } from './context/CartContext';
import Footer from './components/footer';
import MensCollection from './pages/Men/men';
import ProductPage from './pages/Single/single';
import Cart from './components/Cart';
import TShirtCustomizer from './pages/Customizer/customizer';
import CheckoutPage from './pages/Checkout/checkout';
import WhatsAppIcon from "./components/Whatsapp";
import LastVisitedTracker from './components/LastVisitedTracker';

function App() {
  
  return (
    <div className="App">
      <CartProvider> 
      <WhatsAppIcon/>
      <BrowserRouter>
      <LastVisitedTracker/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegistrationForm/>}/>
        <Route path="/men/clothing" element={<MensCollection/>}/>
        <Route path="product" element={<ProductPage/>}/>
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/terms" element={<Terms_Conditions/>}/>
        <Route path="/customizer" element={<TShirtCustomizer/>}/>
      </Routes>
      </BrowserRouter>
      <Footer/>
      </CartProvider>
    </div>
  );
}

export default App;
