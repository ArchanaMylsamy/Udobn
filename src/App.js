
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Homepage from './pages/Home/home'
import About from './pages/About/about'
import LoginForm from './pages/Account/login';
import RegistrationForm from './pages/Account/register';
import Contact from './pages/Contact/contact'
import Terms_Conditions from './pages/Terms&Conditions/terms'
import Footer from './components/footer';
import MensCollection from './pages/Men/men';
import ProductPage from './pages/Single/single';
function App() {
  return (
    <div className="App">
      
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegistrationForm/>}/>
        <Route path="/men/clothing" element={<MensCollection/>}/>
        <Route path="product" element={<ProductPage/>}/>
        <Route path="/terms" element={<Terms_Conditions/>}/>
      </Routes>
      </BrowserRouter>
     <Footer/>
    </div>
  );
}

export default App;
