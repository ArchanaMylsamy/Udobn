
import './App.css';
import Navbar from './components/navbar';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Homepage from './pages/Home/home'
import Footer from './components/footer';
function App() {
  return (
    <div className="App">
      <Navbar/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
      
      </Routes>
      </BrowserRouter>
     <Footer/>
    </div>
  );
}

export default App;
