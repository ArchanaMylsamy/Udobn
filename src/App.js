
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Homepage from './pages/Home/home'
import About from './pages/About/about'
import LoginForm from './pages/Account/login';
import RegistrationForm from './pages/Account/register';
import Contact from './pages/Contact/contact'
import Footer from './components/footer';
function App() {
  return (
    <div className="App">
      <Navbar/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegistrationForm/>}/>
      </Routes>
      </BrowserRouter>
     <Footer/>
    </div>
  );
}

export default App;
